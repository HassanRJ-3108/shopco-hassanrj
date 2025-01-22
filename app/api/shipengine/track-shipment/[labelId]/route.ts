import { shipEngine } from "@/lib/shipengine"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { labelId: string } }) {
  const labelId = params.labelId

  try {
    const trackingInfo = await shipEngine.trackUsingLabelId(labelId)
    return NextResponse.json(trackingInfo, { status: 200 })
  } catch (error: any) {
    console.error("Error tracking shipment:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

