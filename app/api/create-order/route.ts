import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { getShippingRates, createShippingLabel } from '@/lib/shipengine'

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
  color: string;
  size: string;
}

interface ShippingRate {
  carrierCode: string;
  serviceType: string;
  shippingAmount: {
    amount: number;
  };
  deliveryDays: number;
  rateId: string;
}

interface LabelResponse {
  trackingNumber: string;
  labelId: string;
  labelDownload: {
    pdf: string;
    png: string;
  };
}

interface Order {
  _id?: string;
  _type: 'order';
  customer: {
    _type: 'reference';
    _ref: string;
  };
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    color: string;
    size: string;
  }[];
  totalAmount: number;
  status: string;
  shipping: {
    carrier: string;
    service: string;
    trackingNumber: string;
    cost: number;
    estimatedDays: number | null;
    rateId: string;
    label: {
      id: string;
      pdf: string;
      png: string;
    };
  };
  createdAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const { customer, items, totalAmount } = await req.json() as { customer: Customer; items: Item[]; totalAmount: number }

    // Create customer in Sanity
    const sanityCustomer = await client.create({
      _type: 'customer',
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode,
    })

    // Get shipping rates
    const shippingRates = await getShippingRates(
      {
        name: customer.name,
        phone: customer.phone,
        addressLine1: customer.address,
        cityLocality: customer.city,
        stateProvince: customer.state,
        postalCode: customer.zipCode,
        countryCode: 'US',
        addressResidentialIndicator: 'yes',
      },
      [{ weight: { value: 1, unit: 'pound' }, dimensions: { length: 10, width: 8, height: 4, unit: 'inch' } }]
    )

    // Select the cheapest rate
    if (!shippingRates.rateResponse.rates || shippingRates.rateResponse.rates.length === 0) {
      throw new Error('No shipping rates available')
    }

    const cheapestRate = shippingRates.rateResponse.rates.reduce((prev, current) => 
      prev.shippingAmount.amount < current.shippingAmount.amount ? prev : current
    )

    // Create shipping label
    const labelResponse = await createShippingLabel(cheapestRate.rateId)

    // Create order in Sanity
    const sanityOrder: Order = await client.create({
      _type: 'order',
      customer: {
        _type: 'reference',
        _ref: sanityCustomer._id,
      },
      items: items.map((item: Item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size,
      })),
      totalAmount,
      status: 'processing',
      shipping: {
        carrier: cheapestRate.carrierCode,
        service: cheapestRate.serviceType,
        trackingNumber: labelResponse.trackingNumber,
        cost: cheapestRate.shippingAmount.amount,
        estimatedDays: cheapestRate.deliveryDays,
        rateId: cheapestRate.rateId,
        label: {
          id: labelResponse.labelId,
          pdf: labelResponse.labelDownload.pdf,
          png: labelResponse.labelDownload.png,
        },
      },
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      orderId: sanityOrder._id, 
      trackingNumber: labelResponse.trackingNumber,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 500 })
  }
}

