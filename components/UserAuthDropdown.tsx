"use client"

import { useState, useEffect } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { User, LogOut, UserCircle, ShoppingCart, Heart, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function UserAuthDropdown() {
  const { user, isSignedIn, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-6 w-6 text-gray-700" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-md">
          <DropdownMenuItem asChild>
            <Link href="/sign-in" className="text-gray-800 hover:bg-gray-100 p-2 rounded-md">
              Sign In
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/sign-up" className="text-gray-800 hover:bg-gray-100 p-2 rounded-md">
              Sign Up
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
            <AvatarFallback>
              {user.firstName?.charAt(0) || user.emailAddresses[0].emailAddress.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-md space-y-2 text-lg">
        <DropdownMenuItem className="text-gray-800 hover:bg-gray-100 p-2 rounded-md">
          <UserCircle className="mr-2 h-4 w-4 text-gray-700" />
          <span>Signed in as {user.firstName || user.emailAddresses[0].emailAddress}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="text-gray-800 hover:bg-gray-100 p-2 rounded-md">
            <UserCircle className="mr-2 h-4 w-4 text-gray-700" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/orders" className="text-gray-800 hover:bg-gray-100 p-2 rounded-md">
            <ShoppingCart className="mr-2 h-4 w-4 text-gray-700" />
            <span>My Orders</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/wishlist" className="text-gray-800 hover:bg-gray-100 p-2 rounded-md">
            <Heart className="mr-2 h-4 w-4 text-gray-700" />
            <span>Wishlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/track-order" className="text-gray-800 hover:bg-gray-100 p-2 rounded-md">
            <Truck className="mr-2 h-4 w-4 text-gray-700" />
            <span>Track Your Order</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="text-gray-800 hover:bg-gray-100 p-2 rounded-md">
          <LogOut className="mr-2 h-4 w-4 text-gray-700" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
