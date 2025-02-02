import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { z } from 'zod'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-12-25',
  token: process.env.SANITY_API_TOKEN,
})

const deleteReviewSchema = z.object({
  reviewId: z.string(),
  email: z.string().email(),
  phone: z.string().regex(/^03\d{9}$/),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = deleteReviewSchema.parse(body)

    // Check if the review exists and belongs to the user
    const review = await client.fetch(
      `*[_type == "review" && _id == $reviewId && customer->email == $email && customer->phone == $phone][0]{
        _id,
        product->{_id}
      }`,
      { reviewId: validatedData.reviewId, email: validatedData.email, phone: validatedData.phone }
    )

    if (!review) {
      return NextResponse.json({ message: 'Review not found or you are not authorized to delete it.' }, { status: 404 })
    }

    // Delete the review
    await client.delete(validatedData.reviewId)

    // Remove the review reference from the product
    if (review.product && review.product._id) {
      await client
        .patch(review.product._id)
        .unset([`reviews[_ref=="${validatedData.reviewId}"]`])
        .commit()
    }

    return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting review:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid data', errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: 'Error deleting review: ' + (error as Error).message }, { status: 500 })
  }
}

