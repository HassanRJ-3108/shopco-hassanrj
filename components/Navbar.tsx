"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingCart, X } from "lucide-react"
import { integralCF } from "@/app/ui/fonts"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { SearchBar } from "./SearchBar"
import { ShopMenu, menuItems } from "./ShopMenu"
import { UserAuthDropdown } from "./UserAuthDropdown"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false)
  const { state } = useCart()
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const shopMenuRef = useRef<HTMLDivElement>(null)

  const cartItemCount = state.items.length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false)
      }
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target as Node)) {
        setIsShopMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  const handleSearch = (query: string) => {
    router.push(`/shop?search=${encodeURIComponent(query)}`)
    setIsSearchOpen(false)
  }

  return (
    <div className="w-full bg-white shadow-sm">
      {/* Top Banner */}
      <div className="relative bg-black text-white text-center py-3 px-4 text-[10px] md:text-sm">
        <p className="text-white">
          Sign up and get 20% off to your first order.{" "}
          <Link href="/sign-up" className="underline font-medium text-white">
            Sign Up Now
          </Link>
        </p>
      </div>

      {/* Main Navbar */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>

            {/* Logo */}
            <Link href="/" className={cn("text-xl md:text-2xl font-bold", integralCF.className)}>
              SHOP.CO
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <div ref={shopMenuRef} className="relative">
                <button
                  className="flex items-center hover:text-gray-600 py-8"
                  onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}
                >
                  Shop
                  <svg
                    className={cn("ml-1 h-4 w-4 transition-transform duration-200", isShopMenuOpen ? "rotate-180" : "")}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </button>
                {isShopMenuOpen && <ShopMenu />}
              </div>
              <Link href="/shop?topSelling=true" className="hover:text-gray-600">
                On Sale
              </Link>
              <Link href="/shop?newArrivals=true" className="hover:text-gray-600">
                New Arrivals
              </Link>
              <Link href="/about" className="hover:text-gray-600">
                About
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button className="lg:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="h-6 w-6" />
              </button>
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <UserAuthDropdown />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-8">
                <Link
                  href="/"
                  className={cn("text-xl font-bold", integralCF.className)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  SHOP.CO
                </Link>
                <button className="p-2 text-2xl" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="space-y-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="shop">
                    <AccordionTrigger>Shop</AccordionTrigger>
                    <AccordionContent>
                      {menuItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="block py-2 hover:text-gray-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="text-sm font-medium">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.subtitle}</div>
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Link
                  href="/shop?topSelling=true"
                  className="block text-lg hover:text-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  On Sale
                </Link>
                <Link
                  href="/shop?newArrivals=true"
                  className="block text-lg hover:text-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  New Arrivals
                </Link>
                <Link href="/about" className="block text-lg hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            ref={searchRef}
            className="absolute left-0 right-0 bg-white shadow-md z-40 lg:hidden"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">
              <SearchBar onSearch={handleSearch} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

