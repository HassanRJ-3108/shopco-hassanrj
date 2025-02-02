import { NextResponse } from "next/server"
import { shipEngine } from "@/lib/shipengine"
import type { ShippingAddress, PackageDetails } from "@/types/shipengine"

export async function POST(req: Request) {
  try {
    const { shipToAddress, packages } = await req.json()
    console.log("Received request for shipping rates:", { shipToAddress, packages })

    const shipmentDetails = await shipEngine.getRatesWithShipmentDetails({
      shipment: {
        shipTo: shipToAddress,
        shipFrom: {
          name: "SHOP.CO",
          phone: "+1 555 123 4567",
          addressLine1: "123 Main St",
          cityLocality: "Austin",
          stateProvince: "TX",
          postalCode: "78701",
          countryCode: "US",
          addressResidentialIndicator: "no",
        },
        packages: packages,
      },
      rateOptions: {
        carrierIds: [
          process.env.SHIPENGINE_FIRST_COURIER || "",
          process.env.SHIPENGINE_SECOND_COURIER || "",
          process.env.SHIPENGINE_THIRD_COURIER || "",
          process.env.SHIPENGINE_FOURTH_COURIER || "",
        ].filter(Boolean),
      },
    })

    console.log("ShipEngine response:", shipmentDetails)

    if (!shipmentDetails.rateResponse || !shipmentDetails.rateResponse.rates) {
      throw new Error("No rates returned from ShipEngine")
    }

    return NextResponse.json(shipmentDetails.rateResponse.rates)
  } catch (error: any) {
    console.error("Error getting shipping rates:", error)
    return NextResponse.json({ error: error.message || "Failed to get shipping rates" }, { status: 500 })
  }
}

