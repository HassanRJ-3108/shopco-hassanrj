'use client'

import { useState, useEffect } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { MoreHorizontal, SlidersHorizontal, MessageSquare, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { satoshi } from '@/app/ui/fonts'
import { FAQsTab } from './faqs-tab'
import { ProductDetailsTab } from './product-details-tab'
import { Product, Review } from '@/types/product'
import { ReviewForm } from './ReviewForm'
import { DeleteReviewForm } from './DeleteReviewForm'

interface ProductReviewsProps {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-5 w-5",
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200 fill-gray-200"
          )}
        />
      ))}
    </div>
  )
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const [activeTab, setActiveTab] = useState('reviews')
  const [sortOrder, setSortOrder] = useState<'latest' | 'highest' | 'lowest'>('latest')
  const [visibleReviews, setVisibleReviews] = useState(5)
  const [reviews, setReviews] = useState<Review[]>([])
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  useEffect(() => {
    if (product && product._id) {
      fetchReviews(product._id)
    }
  }, [product])

  const fetchReviews = async (productId: string) => {
    try {
      const response = await fetch(`/api/product-reviews?productId=${productId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    }
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortOrder === 'highest') {
      return b.rating - a.rating
    } else {
      return a.rating - b.rating
    }
  })

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => Math.min(prev + 5, reviews.length))
  }

  const handleReviewSubmitted = () => {
    fetchReviews(product._id)
  }

  const handleReviewDeleted = () => {
    fetchReviews(product._id);
  }

  const handleDeleteClick = (reviewId: string) => {
    setDeletingReviewId(reviewId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex border-b">
          {['details', 'reviews', 'faqs'].map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className={cn(
                "px-6 py-3 text-sm font-medium",
                activeTab === tab
                  ? "border-b-2 border-black"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab === 'details' ? 'Product Details' : tab === 'reviews' ? 'Rating & Reviews' : 'FAQs'}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="details" className="pt-8">
          <ProductDetailsTab productDetails={product.productDetails || []} />
        </Tabs.Content>

        <Tabs.Content value="reviews" className="pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h2 className={cn("text-lg font-medium", satoshi.className)}>
                All Reviews
                <span className="text-gray-500 ml-2">({reviews.length})</span>
              </h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(averageRating)} />
                  <span className="text-sm text-gray-500">({averageRating.toFixed(1)})</span>
                </div>
              )}
              <button className="lg:hidden">
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              {reviews.length > 0 && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:border-black transition-colors">
                    <span>{sortOrder === 'latest' ? 'Latest' : sortOrder === 'highest' ? 'Highest Rating' : 'Lowest Rating'}</span>
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-white rounded-lg shadow-lg border p-1 min-w-[150px]">
                      <DropdownMenu.Item 
                        className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-gray-50"
                        onClick={() => setSortOrder('latest')}
                      >
                        Latest
                      </DropdownMenu.Item>
                      <DropdownMenu.Item 
                        className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-gray-50"
                        onClick={() => setSortOrder('highest')}
                      >
                        Highest Rating
                      </DropdownMenu.Item>
                      <DropdownMenu.Item 
                        className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-gray-50"
                        onClick={() => setSortOrder('lowest')}
                      >
                        Lowest Rating
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              )}
              <ReviewForm 
                productId={product._id} 
                onSuccess={handleReviewSubmitted} 
              />
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="grid gap-6">
              {sortedReviews.slice(0, visibleReviews).map((review) => (
                <div key={review._id} className="p-6 border rounded-lg">
                  {deletingReviewId === review._id ? (
                    <DeleteReviewForm
                      reviewId={review._id}
                      onSuccess={() => {
                        setDeletingReviewId(null);
                        fetchReviews(product._id);
                      }}
                      onCancel={() => setDeletingReviewId(null)}
                    />
                  ) : (
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.customer?.name || 'Anonymous'}</span>
                            {review.isVerified && (
                              <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <StarRating rating={review.rating} />
                        </div>
                        <button
                          onClick={() => handleDeleteClick(review._id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete Review
                        </button>
                      </div>
                      <p className="mt-4 text-gray-600">{review.content}</p>
                      <p className="mt-4 text-sm text-gray-500">
                        Posted on {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
              <p className="text-gray-500 text-center mb-6">Be the first to review this product</p>
              <ReviewForm 
                productId={product._id} 
                onSuccess={handleReviewSubmitted} 
              />
            </div>
          )}

          {reviews.length > visibleReviews && (
            <button 
              className="mt-8 w-full py-4 border rounded-lg text-center hover:border-black transition-colors"
              onClick={loadMoreReviews}
            >
              Load More Reviews
            </button>
          )}
        </Tabs.Content>

        <Tabs.Content value="faqs" className="pt-8">
          <FAQsTab faqs={product.faqs || []} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

