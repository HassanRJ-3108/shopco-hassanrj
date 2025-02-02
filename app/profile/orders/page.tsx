import { Suspense } from "react"
import OrdersList from "@/components/profile/OrdersList"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <Suspense fallback={<Skeleton className="w-full h-[400px]" />}>
        <OrdersList />
      </Suspense>
    </div>
  )
}

