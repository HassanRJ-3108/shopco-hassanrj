"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "@/components/CheckoutForm"
import { toast } from "react-hot-toast"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage({ params }: { params: { orderId: string } }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const secret = searchParams.get("clientSecret")
    if (secret) {
      setClientSecret(secret)
    } else {
      toast.error("Invalid checkout session. Please try again.")
    }
  }, [searchParams])

  if (!clientSecret) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
          },
          locale: "en",
        }}
      >
        <CheckoutForm orderId={params.orderId} />
      </Elements>
    </div>
  )
}

