"use client"

import { useEffect, useState } from "react"
import { useStripe } from "@stripe/react-stripe-js"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  const stripe = useStripe()
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret")

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!")
          updateOrderStatus(params.orderId, "paid")
          break
        case "processing":
          setMessage("Your payment is processing.")
          break
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.")
          break
        default:
          setMessage("Something went wrong.")
          break
      }
    })
  }, [stripe, params.orderId])

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/update-order-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      toast.success("Order placed successfully!")
      router.push(`/order-tracking/${orderId}`)
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("An error occurred while updating your order. Please contact support.")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <p>{message}</p>
    </div>
  )
}

