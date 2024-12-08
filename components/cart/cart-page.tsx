'use client'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { CartItem } from './cart-item'
import { OrderSummary } from './order-sumary'
import { integralCF } from '@/app/ui/fonts'
import { cn } from '@/lib/utils'

const cartItems = [
  {
    id: '1',
    name: 'Gradient Graphic T-shirt',
    size: 'Large',
    color: 'White',
    price: 145,
    image: '/products/g-graphic-t-shirt.png',
    quantity: 1
  },
  {
    id: '2',
    name: 'Checkered Shirt',
    size: 'Medium',
    color: 'Red',
    price: 180,
    image: '/products/checkered-tshirt.png',
    quantity: 1
  },
  {
    id: '3',
    name: 'Skinny Fit Jeans',
    size: 'Large',
    color: 'Blue',
    price: 240,
    image: '/products/skinny-jeans.png',
    quantity: 1
  }
]

export function CartPage() {
  const subtotal = 565
  const discount = 113
  const deliveryFee = 15
  const total = 467

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-800">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-800">Cart</span>
        </div>

        <h1 className={cn("text-3xl lg:text-4xl font-bold mb-8", integralCF.className)}>
          YOUR CART
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <div className="divide-y">
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  {...item}
                  onUpdateQuantity={(id, quantity) => {
                    console.log('Update quantity', id, quantity)
                  }}
                  onRemove={(id) => {
                    console.log('Remove item', id)
                  }}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              deliveryFee={deliveryFee}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

