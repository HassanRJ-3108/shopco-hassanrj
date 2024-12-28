import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from 'lucide-react'
import{inter, integralCF} from '@/app/ui/fonts'


export default function OurStory() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8 my-10">
                <Link href="/" className="text-gray-500 hover:text-gray-900">
                    Home
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">About</span>
            </nav>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 my-20">
                {/* Story Content */}
                <div className="relative">
                    <div className=" p-6 sm:p-8">
                        <h1 className={`text-3xl sm:text-4xl font-medium mb-6 ${integralCF.className}`}>Our Story</h1>
                        <div className={`space-y-4 text-gray-600 text-base sm:text-lg leading-relaxed ${inter.className}`}>
                            <p>
                                Launched in 2015, Exclusive is South Asia&apos;s premier online shopping
                                marketplace with an active presence in Bangladesh. Supported
                                by wide range of tailored marketing, data and service solutions,
                                Exclusive has 10,500 sellers and 300 brands and serves 3
                                millions customers across the region.
                            </p>
                            <p>
                                Exclusive has more than 1 Million products to offer, growing at a
                                very fast. Exclusive offers a diverse assortment in categories
                                ranging from consumer.
                            </p>
                        </div>
                    </div>
                    {/* Blue Border Overlay */}
                    <div className="absolute -top-1 -right-1 left-1 bottom-1 -z-10"></div>
                </div>

                {/* Image */}
                <div className="relative aspect-[4/3] lg:aspect-auto bg-[#F4C8D3]">
                    <Image
                        src="/about/about.png"
                        alt="Women shopping with bags"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}

