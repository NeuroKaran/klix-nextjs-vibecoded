'use client'

import { useState, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/Button'

interface MessageInputProps {
  onSend: (message: string) => void
  disabled: boolean
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-3 p-6 border-t-[3px] border-gray-900 bg-gradient-to-br from-gray-50/95 to-white/95">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 px-4 py-3 font-pixel text-[9px] bg-white border-[3px] border-gray-900 rounded-lg focus:outline-none focus:border-klix-orange focus:shadow-[0_0_0_3px_rgba(255,140,66,0.2)] transition-all placeholder:text-gray-400"
      />
      <Button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        size="md"
        className="text-[11px] px-6"
      >
        ►
      </Button>
    </div>
  )
}