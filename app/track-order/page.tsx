'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Link from 'next/link'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
})

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  status: string;
}

interface Order {
  _id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
  trackingNumber?: string;
  trackingInfo?: any;
}

export default function TrackOrderPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      phone: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/track-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Track Orders'}
          </Button>
        </form>
      </Form>

      {orders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Order ID: {order._id}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Status: {order.status}
                </p>
                {order.trackingNumber && (
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Tracking Number: {order.trackingNumber}
                  </p>
                )}
                {order.trackingInfo && (
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Tracking Status: {order.trackingInfo.status_description}
                  </p>
                )}
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  {order.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">{item.name}</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        Quantity: {item.quantity}, Price: ${item.price.toFixed(2)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <Link href={`/order-tracking/${order._id}`}>
                  <Button>View Order Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

