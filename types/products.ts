export interface Product{
  id: string
  title: string
  slug: {
    current: string
  }
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  imageUrl: string
  discount: number
  createdAt: string
}
