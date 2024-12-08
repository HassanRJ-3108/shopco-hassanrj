'use client'

import { useState } from 'react'
import { Mail, Twitter, Facebook, Instagram, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { integralCF } from '@/app/ui/fonts'

const footerLinks = {
  company: [
    { name: 'About', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Works', href: '#' },
    { name: 'Career', href: '#' },
  ],
  help: [
    { name: 'Customer Support', href: '#' },
    { name: 'Delivery Details', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ],
  faq: [
    { name: 'Account', href: '#' },
    { name: 'Manage Deliveries', href: '#' },
    { name: 'Orders', href: '#' },
    { name: 'Payments', href: '#' },
  ],
  resources: [
    { name: 'Free eBooks', href: '#' },
    { name: 'Development Tutorial', href: '#' },
    { name: 'How to - Blog', href: '#' },
    { name: 'Youtube Playlist', href: '#' },
  ],
}

const socialLinks = [
  { name: 'Twitter', href: '#', Icon: Twitter },
  { name: 'Facebook', href: '#', Icon: Facebook },
  { name: 'Instagram', href: '#', Icon: Instagram },
  { name: 'Github', href: '#', Icon: Github },
]

const paymentMethods = [
  { name: 'Visa', image: '/payments/visa.svg' },
  { name: 'Mastercard', image: '/payments/mastercard.svg' },
  { name: 'PayPal', image: '/payments/paypal.svg' },
  { name: 'Apple Pay', image: '/payments/pay.svg' },
  { name: 'Google Pay', image: '/payments/g-pay.svg' },
]

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Subscribing email:', email)
    setEmail('')
  }

  return (
    <footer className="relative mt-32 bg-[#F0F0F0] pt-32">
      {/* Newsletter Section - Positioned half outside the footer */}
      <div className="absolute -top-24 left-1/2 w-full max-w-[1240px] -translate-x-1/2 px-4">
        <div className="rounded-[32px] bg-black p-6 md:p-8">
          <div className="md:flex md:items-center md:justify-between md:gap-8">
            <h2 
              className={`${integralCF.className} mb-6 text-2xl font-bold leading-tight text-white md:mb-0 md:max-w-[450px] md:text-[32px]`}
            >
              STAY UPTO DATE ABOUT OUR LATEST OFFERS
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 w-full rounded-full bg-white pl-12 pr-4 text-base outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200 md:w-[280px]"
                  required
                />
              </div>
              <button
                type="submit"
                className="h-12 rounded-full bg-white px-8 font-medium text-black transition-colors hover:bg-gray-100"
              >
                Subscribe to Newsletter
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="mx-auto max-w-[1240px] px-4 pb-8 pt-16">
        <div className="grid gap-8 grid-cols-2 lg:grid-cols-5 mt-10 lg:mt-0">
          {/* Shop.co Info */}
          <div className="lg:col-span-1">
            <h2 className={`${integralCF.className} text-2xl font-bold`}>SHOP.CO</h2>
            <p className="mt-4 text-sm text-gray-600">
              We have clothes that suits your style and which you&apos;re proud to wear. From women to men.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="rounded-full bg-white p-1 transition-colors hover:bg-black group"
                >
                  <social.Icon className="h-6 w-6 transition-colors group-hover:text-white" />
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-medium">COMPANY</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-medium">HELP</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Links */}
          <div>
            <h3 className="font-medium">FAQ</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.faq.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-medium">RESOURCES</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-200 pt-8 md:flex-row">
          <p className="mb-4 text-sm text-gray-600 md:mb-0">
            Shop.co © 2000-2023, All Rights Reserved
          </p>
          <div className="flex gap-4">
            {paymentMethods.map((method) => (
              <Image
                key={method.name}
                src={method.image}
                alt={method.name}
                width={32}
                height={20}
                className="h-5 w-auto"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

