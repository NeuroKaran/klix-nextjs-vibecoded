export interface User {
  id: string
  name: string
  global_memory: string
  memory_updated_at: string
  created_at: string
}

export interface Session {
  id: string
  user_id: string
  title: string
  session_memory: string | null
  created_at: string
  updated_at: string
  messages?: Message[]
}

export interface Message {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface MemoryInsight {
  id: string
  user_id: string
  insight_type: 'preference' | 'style' | 'interest' | 'behavior'
  insight_text: string
  confidence: number
  source_session_id: string | null
  created_at: string
  applied: boolean
}

export interface OnboardingAnswer {
  question: string
  answer: string
}