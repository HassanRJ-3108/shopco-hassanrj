import { shipEngine } from "@/lib/shipengine"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { rateId } = await req.json()
    const label = await shipEngine.createLabelFromRate({ rateId })
    return NextResponse.json(label, { status: 200 })
  } catch (error) {
    console.error("Error creating label:", error)
    return NextResponse.json({ error: "An error occurred while creating the label" }, { status: 500 })
  }
}

