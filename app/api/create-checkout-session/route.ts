import { stripe } from "@/app/utils/stripe"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { items, addressId, customerEmail } = await request.json()

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      customer_email: customerEmail,
      client_reference_id: userId,
      metadata: {
        addressId: addressId,
      },
      payment_method_types: ["card"],
      return_url: `${request.headers.get("origin")}/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    })

    return NextResponse.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    })
  } catch (err) {
    console.error("Error creating checkout session:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}