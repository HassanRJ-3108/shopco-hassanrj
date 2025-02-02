"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, ShoppingBag } from "lucide-react"
import { CartItem } from "./cart-item"
import { OrderSummary } from "./order-sumary"
import { integralCF } from "@/app/ui/fonts"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/CartContext"
import { removeFromCart, updateQuantity } from "@/app/actions/Cart"
import { useUser } from "@clerk/nextjs"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { PaymentDialog } from "@/components/PaymentDialog"

interface Address {
  _id: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export function CartPage() {
  const { state, dispatch } = useCart()
  const [addresses, setAddresses] = useState<Address[]>([])
  const { user } = useUser()
  const router = useRouter()

  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  useEffect(() => {
    const calculateTotals = async () => {
      const itemSubtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      setSubtotal(itemSubtotal)

      try {
        const discountResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-discount`)
        const discountData = await discountResponse.json()
        const calculatedDiscount = itemSubtotal * discountData.rate
        setDiscount(calculatedDiscount)
      } catch (error) {
        console.error("Error fetching discount:", error)
        setDiscount(0)
      }

      setTotal(itemSubtotal - discount)
    }

    calculateTotals()
  }, [state.items, discount])

  useEffect(() => {
    const fetchAddresses = async () => {
      if (user) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/customer-addresses?clerkId=${user.id}`)
          if (!response.ok) {
            throw new Error("Failed to fetch addresses")
          }
          const data = await response.json()
          console.log("Fetched addresses:", data)
          setAddresses(data.addresses || [])
        } catch (error) {
          console.error("Error fetching addresses:", error)
          toast.error("Failed to load addresses. Please try again.")
        }
      }
    }
    fetchAddresses()
  }, [user])

  const handleUpdateQuantity = async (id: string, color: string, size: string, newQuantity: number) => {
    const item = state.items.find((item) => item.id === id && item.color === color && item.size === size)
    if (item) {
      await updateQuantity(dispatch, { ...item, quantity: newQuantity })
    }
  }

  const handleRemoveItem = async (id: string, color: string, size: string) => {
    await removeFromCart(dispatch, { id, name: "", price: 0, image: "", color, size })
  }

  const handlePlaceOrder = () => {
    if (!user) {
      toast.error("Please sign in to place an order.")
      return
    }

    if (addresses.length === 0) {
      toast.error("Please add a delivery address to your profile.")
      return
    }

    setShowPaymentDialog(true)
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <ShoppingBag className="h-24 w-24 text-gray-300 mb-4" />
        <h2 className={cn("text-2xl font-bold mb-2", integralCF.className)}>Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven&apos;t added any items to your cart yet.</p>
        <Link href="/shop" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-800">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-800">Cart</span>
        </div>

        <h1 className={cn("text-3xl lg:text-4xl font-bold mb-8", integralCF.className)}>YOUR CART</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Cart Items and Addresses */}
          <div className="lg:col-span-7">
            <div className="divide-y mb-8">
              {state.items.map((item) => (
                <CartItem
                  key={`${item.id}-${item.color}-${item.size}`}
                  {...item}
                  onUpdateQuantity={(newQuantity) => handleUpdateQuantity(item.id, item.color, item.size, newQuantity)}
                  onRemove={() => handleRemoveItem(item.id, item.color, item.size)}
                />
              ))}
            </div>

            {/* Addresses */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Your Addresses</h2>
              {addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address._id} className="p-4 border rounded-md">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                      <p>{address.country}</p>
                      {address.isDefault && <p className="text-green-600 mt-2">Default Address</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No addresses found. Please add an address to your profile.</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              shippingCost={0}
              total={total}
              onPlaceOrder={handlePlaceOrder}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {showPaymentDialog && (
        <PaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          addressId={addresses[0]._id}
          totalAmount={total}
        />
      )}
    </div>
  )
}

