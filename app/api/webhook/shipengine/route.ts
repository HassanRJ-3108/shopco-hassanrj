import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"
import { mapShipEngineStatus } from "@/lib/shipengine"

export async function POST(req: NextRequest) {
  try {
    const { resource_type, resource_id, event_type, status_code } = await req.json()

    if (resource_type === "shipment" && event_type === "track") {
      const order = await client.fetch(`*[_type == "order" && shipping.label.id == $labelId][0]`, {
        labelId: resource_id,
      })

      if (order) {
        const mappedStatus = mapShipEngineStatus(status_code)
        await client.patch(order._id).set({ status: mappedStatus }).commit()

        return NextResponse.json({ success: true, status: mappedStatus })
      }
    }

    return NextResponse.json({ success: false, message: "No matching order found or invalid webhook data" })
  } catch (error) {
    console.error("Error processing ShipEngine webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}

