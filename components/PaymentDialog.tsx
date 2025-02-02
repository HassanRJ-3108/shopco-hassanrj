"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { toast } from "react-hot-toast"
import { useUser } from "@clerk/nextjs"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentDialogProps {
  isOpen: boolean
  onClose: () => void
  addressId: string
  totalAmount: number
}

export function PaymentDialog({ isOpen, onClose, addressId, totalAmount }: PaymentDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useCart()
  const { user } = useUser()

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      if (!user) {
        toast.error("Please login to proceed")
        return
      }

      const customerEmail = user.primaryEmailAddress?.emailAddress
      if (!customerEmail) {
        toast.error("Email address not found")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items,
          addressId,
          customerEmail,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      const result = await stripe!.redirectToCheckout({
        sessionId: sessionId,
      })

      if (result.error) {
        toast.error(result.error.message || "An unknown error occurred")
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast.error("Failed to initiate checkout. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Complete your payment</DialogTitle>
        <div className="mt-4">
          <p className="text-lg font-semibold">Total: ${totalAmount.toFixed(2)}</p>
          <Button 
            onClick={handleCheckout} 
            disabled={isLoading || !user}
            className="w-full mt-4"
          >
            {isLoading ? "Processing..." : "Proceed to Checkout"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}