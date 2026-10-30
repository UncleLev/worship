---
implements: ADM-ACCESS@0.1.1
---

# Admin access — technical notes

## Overview
- `src/shared/lib/use-secret-pattern.ts` — press-length detection and pattern matching (ADM-ACCESS-R01)
- `src/widgets/song-list/ui/song-list.tsx`, `src/widgets/song-view/ui/song-number/song-number.tsx` — where the gesture is attached (ADM-ACCESS-001, ADM-ACCESS-005)
- `src/features/admin-auth/` — session check, sign-in form and gate around admin pages (ADM-ACCESS-R02, ADM-ACCESS-R03)

## Integrations
### Authentication service
- Email and password sign-in; the session is kept by the client library on the device (ADM-ACCESS-009)
- Database writes rely on policies set outside the repo; `supabase/migrations/20260320000000_create_songs.sql` defines only public read (ADM-ACCESS Q2)

## Known limitations
- **Task** — remove the console log of gesture progress (`src/shared/lib/use-secret-pattern.ts:40`). The pattern itself stays visible in the site code; protection comes from sign-in (ADM-ACCESS-R02)
