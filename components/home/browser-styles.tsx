'use client'

import Image from 'next/image'
import Link from 'next/link'
import { integralCF, satoshi } from '@/app/ui/fonts'

const categories = [
  {
    id: 'casual',
    name: 'Casual',
    image: '/browse/casual.png',
    href: '/products'
  },
  {
    id: 'formal',
    name: 'Formal',
    image: '/browse/formal.png',
    href: '/productss'
  },
  {
    id: 'party',
    name: 'Party',
    image: '/browse/party.png',
    href: '/products'
  },
  {
    id: 'gym',
    name: 'Gym',
    image: '/browse/gym.png',
    href: '/products'
  }
]

export default function BrowseStyles() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8 md:py-12">
      <div className="rounded-[32px] bg-[#F0F0F0] p-6 md:p-8">
        <h2 className={`${integralCF.className} mb-6 text-center text-2xl font-bold md:mb-8 md:text-[32px]`}>
          BROWSE BY DRESS STYLE
        </h2>
        <div className="flex flex-col gap-4">
          {/* Responsive container that switches between column and row layouts */}
          <div className="flex flex-col gap-4 md:flex-row">
            <Link
              href={categories[0].href}
              className="group relative h-[200px] w-full overflow-hidden rounded-2xl bg-white md:h-[240px] md:w-1/2"
            >
              <Image
                src={categories[0].image}
                alt={categories[0].name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0">
                <h3 className={`${satoshi.className} absolute top-4 left-4 text-xl text-black md:text-2xl`}>
                  {categories[0].name}
                </h3>
              </div>
            </Link>
            <Link
              href={categories[1].href}
              className="group relative h-[200px] w-full overflow-hidden rounded-2xl bg-white md:h-[240px] md:w-1/2"
            >
              <Image
                src={categories[1].image}
                alt={categories[1].name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0">
                <h3 className={`${satoshi.className} absolute top-4 left-4 text-xl text-black md:text-2xl`}>
                  {categories[1].name}
                </h3>
              </div>
            </Link>
          </div>
          {/* Bottom row - switches between column and 60/40 split */}
          <div className="flex flex-col gap-4 md:flex-row">
            <Link
              href={categories[2].href}
              className="group relative h-[200px] w-full overflow-hidden rounded-2xl bg-white md:h-[240px] md:w-[60%]"
            >
              <Image
                src={categories[2].image}
                alt={categories[2].name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0">
                <h3 className={`${satoshi.className} absolute top-4 left-4 text-xl text-black md:text-2xl`}>
                  {categories[2].name}
                </h3>
              </div>
            </Link>
            <Link
              href={categories[3].href}
              className="group relative h-[200px] w-full overflow-hidden rounded-2xl bg-white md:h-[240px] md:w-[40%]"
            >
              <Image
                src={categories[3].image}
                alt={categories[3].name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0">
                <h3 className={`${satoshi.className} absolute top-4 left-4 text-xl text-black md:text-2xl`}>
                  {categories[3].name}
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

