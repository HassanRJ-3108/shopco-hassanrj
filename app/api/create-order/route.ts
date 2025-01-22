import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"
import {
  getShippingRates,
  createShippingLabel,
  getShipmentStatus,
  mapShipEngineStatus,
  type TrackingInfo,
} from "@/lib/shipengine"
import type { ShippingAddress, PackageDetails } from "@/types/shipping"
import type { Order, Customer, OrderItem } from "@/types/order"

export async function POST(req: NextRequest) {
  try {
    const { customer, items, totalAmount } = await req.json()
    console.log("Received order data:", { customer, items, totalAmount })

    // 1. Create customer in Sanity
    let sanityCustomer: Customer
    try {
      const customerId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sanityCustomer = await client.create({
        _type: "customer",
        _id: customerId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
      })
      console.log("Created customer in Sanity:", sanityCustomer)
    } catch (error) {
      console.error("Error creating customer:", error)
      throw new Error("Failed to create customer in Sanity")
    }

    // 2. Prepare shipping address
    const shippingAddress: ShippingAddress = {
      name: customer.name,
      phone: customer.phone,
      addressLine1: customer.address,
      cityLocality: customer.city,
      stateProvince: customer.state,
      postalCode: customer.zipCode,
      countryCode: "US", // Assuming US, adjust if needed
      addressResidentialIndicator: "yes",
    }
    console.log("Prepared shipping address:", shippingAddress)

    // 3. Calculate package details based on items
    const packageDetails: PackageDetails = {
      weight: {
        value: items.reduce((total: number, item: OrderItem) => total + item.quantity * 0.5, 0),
        unit: "pound",
      },
      dimensions: {
        length: 12,
        width: 8,
        height: 6,
        unit: "inch",
      },
    }
    console.log("Calculated package details:", packageDetails)

    // 4. Get shipping rates
    let shippingRates
    try {
      shippingRates = await getShippingRates(shippingAddress, [packageDetails])
      console.log("Got shipping rates:", shippingRates)
    } catch (error) {
      console.error("Error getting shipping rates:", error)
      throw new Error("Failed to get shipping rates")
    }

    if (!shippingRates.rateResponse.rates?.length) {
      throw new Error("No shipping rates available")
    }

    // 5. Select cheapest rate
    const cheapestRate = shippingRates.rateResponse.rates.reduce((prev, current) =>
      prev.shippingAmount.amount < current.shippingAmount.amount ? prev : current,
    )
    console.log("Selected cheapest rate:", cheapestRate)

    // 6. Create shipping label
    let labelResponse
    try {
      labelResponse = await createShippingLabel(cheapestRate.rateId)
      console.log("Created shipping label:", labelResponse)
    } catch (error) {
      console.error("Error creating shipping label:", error)
      throw new Error("Failed to create shipping label")
    }

    // 7. Get initial shipment status
    let trackingInfo: TrackingInfo
    try {
      trackingInfo = await getShipmentStatus(labelResponse.labelId)
      console.log("Initial shipment tracking info:", trackingInfo)
    } catch (error) {
      console.error("Error getting initial shipment status:", error)
      throw new Error("Failed to get initial shipment status")
    }

    // 8. Create order in Sanity
    let sanityOrder: Order
    try {
      const orderData = {
        _type: "order",
        customer: {
          _type: "reference",
          _ref: sanityCustomer._id,
        },
        items: items.map((item: OrderItem) => ({
          _key: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
        })),
        totalAmount,
        status: mapShipEngineStatus(trackingInfo.status_code),
        shipping: {
          carrier: cheapestRate.carrierCode,
          service: cheapestRate.serviceType,
          trackingNumber: trackingInfo.tracking_number,
          cost: cheapestRate.shippingAmount.amount,
          estimatedDays: cheapestRate.deliveryDays,
          rateId: cheapestRate.rateId,
          label: {
            id: labelResponse.labelId,
            pdf: labelResponse.labelDownload.pdf,
            png: labelResponse.labelDownload.png,
          },
        },
        trackingInfo: {
          status_code: trackingInfo.status_code,
          status_description: trackingInfo.status_description,
          carrier_status_code: trackingInfo.carrier_status_code,
          carrier_status_description: trackingInfo.carrier_status_description,
          shipped_date: trackingInfo.shipped_date,
          estimated_delivery_date: trackingInfo.estimated_delivery_date,
          actual_delivery_date: trackingInfo.actual_delivery_date,
          exception_description: trackingInfo.exception_description,
          events: trackingInfo.events,
        },
        createdAt: new Date().toISOString(),
      }
      console.log("Attempting to create order with data:", orderData)
      sanityOrder = await client.create(orderData) as Order
      console.log("Created order in Sanity:", sanityOrder)
    } catch (error) {
      console.error("Error creating order in Sanity:", error)
      throw new Error("Failed to create order in Sanity")
    }

    return NextResponse.json(
      {
        success: true,
        orderId: sanityOrder._id,
        trackingNumber: trackingInfo.tracking_number,
        status: mapShipEngineStatus(trackingInfo.status_code),
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error in order creation process:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create order",
        details: error.stack,
      },
      { status: 500 },
    )
  }
}

