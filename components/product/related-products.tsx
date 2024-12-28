'use client'

import { Star, StarHalf } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { integralCF, satoshi } from '@/app/ui/fonts'
interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  image: string
}

const products: Product[] = [
  {
    id: '3',
    name: 'T-shirt with Tape Details',
    price: 120,
    rating: 4.5,
    image: '/products/tape-tshirt.png'
  },
  {
    id: '4',
    name: 'Skinny Fit Jeans',
    price: 240,
    originalPrice: 260,
    rating: 3.5,
    image: '/products/skinny-jeans.png'
  },
  {
    id: '5',
    name: 'Checkered Shirt',
    price: 180,
    rating: 4.5,
    image: '/products/checkered-tshirt.png'
  },
  {
    id: '6',
    name: 'Sleeve Striped T-shirt',
    price: 130,
    originalPrice: 160,
    rating: 4.5,
    image: '/products/sleave-tshirt.png'
  }
]

function StarRating({ rating }: { rating: number }) {
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
      <span className="ml-1 text-sm text-gray-600">{rating}/5</span>
    </div>
  )
}

export default function RelatedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className={` ${integralCF.className} mb-8 text-center text-3xl font-bold tracking-tight`}>YOU MIGHT ALSO LIKE</h2>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group rounded-lg bg-gray-50 p-4 transition-transform hover:scale-[1.02]"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className={` ${satoshi.className} font-medium text-gray-900`}>{product.name}</h3>
              <StarRating rating={product.rating} />
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className={`${satoshi.className} text-sm text-gray-500 line-through`}>${product.originalPrice}</span>
                    <span className="text-sm text-red-600">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
    </section>
  )
}

