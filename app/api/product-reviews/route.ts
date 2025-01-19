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

  if (!productId) {
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 })
  }

  try {
    const reviews = await client.fetch(`
      *[_type == "review" && product._ref == $productId] {
        _id,
        rating,
        content,
        createdAt,
        customer-> {
          name,
          email,
          phone
        }
      }
    `, { productId })

    // Handle potential undefined customer data
    const processedReviews = reviews.map((review: any) => ({
      ...review,
      customer: review.customer || { name: 'Anonymous', email: 'N/A', phone: 'N/A' }
    }))

    return NextResponse.json(processedReviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ message: 'Error fetching reviews' }, { status: 500 })
  }
}

