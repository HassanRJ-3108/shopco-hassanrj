import { type NextRequest, NextResponse } from "next/server"
import { getShippingRates } from "@/lib/shipengine"
import type { ShippingAddress, PackageDetails } from "@/types/shipping"

export async function POST(req: NextRequest) {
  try {
    const { shipToAddress, packages } = await req.json()
    const rates = await getShippingRates(shipToAddress as ShippingAddress, packages as PackageDetails[])

    return NextResponse.json(rates)
  } catch (error: any) {
    console.error("Error getting shipping rates:", error)
    return NextResponse.json({ error: error.message || "Failed to get shipping rates" }, { status: 500 })
  }
}

