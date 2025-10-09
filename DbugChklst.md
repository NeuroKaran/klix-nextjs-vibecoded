---
description: while debugging or checking for errors
alwaysApply: false
---
// Klix Debug Checklist (Always reference Aent.md for full context)
//
// Use this checklist when debugging or verifying fixes in the Klix project.
// Strictly follow each step; do not skip or assume undocumented behavior.
//
// 1. Identify the error or bug
//    - Reproduce the issue locally (describe exact steps)
//    - Note error messages, stack traces, and affected files/routes
//
// 2. Locate affected files
//    - Read the relevant file(s) in full (cite exact paths)
//    - Cross-check with `GEMINI.md` for architecture and data flow
//
// 3. Verify environment and secrets
//    - Ensure no credentials or API keys are hardcoded
//    - Check `.env.local` and `vercel.json` for required keys
//
// 4. Database checks (if relevant)
//    - Confirm table/column names match `supabase/migrations/*`
//    - Check RLS policies and authenticated context
//
// 5. API route validation
//    - Ensure correct HTTP status codes and error handling
//    - Validate all inputs and outputs
//
// 6. Type and schema consistency
//    - Check TypeScript types in `src/types/index.ts`
//    - Update types if data shape has changed
//
// 7. Lint and type checks
//    - Run `npm run lint` and fix all warnings/errors
//    - Run `tsc` to check for type errors
//
// 8. Regression guardrails
//    - Test all critical flows:
//      - Auth (`/login`, `/chat`, `/onboarding`)
//      - Realtime updates (sessions/messages)
//      - Memory update suggestion path
//
// 9. Final verification
//    - Start dev server: `npm run dev`
//    - Use MCP and Chrome DevTools:
//      - Console: no errors/warnings
//      - Network: API routes return expected payloads/statuses
//      - UI: flows work as expected, no regressions
//
// 10. If unresolved after 2 attempts:
//     - Escalate: file a concise note in `PROBLEM.md` with steps/logs
//     - Restart debugging using `GEMINI.md` and `Aent.md`
//
// Reference: See `Aent.md` for the canonical agentic pipeline and escalation criteria.
