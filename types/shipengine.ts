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
      length: number
      width: number
      height: number
      unit: "inch" | "centimeter"
    }
  }
  
  export interface ShippingRate {
    rateId: string
    rateType: string
    carrierId: string
    shippingAmount: {
      currency: string
      amount: number
    }
    insuranceAmount: {
      currency: string
      amount: number
    }
    confirmationAmount: {
      currency: string
      amount: number
    }
    otherAmount: {
      currency: string
      amount: number
    }
    taxAmount: {
      currency: string
      amount: number
    }
    zone: number
    packageType: string
    deliveryDays: number
    guaranteedService: boolean
    estimatedDeliveryDate: string
    carrierDeliveryDays: string
    shipDate: string
    negotiatedRate: boolean
    serviceType: string
    serviceCode: string
    trackable: boolean
    carrierCode: string
    carrierNickname: string
    carrierFriendlyName: string
  }
  
  