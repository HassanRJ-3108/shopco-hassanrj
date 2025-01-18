import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface OrderConfirmationProps {
  params: {
    orderId: string
  }
}

export default async function OrderConfirmation({ params }: OrderConfirmationProps) {
  const order = await client.fetch(
    groq`*[_type == "order" && _id == $orderId][0]{
      _id,
      orderId,
      customer->{name, email},
      items[]{
        product->{title, slug},
        quantity,
        price
      },
      totalAmount,
      status,
      createdAt,
      "shipment": *[_type == "shipment" && order._ref == ^._id][0]{
        trackingId,
        carrier,
        status,
        estimatedDeliveryDate
      }
    }`,
    { orderId: params.orderId }
  )

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Order Confirmation
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Thank you for your order, {order.customer.name}!
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <dl className="divide-y divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Order ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.orderId}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Date(order.createdAt).toLocaleString()}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              ${order.totalAmount.toFixed(2)}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.status}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Items</h2>
        <ul className="divide-y divide-gray-200">
          {order.items.map((item: any, index: number) => (
            <li key={index} className="py-4 flex">
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-medium">{item.product.title}</h3>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {order.shipment && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Shipment Information</h2>
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Tracking ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.shipment.trackingId}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Carrier</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.shipment.carrier}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.shipment.status}</dd>
            </div>
            {order.shipment.estimatedDeliveryDate && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Estimated Delivery</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(order.shipment.estimatedDeliveryDate).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}

