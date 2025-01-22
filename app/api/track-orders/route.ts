import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"
import { shipEngine } from "@/lib/shipengine"
import type { Order } from "@/types/order"

export async function POST(req: NextRequest) {
  try {
    const { email, phone } = await req.json()

    const orders = await client.fetch<Order[]>(
      `
      *[_type == "order" && customer->email == $email && customer->phone == $phone] {
        _id,
        status,
        createdAt,
        totalAmount,
        shipping {
          trackingNumber,
          label {
            id
          }
        },
        items[] {
          name,
          quantity,
          price,
          color,
          size
        }
      }
    `,
      { email, phone },
    )

    // Fetch tracking info for each order
    const ordersWithTracking = await Promise.all(
      orders.map(async (order: Order) => {
        if (order.shipping?.trackingNumber) {
          try {
            const trackingInfo = await shipEngine.trackUsingLabelId(order.shipping.label.id)
            console.log("Tracking Info:", JSON.stringify(trackingInfo, null, 2))
            return { ...order, trackingInfo }
          } catch (error) {
            console.error(`Error fetching tracking info for order ${order._id}:`, error)
            return order
          }
        }
        return order
      }),
    )

    return NextResponse.json({ orders: ordersWithTracking }, { status: 200 })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

