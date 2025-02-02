import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ProfileSidebar from "@/components/profile/ProfileSidebar"
import ProfileHeader from "@/components/profile/ProfileHeader"
import { Skeleton } from "@/components/ui/skeleton"


export const metadata = {
  title: "Customer Profile | Your Store Name",
  description: "View and manage your profile, orders, and wishlist.",
}

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfileSidebar />
      <div className="flex-1">
        <ProfileHeader/>
        <main className="p-6">
          <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}

