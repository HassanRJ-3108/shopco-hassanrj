import { ShipEngine } from "shipengine"
import type { ShippingAddress, PackageDetails } from "@/types/shipping"
import type { TrackingEvent } from "@/types/order"

if (!process.env.SHIPENGINE_API_KEY) {
  throw new Error("SHIPENGINE_API_KEY is not defined")
}

export const shipEngine = new ShipEngine(process.env.SHIPENGINE_API_KEY)

export const getShippingRates = async (address: ShippingAddress, packages: PackageDetails[]) => {
  try {
    const response = await shipEngine.getRatesWithShipmentDetails({
      shipment: {
        shipTo: address,
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

    return response
  } catch (error) {
    console.error("ShipEngine Error:", error)
    throw error
  }
}

export const createShippingLabel = async (rateId: string) => {
  try {
    const label = await shipEngine.createLabelFromRate({
      rateId,
      validateAddress: "no_validation",
      labelLayout: "4x6",
      labelFormat: "pdf",
      labelDownloadType: "url",
      displayScheme: "label",
    })

    return label
  } catch (error) {
    console.error("ShipEngine Error:", error)
    throw error
  }
}

export interface TrackingInfo {
  tracking_number: string
  status_code: string
  status_description: string
  carrier_status_code: string
  carrier_status_description: string
  shipped_date: string | null
  estimated_delivery_date: string | null
  actual_delivery_date: string | null
  exception_description: string | null
  events: TrackingEvent[]
}

export const getShipmentStatus = async (labelId: string): Promise<TrackingInfo> => {
  try {
    const trackingResult = await shipEngine.trackUsingLabelId(labelId)

    // Map the trackingResult to our TrackingInfo interface
    const trackingInfo: TrackingInfo = {
      tracking_number: trackingResult.trackingNumber,
      status_code: trackingResult.statusCode,
      status_description: trackingResult.statusDescription,
      carrier_status_code: trackingResult.carrierStatusCode,
      carrier_status_description: trackingResult.carrierStatusDescription ?? "",
      shipped_date: trackingResult.shipDate,
      estimated_delivery_date: trackingResult.estimatedDeliveryDate,
      actual_delivery_date: trackingResult.actualDeliveryDate,
      exception_description: trackingResult.exceptionDescription,
      events: trackingResult.events.map((event) => ({
      occurred_at: event.occurredAt,
      carrier_occurred_at: event.carrierOccurredAt ?? "",
      description: event.description ?? "",
      city_locality: event.cityLocality,
      state_province: event.stateProvince,
      postal_code: event.postalCode,
      country_code: event.countryCode,
      company_name: event.companyName,
      signer: event.signer,
      event_code: event.eventCode,
      })),
    }

    return trackingInfo
  } catch (error) {
    console.error("ShipEngine Error:", error)
    throw error
  }
}

export const mapShipEngineStatus = (statusCode: string): string => {
  switch (statusCode) {
    case "AC":
      return "accepted"
    case "IT":
    case "NY":
      return "in_transit"
    case "DE":
    case "SP":
      return "delivered"
    case "EX":
      return "exception"
    case "AT":
      return "delivery_attempt"
    case "UN":
    default:
      return "unknown"
  }
}

