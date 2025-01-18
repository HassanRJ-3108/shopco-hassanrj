import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  const customerId = searchParams.get('customerId')

  if (!productId || !customerId) {
    return NextResponse.json({ message: 'Product ID and Customer ID are required' }, { status: 400 })
  }

  try {
    // Check if the customer has purchased the product
    const order = await client.fetch(
      `*[_type == "order" && customer._ref == $customerId && $productId in items[].productId][0]`,
      { customerId, productId }
    )

    // Check if the customer has already reviewed the product
    const existingReview = await client.fetch(
      `*[_type == "review" && product._ref == $productId && customer._ref == $customerId][0]`,
      { productId, customerId }
    )

    const canReview = !!order && !existingReview

    return NextResponse.json({ canReview })
  } catch (error) {
    console.error('Error checking if customer can review:', error)
    return NextResponse.json({ message: 'Error checking if customer can review' }, { status: 500 })
  }
}

