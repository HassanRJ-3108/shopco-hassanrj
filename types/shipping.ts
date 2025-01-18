export interface ShipmentAddress {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    cityLocality: string;
    stateProvince: string;
    postalCode: string;
    countryCode: string;
    addressResidentialIndicator: 'yes' | 'no';
  }
  
  export interface ShipmentPackage {
    weight: {
      value: number;
      unit: 'pound' | 'ounce' | 'gram' | 'kilogram';
    };
    dimensions: {
      height: number;
      width: number;
      length: number;
      unit: 'inch' | 'centimeter';
    };
  }
  
  export interface ShippingRate {
    rateId: string;
    carrierId: string;
    serviceCode: string;
    serviceName: string;
    deliveryDays: number;
    shipmentAmount: number;
    insuranceAmount: number;
    confirmationAmount: number;
    otherAmount: number;
    totalAmount: number;
  }
  
  export interface ShippingDetails {
    rate: ShippingRate;
    package: ShipmentPackage;
    estimatedDelivery: {
      earliest: string;
      latest: string;
    };
  }
  
  export interface LabelDownload {
    href: string;
    pdf: string;
    png: string;
    zpl: string;
  }
  
  export interface TrackingEvent {
    occurredAt: string;
    description: string;
    cityLocality?: string;
    stateProvince?: string;
    postalCode?: string;
    countryCode?: string;
    latitude?: number;
    longitude?: number;
    statusCode: string;
    carrierStatusCode?: string;
    carrierDetailCode?: string;
  }
  
  export interface TrackingStatus {
    status: string;
    statusDescription: string;
    carrierStatusCode?: string;
    carrierDetailCode?: string;
    lastUpdate: string;
    events: TrackingEvent[];
  }
  
  