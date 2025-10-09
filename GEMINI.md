# Project: Klix - Intelligent AI Companion

## Project Overview

This is a production-ready AI chat application built with Next.js, Supabase, and Tailwind CSS. It features an intelligent memory system that learns and adapts to each user. The application provides a secure and real-time chat experience.

**Key Technologies:**

*   **Frontend:** Next.js 14 (App Router) + React 18
*   **Styling:** Tailwind CSS with a custom pixel art theme
*   **Backend:** Next.js API Routes
*   **Database:** PostgreSQL via Supabase (with Row Level Security)
*   **Authentication:** Supabase Auth (JWT)
*   **AI:** Google Gemini Pro API
*   **Deployment:** Vercel (frontend) + Supabase (backend)

**Architecture:**

The application follows a standard Next.js project structure.

*   `src/app`: Contains the main application logic, including pages, API routes, and global styles (`globals.css`).
*   `src/components`: Contains reusable React components.
*   `src/lib`: Contains utility functions and Supabase client configurations.
*   `src/types`: Contains TypeScript type definitions.
*   `supabase`: Contains database migration and seed files.

## Building and Running

**Prerequisites:**

*   Node.js 18+ and npm
*   Supabase account (free tier)
*   Gemini API key (free tier available)

**Local Development:**

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set up environment variables:**
    Create a `.env.local` file by copying the `.env.example` file and filling in the required Supabase and Gemini API keys.
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

**Scripts:**

*   `npm run dev`: Starts the development server.
*   `npm run build`: Creates a production build of the application.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the codebase for errors.

## Development Conventions

*   **Coding Style:** The project uses TypeScript and follows standard React and Next.js conventions.
*   **Styling:** Tailwind CSS is used for styling. Global styles are located in `src/app/globals.css`.
*   **Authentication:** User authentication is handled by Supabase Auth.
*   **Database:** Supabase is used as the database, with Row Level Security enabled for data protection.
*   **API:** The backend is built with Next.js API Routes.
*   **AI:** The AI functionality is powered by the Google Gemini Pro API.

## File and Directory Breakdown

This section provides a more detailed look at the project's structure and the purpose of key files.

### Root Directory

-   `middleware.ts`: Intercepts all incoming requests to manage and refresh user sessions using Supabase Auth. This is crucial for maintaining a persistent login state.
-   `next.config.js`: The primary configuration for Next.js.
-   `postcss.config.js`: Explicit configuration for PostCSS, ensuring Tailwind CSS and Autoprefixer are processed correctly.
-   `tailwind.config.ts`: Configures the Tailwind CSS framework. It defines the custom pixel-art theme, including fonts (`"Press Start 2P"`), colors (`klix-orange`), and animations.
-   `tsconfig.json`: TypeScript configuration, notable for setting up the `@/*` path alias for cleaner imports from the `src` directory.

### `src/app` - Pages & API Routes

This directory uses the Next.js App Router paradigm.

-   `globals.css`: Contains global styles and Tailwind CSS directives.
-   `page.tsx`: The main entry point. It checks for an active user session and redirects to either `/login` or `/chat`, acting as a routing guard.
-   `layout.tsx`: The root layout for the entire application. It sets up the HTML structure, applies the global font using `next/font/google`, and wraps the children in an `<ErrorBoundary />`.
-   **`(auth)/login/page.tsx`**: The user login page. It renders the `AuthForm` component and redirects to `/chat` if a user is already logged in. The `(auth)` folder is a route group, meaning it doesn't appear in the URL.
-   **`(app)/chat/page.tsx`**: The main chat interface page. It's a server component that protects the route, ensuring only logged-in and onboarded users can access it. It renders the client-side `ChatInterface` component.
-   **`(app)/onboarding/page.tsx`**: A page that guides new users through a series of questions to establish the AI's initial "global memory." It renders the `OnboardingFlow` component.
-   **`api/`**: Contains all backend API endpoints.
    -   `api/auth/` Handles user registration and login.
    -   `api/chat/route.ts`: The core backend for the chat. It receives user messages, builds context from past messages, analyzes the conversation for insights using `MemoryAnalyzer`, calls the Gemini API for a response, and saves both user and AI messages to the database.
    -   `api/memory/`: Endpoints for updating the user's global and session-specific memories.
    -   `api/sessions/`: Endpoints for creating, retrieving, and deleting chat sessions.

### `src/components` - Reusable Components

-   `ErrorBoundary.tsx`: A client component that catches JavaScript errors in its child component tree and displays a fallback UI.
-   `auth/AuthForm.tsx`: A client component that handles both user registration and login with email and password. It communicates with the Supabase client and the internal `/api/auth` routes.
-   `chat/ChatInterface.tsx`: A large client component that orchestrates the entire chat UI. It manages sessions, messages, real-time updates via Supabase subscriptions, and user interactions like sending messages and logging out.
-   `onboarding/OnboardingFlow.tsx`: A multi-step form that collects user preferences to build their initial global memory profile.
-   `ui/`: A collection of generic, styled components that form the design system (e.g., `Button.tsx`, `Card.tsx`, `Input.tsx`). The `Button.tsx` is a good example of a component with variants (`primary`, `secondary`) and sizes, built using `clsx` for conditional class names.

### `src/lib` - Utilities & Libraries

-   `hooks/`: Contains custom React hooks. `useChat.ts` provides state management for sending messages and handling loading/error states, but the `ChatInterface` component contains the primary logic.
-   `supabase/`: Contains Supabase client initializations.
    -   `client.ts`: Creates a Supabase client for use in the browser (client-side components).
    -   `server.ts`: Creates a Supabase client for use on the server (Server Components, API routes), handling cookie-based authentication.
    -   `middleware.ts`: Logic for the root `middleware.ts` file to manage sessions.
-   `utils/`: Contains helper modules.
    -   `cn.ts`: A utility for merging Tailwind CSS classes, essential for building reusable and customizable components.
    -   `memoryAnalyzer.ts`: A key class that contains the "intelligence" logic. It analyzes conversations to extract user preferences and communication style, builds the prompt for the Gemini API, and decides when to suggest memory updates.

### `supabase/` - Database

-   `migrations/`: Contains SQL files that define the database schema (tables like `profiles`, `sessions`, `messages`).
-   `seed.sql`: A script to populate the database with initial data for development purposes.
