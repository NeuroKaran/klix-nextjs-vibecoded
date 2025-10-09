'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        // Register via API
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error)
        }

        // Now login
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (loginError) throw loginError

        router.push('/onboarding')
      } else {
        // Login
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (loginError) throw loginError

        router.push('/chat')
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md w-full p-10">
      <h1 className="font-pixel text-3xl text-klix-orange text-center mb-2">
        ◈ KLIX ◈
      </h1>
      <p className="font-pixel text-xs text-gray-600 text-center mb-8">
        AI with Memory
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          disabled={loading}
        />

        {error && (
          <div className="bg-red-100 border-2 border-red-500 rounded p-3">
            <p className="font-pixel text-[8px] text-red-600">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'LOADING...' : mode === 'login' ? 'LOGIN →' : 'REGISTER →'}
        </Button>
      </form>

      <button
        onClick={() => {
          setMode(mode === 'login' ? 'register' : 'login')
          setError('')
        }}
        className="mt-6 w-full font-pixel text-[8px] text-gray-600 hover:text-klix-orange underline"
        disabled={loading}
      >
        {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </Card>
  )
}