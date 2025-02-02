"use client"

import { Button } from "@/components/ui/button"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
import { useCallback, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCart } from "@/context/CartContext"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "")

interface PaymentButtonProps {
  addressId: string
  totalAmount: number
}

export default function PaymentButton({ addressId, totalAmount }: PaymentButtonProps) {
  const { state } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const createCheckoutSession = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items,
          addressId: addressId,
          totalAmount: totalAmount,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setClientSecret(data.clientSecret)
      } else {
        throw new Error(data.error || "Failed to create checkout session")
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
    }
  }, [state.items, addressId, totalAmount])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="default" onClick={createCheckoutSession}>
          Place Order
        </Button>
      </DialogTrigger>
      <DialogContent className="my-4 py-12 xl:max-w-screen-xl">
        <DialogTitle className="text-xl font-semibold">Complete Your Order</DialogTitle>

        {clientSecret && (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckout className="max-h-[80dvh]" />
          </EmbeddedCheckoutProvider>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel Payment
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

