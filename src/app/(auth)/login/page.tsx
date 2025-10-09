import { AuthForm } from '@/components/auth/AuthForm'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/chat')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthForm />
    </div>
  )
}