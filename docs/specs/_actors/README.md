# Actors

One file per role or external system. A spec names actors by title and does not redefine them.

| ID | Title | Kind | File |
|---|---|---|---|
| ACT-VISITOR | Visitor | role | `visitor.md` |
| ACT-EDITOR | Editor | role | `editor.md` |
| ACT-SONGS-DB | Songs database | system | `songs-database.md` |
| ACT-AUTH | Authentication service | system | `auth-service.md` |
| ACT-PUBLISH | Publish service | system | `publish-service.md` |
| ACT-SHARE-SHEET | Device share sheet | system | `share-sheet.md` |

"Can do" and "Cannot do" reference rules (`<SPEC-ID>-RNN`); "Used by" references specs. Behavior itself is defined only in scenarios.
