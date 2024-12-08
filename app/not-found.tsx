import Link from "next/link";
import { ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 | Page Not Found - SHOP.CO',
  description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Go back to the SHOP.CO homepage to explore more.',
  keywords: '404 error, page not found, shop.co, hassanrj, error page, website error, return to home',
  robots: 'noindex, follow', // Prevent indexing but allow links to be followed.
  openGraph: {
    title: '404 | Page Not Found - SHOP.CO',
    description: 'This page is not available. Go back to the homepage to explore our amazing collection of products.',
    type: 'website',
    siteName: 'SHOP.CO',
    images: ['/images/404-error.jpg'], // Replace with an actual image path if available.
  },
};

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
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Button 
            asChild
            className="h-12 px-8 bg-black hover:bg-gray-900 rounded-sm text-base"
          >
            <Link href="/">
              Back to Home Page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
