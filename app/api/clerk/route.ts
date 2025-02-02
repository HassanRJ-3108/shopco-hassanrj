// import { createClerkClient } from "@clerk/nextjs/server"

// const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

// export async function GET() {
//   try {
//     const webhooks = await clerk.webhooks.getWebhookList()

//     // Check if our webhook already exists
//     const existingWebhook = webhooks.find(
//       (webhook) => webhook.url === `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/clerk`,
//     )

//     if (!existingWebhook) {
//       // Create a new webhook
//       await clerk.webhooks.createWebhook({
//         url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/clerk`,
//         eventTypes: ["user.created", "user.updated"],
//       })
//       console.log("Webhook created successfully")
//     } else {
//       console.log("Webhook already exists")
//     }

//     return new Response("Webhook setup completed", { status: 200 })
//   } catch (error) {
//     console.error("Error setting up webhook:", error)
//     return new Response("Error setting up webhook", { status: 500 })
//   }
// }

