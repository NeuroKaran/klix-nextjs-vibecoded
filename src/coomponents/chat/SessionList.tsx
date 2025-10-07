'use client'

import { useRef, useState } from 'react'
import { Session } from '@/types'
import { ContextBuilder } from '@/lib/utils/contextBuilder'

interface SessionListProps {
  sessions: Session[]
  currentSessionId: string | null
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
}

export function SessionList({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession
}: SessionListProps) {
  const [deleteHold, setDeleteHold] = useState<string | null>(null)
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleDeleteStart = (sessionId: string) => {
    setDeleteHold(sessionId)
    deleteTimerRef.current = setTimeout(() => {
      if (window.confirm('Delete this session permanently?')) {
        onDeleteSession(sessionId)
      }
      setDeleteHold(null)
    }, 2000)
  }

  const handleDeleteEnd = () => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current)
    }
    setDeleteHold(null)
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 bg-gray-50/50">
      <div className="font-pixel text-[9px] text-gray-600 mb-4 px-2 py-2 bg-klix-orange/10 rounded border-l-[3px] border-klix-orange">
        ◈ CHAT HISTORY
      </div>

      {sessions.map((session) => {
        const isActive = session.id === currentSessionId
        const isDeleting = deleteHold === session.id
        const hasCustomMemory = session.session_memory !== null

        return (
          <div
            key={session.id}
            className={`
              relative p-3.5 mb-2 bg-white border-2 rounded-md cursor-pointer
              transition-all font-pixel text-[8px]
              ${isActive 
                ? 'border-klix-orange border-[3px] bg-gradient-to-br from-orange-50 to-orange-100 shadow-[0_0_0_2px_rgba(255,140,66,0.2)]' 
                : 'border-gray-200 hover:border-klix-orange hover:translate-x-1'
              }
              ${isDeleting ? 'bg-red-50 border-red-400' : ''}
            `}
            onClick={() => onSelectSession(session.id)}
            onMouseDown={() => handleDeleteStart(session.id)}
            onMouseUp={handleDeleteEnd}
            onMouseLeave={handleDeleteEnd}
            onTouchStart={() => handleDeleteStart(session.id)}
            onTouchEnd={handleDeleteEnd}
          >
            {/* Memory Indicator */}
            <div className="absolute top-2 right-2 text-xs" title={hasCustomMemory ? 'Custom session memory' : 'Using global memory'}>
              {hasCustomMemory ? '🧠' : '🌐'}
            </div>

            <div className="font-bold text-gray-900 mb-2 pr-6 leading-snug">
              {session.title}
            </div>
            <div className="text-gray-600 text-[7px] leading-relaxed truncate">
              {session.messages?.[session.messages.length - 1]?.content.substring(0, 30) || 'No messages'}...
            </div>
            <div className="text-gray-400 text-[6px] mt-2">
              {ContextBuilder.formatRelativeTime(session.updated_at)}
            </div>

            {/* Delete Progress Bar */}
            {isDeleting && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-200 overflow-hidden">
                <div className="h-full bg-red-500 animate-delete-progress" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}