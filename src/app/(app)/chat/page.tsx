import { ChatInterface } from '@/coomponents/chat/ChatInterface'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function ChatPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('global_memory')
    .eq('id', user.id)
    .single()

  if (!profile?.global_memory) {
    redirect('/onboarding')
  }

  return <ChatInterface />
}