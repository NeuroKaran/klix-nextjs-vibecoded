import { createServerSupabaseClient } from '@/lib/supabase/server'
import { MemoryAnalyzer } from '@/lib/utils/memoryAnalyzer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, message, apiKey } = await request.json()

    if (!sessionId || !message || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify session ownership
    const { data: session } = await supabase
      .from('sessions')
      .select('*, messages(*)')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Get user profile for memory
    const { data: profile } = await supabase
      .from('profiles')
      .select('global_memory')
      .eq('id', user.id)
      .single()

    // Save user message
    const { data: userMessage } = await supabase
      .from('messages')
      .insert({
        session_id: sessionId,
        role: 'user',
        content: message
      })
      .select()
      .single()

    // Build context
    const conversationHistory = session.messages || []
    const context = conversationHistory.slice(-10).map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }))

    // Analyze for insights
    const insights = MemoryAnalyzer.analyzeConversation({
      messages: [...conversationHistory, { role: 'user', content: message }],
      currentMemory: profile?.global_memory || ''
    })

    // Save insights if confidence is high
    if (insights.length > 0) {
      const highConfidenceInsights = insights.filter(i => i.confidence > 0.7)
      if (highConfidenceInsights.length > 0) {
        await supabase.from('memory_insights').insert(
          highConfidenceInsights.map(i => ({
            user_id: user.id,
            insight_type: i.type,
            insight_text: i.text,
            confidence: i.confidence,
            source_session_id: sessionId
          }))
        )
      }
    }

    // Build memory prompt
    const memoryPrompt = MemoryAnalyzer.buildMemoryPrompt(
      profile?.global_memory || '',
      session.session_memory,
      insights
    )

    // Call Gemini API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: memoryPrompt + '\n\nUser: ' + message }]
            },
            ...context
          ],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 2048,
            topP: 0.95,
            topK: 40
          }
        })
      }
    )

    if (!geminiRes.ok) {
      const errorData = await geminiRes.json()
      throw new Error(errorData.error?.message || 'Gemini API error')
    }

    const geminiData = await geminiRes.json()
    const aiResponse = geminiData.candidates[0].content.parts[0].text

    // Save AI message
    const { data: aiMessage } = await supabase
      .from('messages')
      .insert({
        session_id: sessionId,
        role: 'assistant',
        content: aiResponse
      })
      .select()
      .single()

    // Check if should suggest memory update
    const messageCount = conversationHistory.length + 2
    const shouldSuggest = MemoryAnalyzer.shouldSuggestMemoryUpdate(
      messageCount,
      insights
    )

    return NextResponse.json({
      userMessage,
      aiMessage,
      suggestMemoryUpdate: shouldSuggest,
      insights: insights.filter(i => i.confidence > 0.7)
    })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process message' },
      { status: 500 }
    )
  }
}