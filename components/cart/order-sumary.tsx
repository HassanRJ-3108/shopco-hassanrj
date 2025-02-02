import { ArrowRight, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { satoshi } from "@/app/ui/fonts"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface OrderSummaryProps {
  subtotal: number
  discount: number
  shippingCost: number
  total: number
  onPlaceOrder: () => void
  isLoading: boolean
}

export function OrderSummary({ subtotal, discount, shippingCost, total, onPlaceOrder, isLoading }: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)

  const formatPrice = (price: number) => price.toFixed(2)

  const handleApplyPromo = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apply-promo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ promoCode }),
      })
      const data = await response.json()
      if (data.valid) {
        setPromoDiscount(data.discount)
      } else {
        // Handle invalid promo code
        console.error("Invalid promo code")
      }
    } catch (error) {
      console.error("Error applying promo code:", error)
    }
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
      <h2 className={cn("text-xl font-medium mb-6", satoshi.className)}>Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">Rs. {formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Discount</span>
          <span className="text-red-500">-Rs. {formatPrice(discount)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Promo Discount</span>
            <span className="text-red-500">-Rs. {formatPrice(promoDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping Fee</span>
          <span className="font-medium">Rs. {formatPrice(shippingCost)}</span>
        </div>
        <div className="h-px bg-gray-200 my-4" />
        <div className="flex justify-between text-lg font-medium">
          <span>Total</span>
          <span>Rs. {formatPrice(total - promoDiscount)}</span>
        </div>

        <div className="flex gap-2 mt-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Add promo code"
              className="w-full pl-10 pr-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-black"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button className="px-6 py-3" onClick={handleApplyPromo}>
            Apply
          </Button>
        </div>
        <Button
          onClick={onPlaceOrder}
          className="w-full mt-4 px-6 py-4 flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          <span>{isLoading ? "Processing..." : "Place Order"}</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

