import { NextResponse } from "next/server"
import { Webhook } from "svix"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { createClient } from "@sanity/client"

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-12-25', // Specify the API version
})

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local")
  }

  // Get the headers
  const svix_id = req.headers.get("svix-id")
  const svix_timestamp = req.headers.get("svix-timestamp")
  const svix_signature = req.headers.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Error occurred -- no svix headers" }, { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return NextResponse.json({ error: "Error occurred -- invalid webhook" }, { status: 400 })
  }

  // Handle the webhook
  const eventType = evt.type
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, first_name, last_name, email_addresses, image_url } = evt.data

    try {
      // Check if the customer already exists
      const existingCustomer = await sanityClient.fetch(`*[_type == "customer" && clerkId == $clerkId][0]`, {
        clerkId: id,
      })

      if (existingCustomer) {
        // Update existing customer
        await sanityClient
          .patch(existingCustomer._id)
          .set({
            firstName: first_name,
            lastName: last_name,
            email: email_addresses[0].email_address,
            imageUrl: image_url,
            updatedAt: new Date().toISOString(),
          })
          .commit()
      } else {
        // Create new customer
        await sanityClient.create({
          _type: "customer",
          clerkId: id,
          firstName: first_name,
          lastName: last_name,
          email: email_addresses[0].email_address,
          imageUrl: image_url,
          totalOrders: 0,
          totalWishlistItems: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      console.log(`Customer ${id} ${eventType === "user.created" ? "created" : "updated"} in Sanity`)
      return NextResponse.json({
        message: `Customer ${eventType === "user.created" ? "created" : "updated"} in Sanity`,
      })
    } catch (error) {
      console.error(`Error ${eventType === "user.created" ? "creating" : "updating"} customer in Sanity:`, error)
      return NextResponse.json(
        { error: `Error ${eventType === "user.created" ? "creating" : "updating"} customer in Sanity` },
        { status: 500 },
      )
    }
  }

  return NextResponse.json({ message: "Webhook received" })
}

