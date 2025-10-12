'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const onboardingSteps = [
  {
    title: 'Welcome to Klix!',
    description: 'Your intelligent AI companion that remembers your conversations.',
  },
  {
    title: 'Intelligent Memory',
    description: 'Klix learns from your chats to provide a personalized experience.',
  },
  {
    title: 'Seamless Conversations',
    description: 'Chat with Klix, and it will remember your preferences and style.',
  },
  {
    title: 'Get Started',
    description: 'Create an account or log in to start your journey with Klix.',
  },
]

export function WelcomeFlow() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const nextStep = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true')
    router.push('/login')
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-8 text-center">
        <h2 className="font-pixel text-2xl text-klix-orange mb-4">
          {onboardingSteps[step].title}
        </h2>
        <p className="text-gray-700 mb-8">{onboardingSteps[step].description}</p>

        <div className="flex justify-center gap-4 mb-8">
          <Button onClick={prevStep} disabled={step === 0}>
            &lt;
          </Button>
          <Button onClick={nextStep} disabled={step === onboardingSteps.length - 1}>
            &gt;
          </Button>
        </div>

        {step === onboardingSteps.length - 1 ? (
          <Button onClick={handleGetStarted} size="lg">
            Get Started
          </Button>
        ) : (
          <Button variant="secondary" onClick={handleGetStarted}>
            Skip
          </Button>
        )}
      </Card>
    </div>
  )
}
