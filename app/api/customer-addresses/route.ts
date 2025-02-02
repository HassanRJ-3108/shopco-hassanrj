import { NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const clerkId = searchParams.get("clerkId")

  if (!clerkId) {
    return NextResponse.json({ error: "Clerk ID is required" }, { status: 400 })
  }

  try {
    const customer = await client.fetch(
      `
      *[_type == "customer" && clerkId == $clerkId][0] {
        addresses
      }
    `,
      { clerkId },
    )

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({ addresses: customer.addresses || [] })
  } catch (error) {
    console.error("Error fetching customer addresses:", error)
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
}

