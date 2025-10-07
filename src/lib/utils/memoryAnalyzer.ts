interface ConversationContext {
  messages: Array<{ role: string; content: string }>
  currentMemory: string
}

interface MemoryInsight {
  type: 'preference' | 'style' | 'interest' | 'behavior'
  text: string
  confidence: number
}

export class MemoryAnalyzer {
  // Analyze conversation for memory insights
  static analyzeConversation(context: ConversationContext): MemoryInsight[] {
    const insights: MemoryInsight[] = []
    const recentMessages = context.messages.slice(-10)
    
    // Extract patterns from user messages
    const userMessages = recentMessages
      .filter(m => m.role === 'user')
      .map(m => m.content.toLowerCase())
    
    // Analyze preferences
    const preferencePatterns = [
      { pattern: /i (prefer|like|love|enjoy|want)/i, type: 'preference' as const },
      { pattern: /my favorite/i, type: 'preference' as const },
      { pattern: /i always/i, type: 'behavior' as const },
      { pattern: /i usually/i, type: 'behavior' as const },
    ]
    
    for (const msg of userMessages) {
      for (const { pattern, type } of preferencePatterns) {
        if (pattern.test(msg)) {
          // Extract the preference statement
          const match = msg.match(pattern)
          if (match) {
            const startIdx = match.index! + match[0].length
            const statement = msg.substring(startIdx).split(/[.!?]/)[0].trim()
            if (statement.length > 5 && statement.length < 200) {
              insights.push({
                type,
                text: statement,
                confidence: 0.7
              })
            }
          }
        }
      }
    }
    
    // Analyze communication style
    const avgMessageLength = userMessages.reduce((sum, m) => sum + m.length, 0) / userMessages.length
    if (avgMessageLength < 50) {
      insights.push({
        type: 'style',
        text: 'Prefers brief, concise communication',
        confidence: 0.8
      })
    } else if (avgMessageLength > 200) {
      insights.push({
        type: 'style',
        text: 'Prefers detailed, comprehensive responses',
        confidence: 0.8
      })
    }
    
    // Detect repeated topics (interests)
    const topics = this.extractTopics(userMessages)
    for (const [topic, count] of Object.entries(topics)) {
      if (count >= 3) {
        insights.push({
          type: 'interest',
          text: `Shows strong interest in ${topic}`,
          confidence: Math.min(0.9, 0.5 + count * 0.1)
        })
      }
    }
    
    return insights
  }
  
  // Extract topics from messages
  private static extractTopics(messages: string[]): Record<string, number> {
    const topics: Record<string, number> = {}
    const topicKeywords = [
      'programming', 'coding', 'python', 'javascript', 'react', 'design',
      'art', 'music', 'gaming', 'sports', 'business', 'science', 'math',
      'history', 'writing', 'cooking', 'travel', 'health', 'fitness'
    ]
    
    for (const msg of messages) {
      for (const keyword of topicKeywords) {
        if (msg.includes(keyword)) {
          topics[keyword] = (topics[keyword] || 0) + 1
        }
      }
    }
    
    return topics
  }
  
  // Build enhanced memory prompt
  static buildMemoryPrompt(
    globalMemory: string,
    sessionMemory: string | null,
    recentInsights: MemoryInsight[]
  ): string {
    const memory = sessionMemory || globalMemory || ''
    
    let prompt = `You are Klix, an intelligent AI companion with deep understanding of the user.

USER MEMORY:
${memory}
`
    
    if (recentInsights.length > 0) {
      prompt += `\nRECENT INSIGHTS (learned from conversations):
${recentInsights.map(i => `- ${i.text} (${Math.round(i.confidence * 100)}% confidence)`).join('\n')}
`
    }
    
    prompt += `
INSTRUCTIONS:
1. Use the memory and insights to provide personalized responses
2. Match the user's communication style and preferences
3. Reference past conversations naturally when relevant
4. Adapt your tone and depth based on learned preferences
5. Be proactive in recognizing patterns and user needs
6. After significant conversations, suggest memory updates if you learn something important

Remember: You're not just answering questions, you're being a thoughtful companion who knows and understands this specific person.`
    
    return prompt
  }
  
  // Suggest memory update based on insights
  static shouldSuggestMemoryUpdate(
    messageCount: number,
    newInsights: MemoryInsight[]
  ): boolean {
    // Suggest update every 15 messages or if high-confidence insights found
    const hasHighConfidenceInsight = newInsights.some(i => i.confidence > 0.8)
    return messageCount % 15 === 0 || hasHighConfidenceInsight
  }
}