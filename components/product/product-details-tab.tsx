'use client'

interface ProductDetailsTabProps {
  productDetails: string[]
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
    <div className="max-w-7xl">
      <ul className="list-disc pl-5 space-y-2">
        {productDetails.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>
    </div>
  )
}