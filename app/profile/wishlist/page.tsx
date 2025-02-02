import { Suspense } from "react"
import WishlistItems from "@/components/profile/WishlistItems"
import { Skeleton } from "@/components/ui/skeleton"

export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Wishlist</h1>
      <Suspense fallback={<Skeleton className="w-full h-[400px]" />}>
        <WishlistItems />
      </Suspense>
    </div>
  )
}

