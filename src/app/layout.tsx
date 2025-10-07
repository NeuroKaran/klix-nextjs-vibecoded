import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import { PixelBackground } from '@/coomponents/background/PixelBackground'
import './globals.css'

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
})

export const metadata: Metadata = {
  title: 'Klix - AI with Memory',
  description: 'Your intelligent AI companion that learns and adapts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${pressStart.variable} antialiased bg-gradient-to-br from-white via-gray-50 to-gray-100`}>
        <PixelBackground />
        {children}
      </body>
    </html>
  )
}