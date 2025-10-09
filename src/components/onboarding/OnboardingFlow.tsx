'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const questions = [
  "What's your professional role or main interest?",
  "How would you describe your communication style? (formal, casual, technical, etc.)",
  "What type of humor do you appreciate? (dry, witty, sarcastic, none, etc.)",
  "What's your preferred response length? (concise, detailed, balanced)",
  "Any specific topics or areas you're particularly interested in?"
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''))
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const memory = answers
        .map((ans, idx) => `${questions[idx]}: ${ans}`)
        .join('\n\n')

      const res = await fetch('/api/memory/global', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ globalMemory: memory })
      })

      if (!res.ok) throw new Error('Failed to save memory')

      router.push('/chat')
    } catch (err) {
      alert('Error saving memory. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl w-full p-10">
      <h2 className="font-pixel text-xl text-klix-orange text-center mb-6">
        ◈ LET&apos;S GET TO KNOW YOU ◈
      </h2>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200 border-2 border-gray-900 rounded-md mb-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-klix-orange to-klix-orange-light transition-all duration-300"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>
      <p className="font-pixel text-[9px] text-gray-600 text-center mb-8">
        Question {step + 1} of {questions.length}
      </p>

      {/* Question */}
      <div className="mb-8">
        <label className="font-pixel text-[10px] text-gray-900 block mb-4 leading-relaxed">
          {questions[step]}
        </label>
        <textarea
          value={answers[step]}
          onChange={(e) => {
            const newAnswers = [...answers]
            newAnswers[step] = e.target.value
            setAnswers(newAnswers)
          }}
          placeholder="Your answer..."
          className="w-full min-h-[140px] px-4 py-3 font-pixel text-[9px] bg-white border-[3px] border-gray-900 rounded-md focus:outline-none focus:border-klix-orange focus:shadow-[0_0_0_3px_rgba(255,140,66,0.2)] transition-all placeholder:text-gray-400 resize-vertical"
          autoFocus
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={handleBack} disabled={loading}>
            ← BACK
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!answers[step]?.trim() || loading}
        >
          {loading ? 'SAVING...' : step < questions.length - 1 ? 'NEXT →' : 'FINISH ✓'}
        </Button>
      </div>
    </Card>
  )
}