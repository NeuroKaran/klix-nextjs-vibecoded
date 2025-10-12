'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function LoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [router])

  return null
}
