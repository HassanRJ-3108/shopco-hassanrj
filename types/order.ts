export interface OrderItem {
  _key?: string
  id: string
  name: string
  quantity: number
  price: number
  color: string
  size: string
  image: string
}

export interface Customer {
  _id: string
  _type: "customer"
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

export interface Order {
  _id: string
  _type: "order"
  customer: {
    _type: "reference"
    _ref: string
  }
  items: OrderItem[]
  totalAmount: number
  status: string
  shipping: {
    carrier: string
    service: string
    trackingNumber: string
    cost: number
    estimatedDays: number | null
    rateId: string
    label: {
      id: string
      pdf: string
      png: string
    }
  }
  trackingInfo: {
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
  createdAt: string
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

