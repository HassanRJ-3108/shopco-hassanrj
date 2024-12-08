import Link from "next/link"
import { ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { inter } from '@/app/ui/fonts'

export default function NotFound() {
    return (
        <div className={`${inter.className} min-h-screen bg-white`}>
            {/* Breadcrumb */}
            <div className="mt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 py-3.5">
                        <Link 
                            href="/" 
                            className="text-[#666666] hover:text-black transition-colors text-sm"
                        >
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4 text-[#666666]" />
                        <span className="text-sm">404 Error</span>
                    </nav>
                </div>
            </div>

            {/* 404 Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 mt-7 md:py-24 lg:py-32">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium mb-8">
                        404 Not Found
                    </h1>
                    <p className="text-base sm:text-lg text-[#666666] mb-8 sm:mb-12">
                        Your visited page not found. You may go home page.
                    </p>
                    <Button 
                        asChild
                        className="h-12 px-8 bg-black hover:bg-gray-900 rounded-sm text-base"
                    >
                        <Link href="/">
                            Back to home page
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

