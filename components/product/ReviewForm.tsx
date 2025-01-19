'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { StarIcon } from '@heroicons/react/20/solid'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const reviewSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^03\d{9}$/, 'Invalid phone number'),
  rating: z.number().min(1).max(5),
  content: z.string().min(10, 'Review must be at least 10 characters'),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  })

  const onSubmit = async (data: ReviewFormData) => {
    try {
      const response = await fetch('/api/submit-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, productId, createdAt: new Date().toISOString() }),
      })

      if (response.ok) {
        setIsOpen(false)
        onSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      setError('An error occurred while submitting the review')
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition-colors">
          Write a Review
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">Write a Review</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Please provide your email and phone number to submit a review.
          </Dialog.Description>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 cursor-pointer ${
                      star <= (watch('rating') || 0) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => setValue('rating', star)}
                  />
                ))}
              </div>
              {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Review
              </label>
              <textarea
                id="content"
                {...register('content')}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              ></textarea>
              {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className="absolute top-2 right-2 inline-flex items-center justify-center rounded-full p-2 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

