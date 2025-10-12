import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import { PixelBackground } from '@/components/background/PixelBackground'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { WelcomeLayout } from '@/components/onboarding/WelcomeLayout'
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
      <body className={`${pressStart.variable} font-pixel antialiased bg-gradient-to-br from-white via-gray-50 to-gray-100`}>
        <PixelBackground />
        <ErrorBoundary>
          <WelcomeLayout>{children}</WelcomeLayout>
        </ErrorBoundary>
      </body>
    </html>
  )
}