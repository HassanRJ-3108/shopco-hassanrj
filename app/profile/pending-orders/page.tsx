import { Suspense } from "react"
import PendingOrders from "@/components/profile/PendingOrders"
import { Skeleton } from "@/components/ui/skeleton"

export default function PendingOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pending Orders</h1>
      <Suspense fallback={<Skeleton className="w-full h-[400px]" />}>
        <PendingOrders />
      </Suspense>
    </div>
  )
}

