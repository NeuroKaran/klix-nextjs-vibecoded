'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types'
import { ContextBuilder } from '@/lib/utils/contextBuilder'

interface MessageListProps {
  messages: Message[]
  loading: boolean
}

export function MessageList({ messages, loading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-white/95 to-gray-50/95">
      {messages.map((message, idx) => (
        <div
          key={message.id || idx}
          className={`
            mb-6 p-5 border-[3px] border-gray-900 rounded-xl
            shadow-[4px_4px_0px_rgba(0,0,0,0.15)]
            animate-slide-in
            ${message.role === 'user'
              ? 'bg-gradient-to-br from-white to-gray-50 border-l-[6px] border-l-klix-orange ml-[18%]'
              : 'bg-gradient-to-br from-orange-50 to-orange-100 border-r-[6px] border-r-klix-orange mr-[18%]'
            }
          `}
        >
          <div className="font-pixel text-[10px] text-klix-orange font-bold mb-3">
            ◈ {message.role === 'user' ? 'USER' : 'KLIX'}
          </div>
          <div className="font-pixel text-[10px] text-gray-900 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
          <div className="font-pixel text-[7px] text-gray-400 mt-3">
            {ContextBuilder.formatRelativeTime(message.created_at)}
          </div>
        </div>
      ))}

      {loading && (
        <div className="text-center py-5 px-6 font-pixel text-[10px] text-klix-orange bg-klix-orange/10 mx-6 rounded-xl border-2 border-klix-orange/30">
          <span className="inline-block">◈ KLIX IS THINKING</span>
          <span className="inline-block ml-1 animate-pulse">...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}