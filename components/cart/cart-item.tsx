import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { satoshi } from '@/app/ui/fonts'

interface CartItemProps {
  id: string
  name: string
  size: string
  color: string
  price: number
  image: string
  quantity: number
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({
  id,
  name,
  size,
  color,
  price,
  image,
  quantity,
  onUpdateQuantity,
  onRemove
}: CartItemProps) {
  return (
    <div className="flex gap-4 py-6 border-b">
      <div className="relative h-24 w-24 rounded-lg bg-gray-100 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className={cn("text-lg font-medium", satoshi.className)}>{name}</h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-500">Size: {size}</p>
              <p className="text-sm text-gray-500">Color: {color}</p>
            </div>
          </div>
          <button
            onClick={() => onRemove(id)}
            className="text-gray-400 hover:text-gray-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center border rounded-full">
            <button
              onClick={() => onUpdateQuantity(id, quantity - 1)}
              disabled={quantity <= 1}
              className="h-8 w-8 flex items-center justify-center text-lg border-r disabled:opacity-50"
            >
              -
            </button>
            <span className="h-8 w-12 flex items-center justify-center text-sm">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(id, quantity + 1)}
              className="h-8 w-8 flex items-center justify-center text-lg border-l"
            >
              +
            </button>
          </div>
          <p className={cn("text-lg font-medium", satoshi.className)}>${price}</p>
        </div>
      </div>
    </div>
  )
}

