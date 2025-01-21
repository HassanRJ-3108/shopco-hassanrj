"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Minus, Plus, Star, StarHalf, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { satoshi, integralCF } from "@/app/ui/fonts"
import type { Product } from "@/types/product"
import { useCart } from "@/context/CartContext"
import { addToCart } from "@/app/actions/Cart"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-gray-300" />
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}/5</span>
    </div>
  )
}

const InventoryStatus = ({ inventory }: { inventory: number }) => {
  if (inventory <= 0) return <span className="text-red-600 font-semibold">Out of stock</span>
  if (inventory <= 5) return <span className="text-orange-600 font-semibold">Only {inventory} left in stock</span>
  return <span className="text-green-600 font-semibold">In stock</span>
}

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product: initialProduct }: ProductDetailProps) {
  const router = useRouter()
  const [product, setProduct] = useState(initialProduct)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const { dispatch, state } = useCart()

  const discount = useMemo(() => {
    return product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  }, [product.originalPrice, product.price])

  const availableQuantity = useMemo(() => {
    const cartItem = state.items.find(
      (i) => i.id === product._id && i.color === selectedColor.toString() && i.size === selectedSize,
    )
    const cartQuantity = cartItem ? cartItem.quantity : 0
    return Math.max(0, product.inventory - cartQuantity)
  }, [product._id, product.inventory, selectedColor, selectedSize, state.items])

  const handleAddToCart = useCallback(() => {
    if (quantity > availableQuantity) {
      toast({
        title: "Not enough stock",
        description: `Sorry, only ${availableQuantity} items available.`,
        variant: "destructive",
      })
      return
    }

    const item = {
      id: product._id,
      name: product.title,
      price: product.price,
      image: product.images[0],
      color: selectedColor.toString(),
      size: selectedSize,
      quantity: quantity,
    }

    addToCart(dispatch, item)

    // Update local product state to reflect the new inventory
    setProduct((prev) => ({ ...prev, inventory: Math.max(0, prev.inventory - quantity) }))

    toast({
      title: "Added to Cart",
      description: (
        <div className="flex flex-col">
          <span>
            {quantity} {product.title} added to your cart.
          </span>
          <button
            className="mt-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition-colors text-sm"
            onClick={() => router.push("/cart")}
          >
            <ShoppingCart className="inline-block mr-2 h-4 w-4" />
            View Cart
          </button>
        </div>
      ),
    })

    // Reset quantity to 1 after adding to cart
    setQuantity(1)
  }, [product, selectedColor, selectedSize, quantity, dispatch, availableQuantity, router])

  useEffect(() => {
    setQuantity(1)
  }, [selectedColor, selectedSize])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/shop" className="hover:text-gray-900">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900">{product.category.name}</span>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-square bg-gray-100 rounded-lg overflow-hidden",
                    selectedImage === index && "ring-2 ring-black",
                  )}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} view ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Product Info */}
          <div className="mt-8 lg:mt-0">
            <h1 className={cn("text-3xl font-bold", integralCF.className)}>{product.title}</h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center">
                <StarRating rating={product.rating} />
              </div>
              <span className="text-sm text-gray-500">({product.reviews?.length || 0} Reviews)</span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className={cn("text-2xl font-bold", satoshi.className)}>${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className={`${satoshi.className} text-sm text-gray-500 line-through`}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-red-600">-{discount}%</span>
                </>
              )}
            </div>

            <p className="mt-6 text-gray-600">{product.description}</p>

            <div className="mt-8 space-y-6">
              {/* Color Selection */}
              <div>
                <h3 className={cn("text-sm font-medium", satoshi.className)}>Select Colors</h3>
                <div className="mt-3 flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.toString()}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full ring-2 ring-offset-2",
                        selectedColor === color ? "ring-black" : "ring-transparent hover:ring-gray-300",
                      )}
                      style={{ backgroundColor: color.toString() }}
                      aria-label={color.toString()}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className={cn("text-sm font-medium", satoshi.className)}>Choose Size</h3>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "py-2 text-sm border rounded-full",
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-black",
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inventory Status */}
              <div className="text-sm">
                <InventoryStatus inventory={availableQuantity} />
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border-r"
                    disabled={quantity === 1 || availableQuantity === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(availableQuantity, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center border-l"
                    disabled={quantity === availableQuantity || availableQuantity === 0}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  className={cn(
                    "flex-1 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-colors",
                    availableQuantity === 0 && "bg-gray-400 cursor-not-allowed hover:bg-gray-400",
                  )}
                  onClick={handleAddToCart}
                  disabled={availableQuantity === 0}
                >
                  {availableQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* Additional Product Details */}
            <div className="mt-8 pt-8 border-t">
              <h3 className={cn("text-lg font-medium mb-4", satoshi.className)}>Product Details</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                {product.productDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

