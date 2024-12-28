'use client'

import { PortableText } from "@/components/portable-text"

interface ProductDetailsTabProps {
  productDetails: any[]
}

export function ProductDetailsTab({ productDetails }: ProductDetailsTabProps) {
  if (!productDetails?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No product details available.
      </div>
    )
  }

  return (
    <div className="max-w-7xl ">
      <PortableText blocks={productDetails} />
    </div>
  )
}

