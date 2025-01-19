import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { z } from 'zod'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const reviewSchema = z.object({
  productId: z.string(),
  email: z.string().email(),
  phone: z.string().regex(/^03\d{9}$/),
  rating: z.number().min(1).max(5),
  content: z.string().min(10),
  createdAt: z.string().datetime()
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = reviewSchema.parse(body)

    // Check if the customer exists
    const customer = await client.fetch(
      `*[_type == "customer" && email == $email && phone == $phone][0]`,
      { email: validatedData.email, phone: validatedData.phone }
    )

    if (!customer) {
      return NextResponse.json({ message: 'Customer not found. Please check your email and phone number.' }, { status: 403 })
    }

    // Create the review
    const review = await client.create({
      _type: 'review',
      product: {
        _type: 'reference',
        _ref: validatedData.productId,
      },
      customer: {
        _type: 'reference',
        _ref: customer._id,
      },
      rating: validatedData.rating,
      content: validatedData.content,
      createdAt: validatedData.createdAt,
    })

    // Add the review reference to the product
    await client
      .patch(validatedData.productId)
      .setIfMissing({ reviews: [] })
      .append('reviews', [{ _type: 'reference', _ref: review._id }])
      .commit()

    return NextResponse.json({ message: 'Review submitted successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error submitting review:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid data', errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: 'Error submitting review' }, { status: 500 })
  }
}

