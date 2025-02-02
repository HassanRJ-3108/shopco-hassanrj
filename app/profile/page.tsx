import { Suspense } from "react"
import ProfileInfo from "@/components/profile/ProfileInfo"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
        <ProfileInfo />
      </Suspense>
    </div>
  )
}

