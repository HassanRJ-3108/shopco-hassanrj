import Image from 'next/image'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { satoshi } from '@/app/ui/fonts'
import { Product } from '@/types/product'

type ProductCardProps = Pick<Product, '_id' | 'title' | 'price' | 'originalPrice' | 'rating' | 'slug' | 'category' | 'style' | 'colors' | 'sizes'> & {
  imageUrl: string;
}

export function ProductCard({
  title,
  price,
  originalPrice,
  rating,
  imageUrl,
}: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
              )}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">({rating})</span>
        </div>
        <h3 className={cn("font-medium line-clamp-1", satoshi.className)}>{title}</h3>
        <div className="flex items-center gap-2">
          <span className="font-medium">${price}</span>
          {originalPrice && originalPrice > price && (
            <>
              <span className={`${satoshi.className} text-sm text-gray-500 line-through`}>${originalPrice}</span>
              <span className="text-sm text-red-600">
                -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
