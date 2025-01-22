export interface ShippingAddress {
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  cityLocality: string
  stateProvince: string
  postalCode: string
  countryCode: string
  addressResidentialIndicator: "yes" | "no"
}

export interface PackageDetails {
  weight: {
    value: number
    unit: "pound" | "ounce" | "gram" | "kilogram"
  }
  dimensions: {
    height: number
    width: number
    length: number
    unit: "inch" | "centimeter"
  }
}

export interface ShippingRate {
  rateId: string
  carrierId: string
  serviceCode: string
  serviceName: string
  deliveryDays: number
  shipmentAmount: number
  insuranceAmount: number
  confirmationAmount: number
  otherAmount: number
  totalAmount: number
}

export interface ShippingDetails {
  rate: ShippingRate
  package: PackageDetails
  estimatedDelivery: {
    earliest: string
    latest: string
  }
}

export interface LabelDownload {
  href: string
  pdf: string
  png: string
  zpl: string
}

export interface TrackingEvent {

  occurred_at: string

  carrier_occurred_at?: string

  description?: string

  city_locality?: string

  state_province?: string

  postal_code?: string

  country_code?: string | null

  company_name?: string | null

  signer?: string | null

  event_code?: string | null

}



export interface TrackingStatus {
  status: string
  statusDescription: string
  carrierStatusCode?: string
  carrierDetailCode?: string
  lastUpdate: string
  events: TrackingEvent[]
}

