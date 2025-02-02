"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, ShoppingBag, Heart, Clock, MapPin } from "lucide-react"

const navItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/profile/orders", label: "Orders", icon: ShoppingBag },
  { href: "/profile/wishlist", label: "Wishlist", icon: Heart },
  { href: "/profile/pending-orders", label: "Pending Orders", icon: Clock },
  { href: "/profile/addresses", label: "Addresses", icon: MapPin },
]

export default function ProfileSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-md">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn("w-full justify-start", pathname === item.href && "bg-primary text-primary-foreground")}
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  )
}

