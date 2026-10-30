---
implements: CAT-SEARCH@0.2.0
---

# Song list and search — technical notes

## Overview
- `src/entities/song/model/use-song-list.ts` — loads the list and caches it
- `src/features/search-songs/model/use-search-songs.ts` — number, text and random filtering
- `src/shared/lib/use-scroll-restore.ts` — scroll position memory

## State
- The list is cached in local storage under `songs_cache_<build id>`; caches of other build ids are deleted on load (CAT-SEARCH-003, CAT-SEARCH-004)
- The cached list is shown first, then replaced by the database response (CAT-SEARCH-003)

## Decisions
- Filtering runs in the browser over the full list; the list is small

## Known limitations
- **Bug** — typing "(" or "[" in the search field breaks the page: text search builds a regular expression from raw input (`src/features/search-songs/model/use-search-songs.ts:45`). Violates CAT-SEARCH-R04
- **Bug** — the random pick never finishes when fewer than 3 songs exist (same file, lines 16–19). Expected: CAT-SEARCH-017
- **Task** — remove the unused `favorite` filter (`src/features/filter-songs/model/types.ts:3`)
