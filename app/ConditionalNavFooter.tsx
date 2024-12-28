'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from "@/components/Navbar"
import Footer from "@/components/Footer"

export function ConditionalNavbar() {
  const pathname = usePathname()
  if (pathname.startsWith('/studio')) return null
  return <Navbar />
}

export function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname.startsWith('/studio')) return null
  return <Footer />
}

