"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrderDetailsProps {
  order: {
    items: Array<{
      name: string
      quantity: number
      price: number
      color: string
      size: string
    }>
    totalAmount: number
    shipping?: {
      cost: number
    }
  }
}

export function OrderDetails({ order }: OrderDetailsProps) {
  return (
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
  )
}

