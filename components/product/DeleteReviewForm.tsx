'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const deleteReviewSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^03\d{9}$/, 'Invalid phone number'),
})

type DeleteReviewFormData = z.infer<typeof deleteReviewSchema>

interface DeleteReviewFormProps {
  reviewId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DeleteReviewForm({ reviewId, onSuccess, onCancel }: DeleteReviewFormProps) {
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<DeleteReviewFormData>({
    resolver: zodResolver(deleteReviewSchema),
  })

  const onSubmit = async (data: DeleteReviewFormData) => {
    try {
      const response = await fetch('/api/delete-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, reviewId }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      setError('An error occurred while deleting the review')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-bold mb-4">Delete Review</h3>
      <p className="text-sm text-gray-500 mb-4">
        Please enter your email and phone number to confirm your identity and delete your review.
      </p>
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
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Delete Review
          </button>
        </div>
      </form>
    </motion.div>
  )
}

