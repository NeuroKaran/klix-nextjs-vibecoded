import { Message } from '@/types'

export class ContextBuilder {
  // Build conversation context for AI
  static buildContext(
    messages: Message[],
    maxMessages: number = 10
  ): Array<{ role: 'user' | 'assistant'; content: string }> {
    return messages
      .slice(-maxMessages)
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
  }
  
  // Format relative time
  static formatRelativeTime(timestamp: string): string {
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now.getTime() - then.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffSecs < 60) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }
  
  // Sanitize input
  static sanitizeInput(input: string, maxLength: number = 2000): string {
    return input.trim().slice(0, maxLength)
  }
  
  // Generate session title from first message
  static generateTitle(message: string): string {
    const cleaned = message.trim()
    if (cleaned.length <= 30) return cleaned
    return cleaned.substring(0, 30) + '...'
  }
}