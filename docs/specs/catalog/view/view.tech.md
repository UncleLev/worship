---
implements: CAT-VIEW@0.4.0
---

# Song page — technical notes

## Overview
- `src/app/song/[id]/page.tsx` — static page per song, data fetched at build time
- `src/entities/song/lib/parser.ts` — turns stored text into sections and lines
- `src/shared/lib/chord.ts` — key list and transposition
- `src/widgets/song-view/ui/song-view.tsx` — chord toggle and key state

## Data
- A song is stored as title, optional key and lyrics text; the parser builds `title + " !! " + key` followed by the lyrics (CAT-VIEW-010)
- A line starting with `@` begins a section; its text up to the line break is the section name (CAT-VIEW-001)
- A line is a chord line when its first space-separated word matches the chord pattern; the first one found sets the key if none is saved (CAT-VIEW-010)
- Chord visibility is stored in local storage under `hide_chords`; absence means hidden (CAT-VIEW-004, CAT-VIEW-006)

## Decisions
- The host serves `404.html` (`src/app/not-found.tsx`) for every missing address. The page tells the cases apart in the browser: a song address whose song exists in the database is "not yet published" (CAT-VIEW-015, ADM-EDIT-027); one whose song does not exist shows the song-not-found messages (CAT-VIEW-002); any other address is "no such page" (CAT-VIEW-016)
- Pages are generated at build time, so edits appear only after a rebuild (see ADM-PUBLISH)

## Known limitations
- A line whose first word contains a capital A–H is read as chords; Latin-script lyrics are out of scope (CAT-VIEW)
- **Bug** — the key from the first chord ignores flats: first chord "Db" gives key "D" (`src/entities/song/lib/parser.ts:66-71`). Violates CAT-VIEW-R04
- **Bug** — flats are not converted to sharps in output, and "Gb" transposed from C to C# gives "G#b" (`src/shared/lib/chord.ts`). Violates CAT-VIEW Out of scope "flats are converted to sharps"
- **Data** — 8 chord lines use Cyrillic А/В/С/Е/Н instead of Latin letters, and 3 have typos (`D(F#)`, `AmH/G`, `C%m`) in `supabase/seed.sql`; fix them in the admin editor
- **Data** — "Дім Отця" is saved in C but typed in Am, so it is shown in Cm (CAT-VIEW-014); save its key as A
