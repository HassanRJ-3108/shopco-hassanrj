import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { inter, integralCF, satoshi } from '@/app/ui/fonts'
import { ConditionalNavbar, ConditionalFooter } from "@/app/ConditionalNavFooter"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} ${integralCF.className} ${satoshi.className} antialiased flex flex-col min-h-screen`}
      >
        <ConditionalNavbar />
        <main className="flex-grow">
          {children}
        </main>
        <ConditionalFooter />
      </body>
    </html>
  )
}

