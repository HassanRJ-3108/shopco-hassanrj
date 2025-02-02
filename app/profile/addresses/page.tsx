import { Suspense } from "react"
import AddressList from "@/components/profile/AddressList"
import { Skeleton } from "@/components/ui/skeleton"

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Addresses</h1>
      <Suspense fallback={<Skeleton className="w-full h-[400px]" />}>
        <AddressList />
      </Suspense>
    </div>
  )
}
