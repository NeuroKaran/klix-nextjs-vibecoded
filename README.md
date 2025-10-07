# Klix - Intelligent AI Companion with Adaptive Memory

Production-ready AI chat application built with Next.js, Supabase, and Tailwind CSS featuring intelligent memory systems that learn and adapt to each user.

## Features

### Core Functionality
- **JWT Authentication**: Secure user authentication via Supabase Auth
- **Personality Onboarding**: 5-question assessment to build initial user profile
- **Dual Memory System**: 
  - Global memory: User's default personality/preferences
  - Session memory: Customizable per-conversation context
- **Intelligent Memory Analysis**: Auto-detects patterns and updates memory
- **Session Management**: Create, switch, and delete chat sessions
- **Hold-to-Delete**: 2-second hold gesture to delete sessions (mobile-friendly)
- **Real-time Updates**: Instant message synchronization via Supabase Realtime
- **Memory Insights**: AI analyzes conversations to suggest memory updates

### Technical Features
- **Server-Side Rendering**: Next.js App Router for optimal performance
- **Row Level Security**: Database-level security with Supabase RLS
- **Optimistic Updates**: Instant UI feedback while syncing to database
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Type Safety**: Full TypeScript coverage
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React 18
- **Styling**: Tailwind CSS with custom pixel art theme
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Supabase (with RLS)
- **Auth**: Supabase Auth (JWT)
- **AI**: Google Gemini Pro API
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier)
- Gemini API key (free tier available)

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd klix-nextjs