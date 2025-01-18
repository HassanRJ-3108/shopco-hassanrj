import { ShippingDetails, LabelDownload, TrackingStatus } from './shipping';

export interface OrderItem {
  _key: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  color: string;
  size: string;
}

export interface Customer {
  _id: string;
  _type: 'customer';
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  _id: string;
  _type: 'order';
  customer: {
    _type: 'reference';
    _ref: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'manual_processing_required';
  trackingNumber?: string;
  labelId?: string;
  labelDownload?: LabelDownload;
  shippingDetails?: ShippingDetails;
  trackingStatus?: TrackingStatus;
  createdAt: string;
  shipEngineError?: string;
}

