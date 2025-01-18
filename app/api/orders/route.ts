import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function POST(req: NextRequest) {
  try {
    const { customer, items, totalAmount, shippingLabel, trackingNumber } = await req.json()

    const order = await client.create({
      _type: 'order',
      customer: {
        _type: 'reference',
        _ref: await createCustomer(customer),
      },
      items: items.map((item: any) => ({
        product: {
          _type: 'reference',
          _ref: item._id,
        },
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      status: 'processing',
      createdAt: new Date().toISOString(),
    })

    const shipment = await client.create({
      _type: 'shipment',
      
      order: {
        _type: 'reference',
        _ref: order._id,
      },
      trackingId: trackingNumber,
      carrier: 'ShipEngine', // You might want to get this from the ShipEngine response
      status: 'processing',
      shippingLabel: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: await uploadShippingLabel(shippingLabel),
        },
      },
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ orderId: order._id, shipmentId: shipment._id }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

async function createCustomer(customerData: any) {
  const customer = await client.create({
    _type: 'customer',
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    address: {
      addressLine1: customerData.address,
      city: customerData.city,
      state: customerData.state,
      postalCode: customerData.zipCode,
      country: 'US',
    },
  })
  return customer._id
}

async function uploadShippingLabel(labelPdfUrl: string) {
  const response = await fetch(labelPdfUrl)
  const buffer = await response.arrayBuffer()
  const asset = await client.assets.upload('file', Buffer.from(buffer), {
    filename: 'shipping-label.pdf',
    contentType: 'application/pdf',
  })
  return asset._id
}

