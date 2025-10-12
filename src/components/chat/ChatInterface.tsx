'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session, Message } from '@/types'
import { SessionList } from './SessionList'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { Prompt } from '../ui/Prompt'
import { Modal } from '../ui/Modal'

export function ChatInterface() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [geminiKey, setGeminiKey] = useState('')
  const [userName, setUserName] = useState('')
  const [isMemoryPromptOpen, setMemoryPromptOpen] = useState(false)
  const [isApiKeyPromptOpen, setApiKeyPromptOpen] = useState(false)
  const [pendingMessage, setPendingMessage] = useState('')
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState<boolean>(true)
  const router = useRouter()
  const supabase = createClient()

  const fetchUserAndSessions = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single()

    if (profile) setUserName(profile.name)

    const { data: sessionData } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (sessionData && sessionData.length > 0) {
      setSessions(sessionData)
      loadSession(sessionData[0].id)
    }
    setIsInitializing(false)
  }, [supabase, router])

  const subscribeToMessages = useCallback(() => {
    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (currentSession && payload.new.session_id === currentSession.id) {
            setMessages(prev => [...prev, payload.new as Message])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, currentSession])

  useEffect(() => {
    const apiKey = sessionStorage.getItem('gemini_key')
    if (apiKey) setGeminiKey(apiKey)
    
    fetchUserAndSessions()
    subscribeToMessages()
  }, [fetchUserAndSessions, subscribeToMessages])

  const loadSession = async (sessionId: string) => {
    const res = await fetch(`/api/sessions/${sessionId}`)
    const session = await res.json()
    
    setCurrentSession(session)
    setMessages(session.messages || [])
  }

  const createNewSession = async () => {
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Chat' })
    })

    const newSession = await res.json()
    setSessions([newSession, ...sessions])
    setCurrentSession(newSession)
    setMessages([])
  }

  const requestDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId)
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return

    await fetch(`/api/sessions/${sessionToDelete}`, { method: 'DELETE' })
    
    const newSessions = sessions.filter(s => s.id !== sessionToDelete)
    setSessions(newSessions)
    
    if (currentSession?.id === sessionToDelete) {
      if (newSessions.length > 0) {
        loadSession(newSessions[0].id)
      } else {
        setCurrentSession(null)
        setMessages([])
      }
    }
    setDeleteConfirmOpen(false)
    setSessionToDelete(null)
  }

  const handleEditMemory = (newMemory: string) => {
    if (newMemory.trim() && currentSession) {
      fetch(`/api/sessions/${currentSession.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_memory: newMemory.trim() })
      })

      setCurrentSession({ ...currentSession, session_memory: newMemory.trim() })
    }
  }

  const handleApiKey = (key: string) => {
    if (!key) return
    setGeminiKey(key)
    sessionStorage.setItem('gemini_key', key)
    if (pendingMessage) {
      sendMessage(pendingMessage, key)
      setPendingMessage('')
    }
  }

  const sendMessage = async (content: string, apiKey?: string) => {
    if (!currentSession) return

    const key = apiKey || geminiKey
    if (!key) {
      setPendingMessage(content)
      setApiKeyPromptOpen(true)
      return
    }

    setLoading(true)
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSession.id,
          message: content,
          apiKey: key
        })
      })
    } catch (err: any) {
      alert(err.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    sessionStorage.removeItem('gemini_key')
    router.push('/login')
  }

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex items-center gap-4 font-pixel text-lg text-klix-orange">
          <div className="animate-spin">◈</div>
          Loading KLIX
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-white/98 border-r-[3px] border-gray-900 flex flex-col shadow-[4px_0_12px_rgba(0,0,0,0.08)]">
        {/* Sidebar Header */}
        <div className="p-6 bg-gradient-to-r from-klix-orange to-klix-orange-light border-b-[3px] border-gray-900">
          <h2 className="font-pixel text-base text-white mb-4">◈ KLIX</h2>
          <Button onClick={createNewSession} className="w-full font-bold">
            + NEW CHAT
          </Button>
        </div>

        {/* Session List */}
        <SessionList
          sessions={sessions}
          currentSessionId={currentSession?.id || null}
          onSelectSession={loadSession}
          onDeleteSession={requestDeleteSession}
        />

        {/* Sidebar Footer */}
        <div className="p-5 border-t-[3px] border-gray-900 bg-gray-50/90">
          <div className="font-pixel text-[8px] text-gray-600 mb-3 px-2 py-2 bg-klix-orange/10 rounded text-center">
            👤 {userName}
          </div>
          <Button variant="danger" size="sm" onClick={handleLogout} className="w-full">
            LOGOUT
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-klix-orange to-klix-orange-light text-white px-9 py-6 border-b-[3px] border-gray-900 flex justify-between items-center shadow-[0_3px_10px_rgba(0,0,0,0.1)]">
          <h1 className="font-pixel text-xl">◈ KLIX AI ◈</h1>
          {currentSession && (
            <button
              onClick={() => setMemoryPromptOpen(true)}
              className="font-pixel text-[8px] px-3.5 py-2 bg-white text-klix-orange border-2 border-gray-900 rounded-md hover:translate-y-[-2px] transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0px_rgba(0,0,0,0.3)] flex items-center gap-2"
            >
              <span className="text-xs">
                {currentSession.session_memory ? '🧠' : '🌐'}
              </span>
              EDIT MEMORY
            </button>
          )}
        </div>

        {/* Chat Area */}
        {currentSession ? (
          <div className="flex-1 flex flex-col border-[3px] border-gray-900 bg-white/98 rounded-2xl shadow-[8px_8px_0px_rgba(0,0,0,0.15)] m-9 overflow-hidden">
            <MessageList messages={messages} loading={loading} />
            <MessageInput onSend={sendMessage} disabled={loading} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <h2 className="font-pixel text-2xl text-klix-orange mb-5">
              ◈ WELCOME TO KLIX ◈
            </h2>
            <p className="font-pixel text-[10px] text-gray-600 mb-8 leading-relaxed max-w-md">
              Create a new chat to get started with your AI companion!
            </p>
            <Button onClick={createNewSession} size="lg">
              + CREATE NEW CHAT
            </Button>
          </div>
        )}
      </div>

      <Prompt
        isOpen={isMemoryPromptOpen}
        onClose={() => setMemoryPromptOpen(false)}
        onConfirm={handleEditMemory}
        title="SESSION MEMORY"
        label="Customize how Klix behaves in this specific chat. Example: 'Act as a Python expert. Be technical and concise.'"
        defaultValue={currentSession?.session_memory || ''}
        type="textarea"
      />

      <Prompt
        isOpen={isApiKeyPromptOpen}
        onClose={() => setApiKeyPromptOpen(false)}
        onConfirm={handleApiKey}
        title="Gemini API Key"
        label="Enter your Gemini API key (stored in session only):"
        
      />

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDeleteSession}
        title="DELETE SESSION"
        confirmText="DELETE"
      >
        <p className="font-pixel text-sm text-gray-700 mb-2">
          Are you sure you want to delete this session? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}