import { ArrowRight, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { satoshi } from '@/app/ui/fonts'

interface OrderSummaryProps {
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
}

export function OrderSummary({ subtotal, discount, deliveryFee, total }: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
      <h2 className={cn("text-xl font-medium mb-6", satoshi.className)}>Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Discount (-20%)</span>
          <span className="text-red-500">-${discount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium">${deliveryFee}</span>
        </div>
        <div className="h-px bg-gray-200 my-4" />
        <div className="flex justify-between text-lg font-medium">
          <span>Total</span>
          <span>${total}</span>
        </div>
        
        <div className="flex gap-2 mt-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Add promo code"
              className="w-full pl-10 pr-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-black transition-colors">
            Apply
          </button>
        </div>
        
        <button className="w-full mt-4 px-6 py-4 bg-black text-white rounded-full flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors">
          <span>Go to Checkout</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

