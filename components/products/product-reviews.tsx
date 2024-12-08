'use client'

import { useState } from 'react'
import { MoreHorizontal, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { satoshi } from '@/app/ui/fonts'
import * as Tabs from '@radix-ui/react-tabs'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'


interface Review {
  id: string
  author: string
  rating: number
  content: string
  date: string
  isVerified: boolean
}

const reviews: Review[] = [
  {
    id: '1',
    author: 'Samantha D.',
    rating: 4.5,
    content: 'I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It\'s become my favorite go-to shirt.',
    date: 'August 14, 2023',
    isVerified: true
  },
  {
    id: '2',
    author: 'Alex M.',
    rating: 4,
    content: 'The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I\'m quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.',
    date: 'August 15, 2023',
    isVerified: true
  },
  {
    id: '3',
    author: 'Ethan R.',
    rating: 3.5,
    content: 'This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer\'s touch in every aspect of this shirt.',
    date: 'August 16, 2023',
    isVerified: true
  },
  {
    id: '4',
    author: 'Olivia P.',
    rating: 4,
    content: 'As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It\'s evident that the designer poured their creativity into making this t-shirt stand out!',
    date: 'August 17, 2023',
    isVerified: true
  },
  // Add more reviews as needed
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(
            "h-5 w-5",
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200 fill-gray-200"
          )}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}
// StarRating component and reviews array are unchanged

export function ProductReviews() {
  const [activeTab, setActiveTab] = useState('reviews')

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex border-b">
          <Tabs.Trigger
            value="details"
            className={cn(
              "px-6 py-3 text-sm font-medium",
              activeTab === 'details'
                ? "border-b-2 border-black"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Product Details
          </Tabs.Trigger>
          <Tabs.Trigger
            value="reviews"
            className={cn(
              "px-6 py-3 text-sm font-medium",
              activeTab === 'reviews'
                ? "border-b-2 border-black"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Rating & Reviews
          </Tabs.Trigger>
          <Tabs.Trigger
            value="faqs"
            className={cn(
              "px-6 py-3 text-sm font-medium",
              activeTab === 'faqs'
                ? "border-b-2 border-black"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            FAQs
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="details" className="pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <h2 className={cn("text-lg font-medium", satoshi.className)}>
              Product Details Not available yet 😊
            </h2>
          </div>
        </Tabs.Content>

        <Tabs.Content value="reviews" className="pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h2 className={cn("text-lg font-medium", satoshi.className)}>
                All Reviews
                <span className="text-gray-500 ml-2">(451)</span>
              </h2>
              <button className="lg:hidden">
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:border-black transition-colors">
                  <span>Latest</span>
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="bg-white rounded-lg shadow-lg border p-1 min-w-[150px]">
                    <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-gray-50">
                      Latest
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-gray-50">
                      Highest Rating
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-gray-50">
                      Lowest Rating
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
              <button className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition-colors">
                Write a Review
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.author}</span>
                      {review.isVerified && (
                        <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="p-1 hover:bg-gray-100 rounded-full">
                      <MoreHorizontal className="h-5 w-5" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="bg-white rounded-lg shadow-lg border p-1 min-w-[150px]">
                        <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-gray-50">
                          Report Review
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
                <p className="mt-4 text-gray-600">{review.content}</p>
                <p className="mt-4 text-sm text-gray-500">Posted on {review.date}</p>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full py-4 border rounded-lg text-center hover:border-black transition-colors">
            Load More Reviews
          </button>
        </Tabs.Content>

        <Tabs.Content value="faqs" className="pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <h2 className={cn("text-lg font-medium", satoshi.className)}>
              FAQS Not Available yet 😊
            </h2>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
