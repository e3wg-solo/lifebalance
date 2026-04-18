<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Supabase

Project ref: `bsstoxcggkdzvgleqmdv` (lfblnc, West EU Ireland)

### Email confirmation (dev mode)

For local development and testing, **disable** "Confirm email" in Supabase Auth:
1. Go to [Supabase Dashboard → Authentication → Providers → Email](https://supabase.com/dashboard/project/bsstoxcggkdzvgleqmdv/auth/providers)
2. Turn OFF **"Confirm email"**

Without this, `signUp` does not immediately create a session — the user has to click a link in their inbox before being redirected to `/onboarding`. The register page gracefully handles both cases (auto-redirect vs "check email" screen), but for smooth dev iteration disable confirmation.

### Schema

Tables and RLS are defined in `supabase/migrations/20260418000000_init.sql`.
Apply with: `npx supabase db push`

To regenerate TypeScript types after schema changes:
```
npx supabase gen types typescript --project-id bsstoxcggkdzvgleqmdv > src/lib/database.types.ts
```

### Auth flow

- Auth state managed by `SupabaseAuthProvider` (wraps the whole app in `layout.tsx`)
- On `SIGNED_IN`: `hydrateFromSupabase(userId)` fetches profile, cycles, pulses, checkins into Zustand
- On `SIGNED_OUT`: `resetStore()` clears all in-memory state
- `isHydrating` flag in Zustand prevents route guards from flashing before data loads

### Data strategy

Online-only — Zustand is in-memory only (no `persist`). All mutations write to Supabase immediately with optimistic local updates and `console.error` rollback on failure.
