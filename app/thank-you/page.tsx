import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-8">
          We&apos;ve received your order and will process it shortly. You&apos;ll receive a confirmation email with your order details.
        </p>
        <Link href="/" passHref>
          <Button className="w-full">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}

