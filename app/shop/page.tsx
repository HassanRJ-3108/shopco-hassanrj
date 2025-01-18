import { Metadata } from 'next'
import { Suspense } from 'react'
import Loader from '@/components/Loader'
import ClientProductsGrid from '@/components/products/ClientProductsGrid'

export const metadata: Metadata = {
  title: 'Our Products | SHOP.CO',
  description: 'Explore our wide range of stylish clothing and accessories. Find the perfect outfit that matches your unique style at SHOP.CO.',
  openGraph: {
    title: 'Our Products | SHOP.CO',
    description: 'Explore our wide range of stylish clothing and accessories. Find the perfect outfit that matches your unique style.',
    type: 'website',
    url: 'https://www.shopco-hassanrj.vercel.app/shop',
    images: [
      {
        url: '/images/products-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'SHOP.CO Products',
      },
    ],
  },
}

export default function ShopPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ClientProductsGrid />
    </Suspense>
  )
}
