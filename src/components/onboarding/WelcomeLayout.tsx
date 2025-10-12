'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function WelcomeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('hasVisited')
      setIsFirstVisit(!hasVisited)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited && pathname !== '/welcome') {
      router.push('/welcome')
    }
  }, [pathname, router, isFirstVisit])

  if (isFirstVisit === null) {
    return null
  }

  return <>{children}</>
}
