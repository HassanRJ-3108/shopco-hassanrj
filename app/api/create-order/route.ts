import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"
import { auth } from "@clerk/nextjs/server"
import Stripe from "stripe"
import {
  getShippingRates,
  createShippingLabel,
  getShipmentStatus,
  mapShipEngineStatus,
  type TrackingInfo,
} from "@/lib/shipengine"
import type { ShippingAddress, PackageDetails } from "@/types/shipping"
import type { Order, Customer, OrderItem } from "@/types/order"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { paymentIntentId, customer, items, totalAmount } = await req.json()

    // Retrieve the payment intent to get the payment details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment has not been completed")
    }

    // 1. Create or update customer in Sanity
    let sanityCustomer: Customer
    try {
      const existingCustomer = await client.fetch(`*[_type == "customer" && clerkId == $userId][0]`, { userId })
      if (existingCustomer) {
        sanityCustomer = await client
          .patch(existingCustomer._id)
          .set({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            state: customer.state,
            zipCode: customer.zipCode,
          })
          .commit()
      } else {
        sanityCustomer = await client.create({
          _type: "customer",
          clerkId: userId,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          zipCode: customer.zipCode,
        })
      }
      console.log("Created/Updated customer in Sanity:", sanityCustomer)
    } catch (error) {
      console.error("Error creating/updating customer:", error)
      throw new Error("Failed to create/update customer in Sanity")
    }

    // 2. Calculate shipping rates
    const shippingAddress: ShippingAddress = {
      name: customer.name,
      addressLine1: customer.address,
      city: customer.city,
      state: customer.state,
      zip: customer.zipCode,
      country: "US",
    }
    const packageDetails: PackageDetails = {
      weight: {
        value: 1,
        unit: "pound",
      },
      dimensions: {
        length: 12,
        width: 12,
        height: 12,
        unit: "inch",
      },
    }

    const rates = await getShippingRates(shippingAddress, [packageDetails])
    const cheapestRate = rates.sort((a, b) => a.shippingAmount.amount - b.shippingAmount.amount)[0]

    // 3. Create shipping label
    const labelResponse = await createShippingLabel(cheapestRate)

    // 4. Get tracking information
    const trackingInfo: TrackingInfo = await getShipmentStatus(labelResponse.trackingNumber)

    // 5.  Update customer in Sanity with tracking information (if needed)

    // 6. Create order items in Sanity

    // 7. Update order status in Sanity (if needed)

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
        totalAmount: paymentIntent.amount / 100, // Convert back to decimal
        status: mapShipEngineStatus(trackingInfo.status_code) || "paid", // Use ShipEngine status if available, otherwise default to "paid"
        paymentIntentId: paymentIntent.id,
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
      sanityOrder = (await client.create(orderData)) as Order
      console.log("Created order in Sanity:", sanityOrder)

      // Add order to customer's pendingDeliveries
      await client
        .patch(sanityCustomer._id)
        .setIfMissing({ pendingDeliveries: [] })
        .insert("after", "pendingDeliveries[-1]", [{ _type: "reference", _ref: sanityOrder._id }])
        .commit()
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

