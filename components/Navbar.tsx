'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, ShoppingCart, User } from 'lucide-react'
import { integralCF } from '@/app/ui/fonts'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    
    <div className="w-full bg-white shadow-sm">
     
      {/* Top Banner */}
      <div className="relative bg-black text-white text-center py-3 px-4 text-[10px] md:text-sm">
        <p>
          Sign up and get 20% off to your first order.{' '}
          <Link href="#" className="underline font-medium">
            Sign Up Now
          </Link>
        </p>
        
      </div>

      {/* Main Navbar */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link 
              href="/" 
              className={cn(
                "text-xl md:text-2xl font-bold",
                integralCF.className
              )}
            >
              SHOP.CO
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/products" className="hover:text-gray-600">Shop</Link>
              <Link href="#" className="hover:text-gray-600">On Sale</Link>
              <Link href="#" className="hover:text-gray-600">New Arrivals</Link>
              <Link href="#" className="hover:text-gray-600">Brands</Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search for products..."
                  className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-lg focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button className="lg:hidden">
                <Search className="h-6 w-6" />
              </button>
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6" />
              </Link>
              <Link href="#">
                <User className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute inset-0 bg-white transform transition-transform duration-300 lg:hidden",
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="p-4">
          <button
            className="absolute right-4 top-4 p-2 text-2xl"
            onClick={() => setIsMenuOpen(false)}
          >
            X
          </button>
          <nav className="mt-12 space-y-6">
            <Link 
              href="/products" 
              className="block text-lg hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="#" 
              className="block text-lg hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              On Sale
            </Link>
            <Link 
              href="#" 
              className="block text-lg hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link 
              href="/products" 
              className="block text-lg hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Brands
            </Link>
          </nav>
          {/* Mobile Search */}
          <div className="mt-8">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for products..."
                className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-lg focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

