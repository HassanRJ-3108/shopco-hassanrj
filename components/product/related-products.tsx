'use client'

import { Star, StarHalf } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { client } from '@/sanity/lib/client'
import { productsQuery } from '@/sanity/lib/queries'
import { integralCF, satoshi } from '@/app/ui/fonts'

interface Product {
  _id: string
  slug: {
    current: string;
  };
  title: string
  price: number
  originalPrice?: number
  rating: number
  images: string[]
}

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
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchProducts() {
      const allProducts: Product[] = await client.fetch(productsQuery)
      const randomProducts = allProducts
        .sort(() => 0.5 - Math.random()) // Randomly shuffle the array
        .slice(0, 4) // Select the first 4 products
      setProducts(randomProducts)
    }

    fetchProducts()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className={` ${integralCF.className} mb-8 text-center text-3xl font-bold tracking-tight`}>YOU MIGHT ALSO LIKE</h2>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/shop/${product.slug.current}`}
            className="group rounded-lg bg-gray-50 p-4 transition-transform hover:scale-[1.02]"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              <Image
                src={product.images && product.images.length > 0 ? product.images[0] : ''}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className={` ${satoshi.className} font-medium text-gray-900`}>{product.title}</h3>
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
