import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get unapplied insights
    const { data: insights } = await supabase
      .from('memory_insights')
      .select('*')
      .eq('user_id', user.id)
      .eq('applied', false)
      .gte('confidence', 0.7)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({ insights: insights || [] })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { insightIds, applyToMemory } = await request.json()

    if (applyToMemory) {
      // Get insights
      const { data: insights } = await supabase
        .from('memory_insights')
        .select('insight_text')
        .in('id', insightIds)

      if (insights && insights.length > 0) {
        // Get current memory
        const { data: profile } = await supabase
          .from('profiles')
          .select('global_memory')
          .eq('id', user.id)
          .single()

        // Append new insights to memory
        const newMemory = profile?.global_memory
          ? `${profile.global_memory}\n\nRecently learned:\n${insights.map(i => `- ${i.insight_text}`).join('\n')}`
          : `Recently learned:\n${insights.map(i => `- ${i.insight_text}`).join('\n')}`

        // Update memory
        await supabase
          .from('profiles')
          .update({
            global_memory: newMemory,
            memory_updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
      }
    }

    // Mark insights as applied
    await supabase
      .from('memory_insights')
      .update({ applied: true })
      .in('id', insightIds)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}