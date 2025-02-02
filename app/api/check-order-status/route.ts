import { NextResponse } from "next/server"
import Stripe from "stripe"
import { client } from "@/sanity/lib/client"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const order = await client.fetch(`*[_type == "order" && orderNumber == $sessionId][0]`, { sessionId })

    if (order) {
      return NextResponse.json({ status: "complete" })
    } else {
      return NextResponse.json({ status: "pending" })
    }
  } catch (error) {
    console.error("Error checking session status:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

