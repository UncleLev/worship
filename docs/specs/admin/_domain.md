---
domain: admin
prefix: ADM
title: Song administration
summary: Hidden area where an authorised editor signs in, manages songs and publishes changes.
---

# Song administration

## Responsibility
Lets a single signed-in editor add, change and delete songs and publish the result to the public site.

## Boundaries
**Owns:** admin sign-in, hidden entry gesture, admin song list, song editor with preview, song deletion, renumbering, publish trigger.

**Does not own:**
- How a song is displayed to visitors → `catalog`

## Relations
- **catalog** — the editor reuses the catalog song view as a live preview; published data feeds the catalog.

## Entities

### Song
Owned by this domain: only admin creates, changes and deletes songs. `catalog` reads them.

| Field | Code | Meaning |
|---|---|---|
| Title | `name` | Name shown everywhere |
| Key | `key` | Key the song is shown in by default; chords in the lyrics are shifted to it (CAT-VIEW-014); optional |
| Lyrics | `lyrics` | Text in the lyrics format |
| Song number | `sort_order` | Position in title order, shown as "№N" |
| Id | `id` | Internal; used in links, never shown |

| ID | Invariant | Holds today? |
|---|---|---|
| ADM-SONG-I1 | Title is not blank and has no surrounding spaces | Only when adding; editing keeps spaces (`edit/edit.tech.md`) |
| ADM-SONG-I2 | No two songs have titles equal ignoring letter case | Only when adding, and not for titles with "%" or "_" (`edit/edit.tech.md`) |
| ADM-SONG-I3 | Key is empty or one of C, C#, D, D#, E, F, F#, G, G#, A, A#, B | Yes |
| ADM-SONG-I4 | Lyrics are not blank | Yes |
| ADM-SONG-I5 | Song numbers are 1..N without gaps, in title order | Only after adding or deleting, and not atomically (`edit/edit.tech.md`) |

## Glossary
| Term | Code | Meaning | Do not confuse / do not use |
|---|---|---|---|
| Editor | signed-in user | See `../_actors/editor.md` | "admin user" |
| Admin area | `/manage` | All pages that require sign-in: the admin song list, the add form and the editor | "dashboard", "back office" |
| Admin song list | `AdminSongList` | The signed-in editor's first page: searchable, paged list of songs with the publish and sign-out buttons | The public song list in catalog |
| Lyrics format | `lyrics` | Free text where a line starting with `@` begins a section | |
| Renumbering | `reorderSongsAlphabetically` | Reassigning song numbers 1..N by title order | |
| Publish | `trigger-deploy` | Rebuilding the public site so it shows the current data | "deploy" in code and UI is the same thing |
| Secret gesture | `useSecretPattern` | Sequence long, short, short, short, long presses on a heading | |
