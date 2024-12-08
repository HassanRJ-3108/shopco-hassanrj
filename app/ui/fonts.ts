import localFont from 'next/font/local'
import { Inter } from 'next/font/google'


export const integralCF = localFont({
  src: [
    {
      path: '../fonts/IntegralCF-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/IntegralCF-Bold.otf',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-integral-cf'
})
export const satoshi = localFont({
  src: [
    {
      path: '../fonts/Satoshi-Bold.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi'
})

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
