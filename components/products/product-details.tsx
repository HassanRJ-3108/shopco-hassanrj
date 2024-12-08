'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Minus, Plus, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { satoshi, integralCF } from '@/app/ui/fonts'

interface Product {
  id: string
  title: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  description: string
  images: string[]
  colors: Array<{
    name: string
    value: string
  }>
  sizes: string[]
}

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState('Large')
  const [quantity, setQuantity] = useState(1)

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/shop" className="hover:text-gray-900">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/men" className="hover:text-gray-900">Men</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900">T-shirts</span>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-square bg-gray-100 rounded-lg overflow-hidden",
                    selectedImage === index && "ring-2 ring-black"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-8 lg:mt-0">
            <h1 className={cn("text-3xl font-bold", integralCF.className)}>
              {product.title}
            </h1>
            
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating}/5 ({product.reviews} Reviews)
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className={cn("text-2xl font-bold", satoshi.className)}>
                ${product.price}
              </span>
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice}
              </span>
              <span className="text-red-500 text-sm font-medium">
                -{discount}%
              </span>
            </div>

            <p className="mt-6 text-gray-600">
              {product.description}
            </p>

            <div className="mt-8 space-y-6">
              {/* Color Selection */}
              <div>
                <h3 className={cn("text-sm font-medium", satoshi.className)}>
                  Select Colors
                </h3>
                <div className="mt-3 flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full ring-2 ring-offset-2",
                        selectedColor.name === color.name
                          ? "ring-black"
                          : "ring-transparent hover:ring-gray-300"
                      )}
                      style={{ backgroundColor: color.value }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className={cn("text-sm font-medium", satoshi.className)}>
                  Choose Size
                </h3>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "py-2 text-sm border rounded-full",
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-black"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border-r"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border-l"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button className="flex-1 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

