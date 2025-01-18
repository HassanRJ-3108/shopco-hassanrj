import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Truck, CheckCircle2, Clock, PackageCheck, Building2, MapPin, Phone, Mail, DollarSign } from 'lucide-react'

interface OrderTrackingProps {
  params: {
    orderId: string
  }
}

interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    color: string;
    size: string;
  }>;
  totalAmount: number;
  status: string;
  shipping: {
    carrier: string;
    service: string;
    trackingNumber: string;
    cost: number;
    estimatedDays: number | null;
    label?: {
      pdf: string;
    };
  };
  createdAt: string;
}

export default async function OrderTracking({ params }: OrderTrackingProps) {
  const order: Order | null = await client.fetch(
    groq`*[_type == "order" && _id == $orderId][0]{
      _id,
      customer->{
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode
      },
      items,
      totalAmount,
      status,
      shipping,
      createdAt
    }`,
    { orderId: params.orderId }
  )

  if (!order) {
    notFound()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-500" />
      case 'processing':
        return <Package className="h-8 w-8 text-blue-500" />
      case 'shipped':
        return <Truck className="h-8 w-8 text-purple-500" />
      case 'delivered':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />
      default:
        return <Package className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500'
      case 'processing':
        return 'bg-blue-500'
      case 'shipped':
        return 'bg-purple-500'
      case 'delivered':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const statuses = ['pending', 'processing', 'shipped', 'delivered']
  const currentStatusIndex = statuses.indexOf(order.status)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
          <p className="mt-2 text-sm text-gray-600">Order ID: {order._id}</p>
        </div>

        {/* Status Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-0.5 w-full bg-gray-200"></div>
              </div>
              <div className="relative flex justify-between">
                {statuses.map((status, index) => (
                  <div key={status} className="flex flex-col items-center">
                    <div className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                      index <= currentStatusIndex 
                        ? 'border-' + getStatusColor(status).replace('bg-', '') 
                        : 'border-gray-300'
                    } bg-white`}>
                      {index <= currentStatusIndex ? getStatusIcon(status) : (
                        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <p className={`mt-2 text-sm font-medium ${
                      index <= currentStatusIndex ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <span>{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span>{order.customer.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>
                  {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          {order.shipping && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Carrier:</span>
                  <span>{order.shipping.carrier}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Service:</span>
                  <span>{order.shipping.service}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Tracking Number:</span>
                  <span>{order.shipping.trackingNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Estimated Delivery:</span>
                  <span>{order.shipping.estimatedDays ? `${order.shipping.estimatedDays} days` : 'Not available'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Shipping Cost:</span>
                  <span>${order.shipping.cost.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Items */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <div key={index} className="py-4 flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.color} • {item.size}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
              <div className="py-4 flex justify-between font-medium">
                <span>Subtotal</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              {order.shipping && (
                <div className="py-4 flex justify-between font-medium">
                  <span>Shipping</span>
                  <span>${order.shipping.cost.toFixed(2)}</span>
                </div>
              )}
              <div className="py-4 flex justify-between font-medium">
                <span>Total</span>
                <span>${(order.totalAmount + (order.shipping ? order.shipping.cost : 0)).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {order.shipping && order.shipping.label && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Shipping Label</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href={order.shipping.label.pdf} target="_blank" rel="noopener noreferrer">
                  Download Shipping Label (PDF)
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

