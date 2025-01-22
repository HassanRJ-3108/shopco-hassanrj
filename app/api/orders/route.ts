import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"
import type { Order, Customer } from "@/types/order"

export async function POST(req: NextRequest) {
  try {
    const { customer, items, totalAmount, shippingLabel, trackingNumber } = await req.json()

    const order = await client.create<Order>({
      _id: "", // Assign a unique ID if necessary
      _type: "order",
      customer: {
        _type: "reference",
        _ref: await createCustomer(customer),
      },
      items: items.map((item: any) => ({
        _key: item._key,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size,
      })),
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
      shipping: {
        carrier: "ShipEngine",
        service: "Standard",
        trackingNumber,
        cost: 0, // Assign the actual cost if available
        estimatedDays: null,
        rateId: "",
        label: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: await uploadShippingLabel(shippingLabel),
          },
        },
      },
      trackingInfo: {
        carrier: "ShipEngine",
        trackingNumber,
        status: "processing",
      },
    })

    const shipment = await client.create({
      _type: "shipment",
      order: {
        _type: "reference",
        _ref: order._id,
      },
      trackingNumber,
      carrier: "ShipEngine", // You might want to get this from the ShipEngine response
      status: "processing",
      shippingLabel: {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: await uploadShippingLabel(shippingLabel),
        },
      },
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ orderId: order._id, shipmentId: shipment._id }, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

async function createCustomer(customerData: Customer) {
  const customer = await client.create<Customer>({
    _id: "", // Assign a unique ID if necessary
    _type: "customer",
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    address: customerData.address,
    city: customerData.city,
    state: customerData.state,
    zipCode: customerData.zipCode,
  })
  return customer._id
}

async function uploadShippingLabel(labelPdfUrl: string) {
  const response = await fetch(labelPdfUrl)
  const buffer = await response.arrayBuffer()
  const asset = await client.assets.upload("file", Buffer.from(buffer), {
    filename: "shipping-label.pdf",
    contentType: "application/pdf",
  })
  return asset._id
}

