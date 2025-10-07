import { OnboardingFlow } from '@/coomponents/onboarding/OnboardingFlow'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function OnboardingPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user already has global memory
  const { data: profile } = await supabase
    .from('profiles')
    .select('global_memory')
    .eq('id', user.id)
    .single()

  if (profile?.global_memory) {
    redirect('/chat')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <OnboardingFlow />
    </div>
  )
}