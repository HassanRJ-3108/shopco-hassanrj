import { Metadata } from 'next'
import { CartPage } from '@/components/cart/cart-page'
import { Suspense } from 'react'


export const metadata: Metadata = {
  title: 'Your Shopping Cart | SHOP.CO',
  description: 'Review and manage the items in your shopping cart. Proceed to checkout to complete your purchase at SHOP.CO.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Your Shopping Cart | SHOP.CO',
    description: 'Review and manage the items in your shopping cart. Proceed to checkout to complete your purchase.',
    type: 'website',
    url: 'https://www.shopco-hassanrj.vercel.app/cart',
  },
}

export default function ShoppingCartPage() {
  return (
  
      <Suspense fallback={<div>Loading cart...</div>}>
        <CartPage />
      </Suspense>
      
 
  )
}

