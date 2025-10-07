'use client'

import { useState, useCallback } from 'react'
import { Message } from '@/types'

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string, geminiKey: string) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: content,
          apiKey: geminiKey
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      // Messages are now in database, will be fetched via realtime
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  return {
    messages,
    loading,
    error,
    sendMessage,
    setMessages,
  }
}