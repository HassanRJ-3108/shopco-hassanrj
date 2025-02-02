import { NextResponse, NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { client } from "@/sanity/lib/client"

export async function POST(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { orderId, status } = await req.json()

    const updatedOrder = await client.patch(orderId).set({ status }).commit()

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

