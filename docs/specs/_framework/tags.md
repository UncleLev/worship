# Tags

Behavior index. A tag names a kind of behavior so people and AI can find every scenario that has it, across specs.

- A tag is put on a scenario, after its ID, status and type tags: `@ADM-EDIT-016 @proposed @happy @preview @narrow-screen`. A scenario may have none.
- The `tags` field in a spec header is the sorted list of all tags used on its scenarios. Nothing else goes there.
- Tags describe behavior, never technology: no database, library or storage names. Those belong in `tech.md`.
- A new tag is added to this table first.

| Tag | Meaning |
|---|---|
| chords | Showing, hiding or reading chords |
| confirmation | An action that runs only after the user confirms |
| deletion | Removing data |
| device-memory | Remembers a choice or state on this device between visits |
| double-submit | Repeated taps on the same action |
| hidden-entry | The secret gesture that leads to the admin area |
| narrow-screen | Behavior specific to narrow (phone) screens |
| network-failure | Losing the connection in the middle of an action |
| offline | Works without a network connection |
| preview | Seeing the result before saving |
| progress | Showing that a long action is still running |
| random-pick | Showing songs chosen at random |
| search | Finding songs by number or part of the title |
| sharing | Sending a song link to another app |
| sign-in | Signing in, signing out, sessions |
| song-number | How song numbers are shown, searched or reassigned |
| transposition | Changing the key of chords |
| unsaved-changes | Protecting changes that are not saved yet |
| validation | Rejecting input that breaks a rule |
