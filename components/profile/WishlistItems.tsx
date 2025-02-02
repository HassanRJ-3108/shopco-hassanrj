import { auth } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"
import { client } from "@/sanity/lib/client"
import { userWishlistQuery } from "@/sanity/lib/queries"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface WishlistItem {
  _id: string
  product: {
    _id: string
    title: string
    price: number
    slug: string
    imageUrl: string
  }
}

export default async function WishlistItems() {
  const { userId } = await auth()
  const wishlistItems = await client.fetch<WishlistItem[]>(userWishlistQuery, { userId })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlistItems.map((item) => (
        <div key={item._id} className="bg-white shadow rounded-lg p-4 flex flex-col">
          <Image
            src={item.product.imageUrl || "/placeholder.svg"}
            alt={item.product.title}
            width={200}
            height={200}
            className="w-full h-48 object-cover mb-4 rounded-md"
          />
          <h3 className="text-lg font-semibold mb-2">{item.product.title}</h3>
          <p className="text-gray-600 mb-4">{formatCurrency(item.product.price)}</p>
          <div className="mt-auto">
            <Button asChild className="w-full">
              <Link href={`/product/${item.product.slug}`}>View Product</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

