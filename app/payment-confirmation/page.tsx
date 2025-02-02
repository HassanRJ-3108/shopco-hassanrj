"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "react-hot-toast"

function OrderConfirmationContent() {
    const [orderStatus, setOrderStatus] = useState<string>("loading")
    const searchParams = useSearchParams()

    useEffect(() => {
        const sessionId = searchParams.get("session_id")

        if (sessionId) {
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/check-order-status?session_id=${sessionId}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "complete") {
                        setOrderStatus("success")
                        toast.success("Your order has been placed successfully!")
                    } else {
                        setOrderStatus("pending")
                        toast.loading("Your order is being processed.")
                    }
                })
                .catch((error) => {
                    console.error("Error checking order status:", error)
                    setOrderStatus("error")
                    toast.error("Failed to verify order status. Please contact support.")
                })
        }
    }, [searchParams])

    if (orderStatus === "loading") {
        return <div>Loading order status...</div>
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
            {orderStatus === "success" && (
                <div>
                    <p className="text-green-600 mb-4">Your order has been placed successfully!</p>
                    <p>Thank you for your purchase. You will receive an email confirmation shortly.</p>
                </div>
            )}
            {orderStatus === "pending" && (
                <div>
                    <p className="text-blue-600 mb-4">Your order is being processed.</p>
                    <p>We'll update you once your order is confirmed.</p>
                </div>
            )}
            {orderStatus === "error" && (
                <div>
                    <p className="text-red-600 mb-4">There was an issue verifying your order status.</p>
                    <p>Please contact our support team for assistance.</p>
                </div>
            )}
        </div>
    )
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderConfirmationContent />
        </Suspense>
    )
}
