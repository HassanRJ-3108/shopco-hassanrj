import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2023-05-03",
  token: process.env.SANITY_API_TOKEN,
})

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await client.fetch(
      `
      *[_type == "customer" && clerkId == $clerkId][0].addresses
    `,
      { clerkId: userId },
    )

    return NextResponse.json(result || [])
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = await client
      .patch({ query: `*[_type == "customer" && clerkId == $clerkId][0]`, params: { clerkId: userId } })
      .setIfMissing({ addresses: [] })
      .append("addresses", [body])
      .commit()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error adding address:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const index = searchParams.get("index")
    if (!index) {
      return NextResponse.json({ error: "Index is required" }, { status: 400 })
    }

    const result = await client
      .patch({ query: `*[_type == "customer" && clerkId == $clerkId][0]`, params: { clerkId: userId } })
      .unset([`addresses[${index}]`])
      .commit()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

