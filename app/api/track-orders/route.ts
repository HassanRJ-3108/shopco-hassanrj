import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { shipEngine } from '@/lib/shipengine'

export async function POST(req: NextRequest) {
  try {
    const { email, phone } = await req.json()

    const orders = await client.fetch(`
      *[_type == "order" && customer->email == $email && customer->phone == $phone] {
        _id,
        status,
        createdAt,
        totalAmount,
        trackingNumber,
        labelId,
        items[] {
          name,
          quantity,
          price,
          status
        }
      }
    `, { email, phone })

    // Fetch tracking info for each order
    const ordersWithTracking = await Promise.all(orders.map(async (order: any) => {
      if (order.trackingNumber) {
        try {
          const trackingInfo = await shipEngine.trackUsingLabelId(order.labelId);
          console.log('Tracking Info:', JSON.stringify(trackingInfo, null, 2));
          return { ...order, trackingInfo };
        } catch (error) {
          console.error(`Error fetching tracking info for order ${order._id}:`, error);
          return order;
        }
      }
      return order;
    }));

    return NextResponse.json({ orders: ordersWithTracking }, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

