import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { client } from "@/sanity/lib/client"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const order = await createOrder(session)
      console.log("Order created:", order)
    } catch (error) {
      console.error("Error creating order:", error)
      return NextResponse.json({ error: "Error creating order" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

async function createOrder(session: Stripe.Checkout.Session) {
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

  const order = await client.create({
    _type: "order",
    orderNumber: session.id,
    customer: {
      _type: "reference",
      _ref: session.metadata?.customerId,
    },
    items: lineItems.data.map((item) => ({
      productId: item.price?.product as string,
      name: item.description,
      quantity: item.quantity,
      price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
    })),
    totalAmount: session.amount_total ? session.amount_total / 100 : 0,
    status: "pending",
    shipping: {
      addressId: session.metadata?.addressId,
    },
    createdAt: new Date().toISOString(),
  })

  return order
}

