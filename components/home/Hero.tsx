import Image from 'next/image'
import Link from 'next/link'
import { integralCF } from '@/app/ui/fonts'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="w-full bg-[#F2F0F1] min-h-screen">
      <div className="flex flex-col lg:flex-row items-center max-w-[1400px] mx-auto">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-20 py-12 lg:py-20">
          <h1 className={cn(
            "text-[38px] md:text-[56px] lg:text-[58px] font-bold leading-[1.1]",
            integralCF.className
          )}>
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>
          <p className="mt-6 text-gray-600 text-lg max-w-[480px]">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <Link
            href="/products"
            className="mt-8 px-12 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors w-fit text-base"
          >
            Shop Now
          </Link>

          {/* Stats Section - Visible on all screens */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="text-center">
              <div className="font-bold text-xl lg:text-2xl">200+</div>
              <div className="text-sm text-gray-600">International Brands</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl lg:text-2xl">2,000+</div>
              <div className="text-sm text-gray-600">High-Quality Products</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl lg:text-2xl">30,000+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full lg:w-[50%] h-[500px] lg:h-screen">
          <Image
            src="/images/hero1.jpeg"
            alt="Fashion Models"
            fill
            className="object-cover lg:object-contain lg:object-right-top"
            priority
          />
          {/* Decorative Stars */}
          <div className="absolute top-8 right-8 text-black">
            <StarIcon className="w-10 h-10" />
          </div>
          <div className="absolute bottom-1/3 left-8">
            <StarIcon className="w-8 h-8" />
          </div>
        </div>
      </div>
    </section>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  )
}

