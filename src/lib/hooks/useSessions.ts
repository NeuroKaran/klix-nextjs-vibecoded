'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@/types'

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSessions()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions'
        },
        () => {
          fetchSessions()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchSessions, supabase])

  const createSession = async (title: string = 'New Chat') => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        title,
      })
      .select()
      .single()

    if (!error && data) {
      setSessions([data, ...sessions])
      return data
    }
  }

  const deleteSession = async (id: string) => {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id)

    if (!error) {
      setSessions(sessions.filter(s => s.id !== id))
    }
  }

  const updateSessionMemory = async (id: string, sessionMemory: string) => {
    const { error } = await supabase
      .from('sessions')
      .update({ session_memory: sessionMemory })
      .eq('id', id)

    if (!error) {
      setSessions(sessions.map(s => 
        s.id === id ? { ...s, session_memory: sessionMemory } : s
      ))
    }
  }

  return {
    sessions,
    loading,
    error,
    createSession,
    deleteSession,
    updateSessionMemory,
    refreshSessions: fetchSessions,
  }
}