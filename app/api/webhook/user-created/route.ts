import { Webhook } from "svix"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { createClient } from "@sanity/client"

const webhookSecret = process.env.WEBHOOK_SECRET || ""

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-12-25', // Use the latest API version
})

async function handler(request: Request) {
  const payload = await request.json()
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    })
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error occured", {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type
  if (eventType === "user.created") {
    const { id, first_name, last_name, email_addresses } = evt.data

    try {
      // Create new customer in Sanity
      await sanityClient.create({
        _type: "customer",
        clerkId: id,
        firstName: first_name,
        lastName: last_name,
        email: email_addresses[0].email_address,
      })

      console.log(`Customer ${id} created in Sanity`)
      return NextResponse.json({ message: "Customer created in Sanity" })
    } catch (error) {
      console.error("Error creating customer in Sanity:", error)
      return NextResponse.json({ error: "Error creating customer in Sanity" }, { status: 500 })
    }
  }

  return NextResponse.json({ message: "Webhook received" })
}

export const POST = handler

