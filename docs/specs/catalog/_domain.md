---
domain: catalog
prefix: CAT
title: Song catalog
summary: Public, read-only browsing of the worship songbook, including chord display and transposition.
---

# Song catalog

## Responsibility
Lets any visitor find a song and read its lyrics, optionally with chords in a chosen key. No sign-in is needed.

## Boundaries
**Owns:** song list, search, random pick, song page, chord visibility, transposition, sharing.

**Does not own:**
- Creating, changing or deleting songs → `admin`
- Publishing changes to the live site → `admin`

## Relations
- **admin** — admin changes the songs that catalog displays; catalog only sees them after a publish.

## Glossary
| Term | Code | Meaning | Do not confuse / do not use |
|---|---|---|---|
| Song | `songs` row | A titled piece with sections and an optional key | "track", "hymn" |
| Song number | `sort_order` | Position of the song in the alphabetical order of titles, starting at 1. Shown as "№N" | Not the internal `id` |
| Key | `key` | The key a song is shown in by default. When saved, chords typed in another key are shifted to it (CAT-VIEW-014) | "tonality" in code and UI is the same thing |
| Selected key | `selectedKey` | The key the visitor transposes chords to | |
| Section | `SongBlockType` | A named part of a song (Verse, Chorus, Bridge) | "block" in code |
| Chord line | `BlockType.chords` | A line recognised as chords; all other lines are lyric lines | |
