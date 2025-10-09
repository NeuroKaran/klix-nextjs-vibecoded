'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
          <h1 className="text-2xl font-pixel mb-4">Something went wrong.</h1>
          <p className="text-center mb-4">We&apos;ve logged the error and will look into it. Please refresh the page to continue.</p>
          <button 
            className="font-pixel bg-klix-orange text-white px-4 py-2 rounded-lg border-2 border-black"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
