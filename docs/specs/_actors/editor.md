---
id: ACT-EDITOR
title: Editor
summary: A signed-in person who adds, edits and deletes songs and publishes changes to the public site.
kind: role
---

# Editor

## Who
A person with an account in the authentication service. Any account that can sign in is an Editor; there are no other roles. Accounts are created only by the project owner in the authentication service. Where database writes are limited to editors is open: ADM-ACCESS Q2.

## Identified by
Email and password sign-in. The session stays on the device until sign-out — ADM-ACCESS-R02

## Can do
Everything a Visitor can, plus:
- List and find songs — ADM-EDIT-R01, ADM-EDIT-R02
- Add a song — ADM-EDIT-R03
- Edit a song with live preview — ADM-EDIT-R04, ADM-EDIT-R05
- Delete a song — ADM-EDIT-R07
- Publish changes to the public site — ADM-PUBLISH-R01
- Sign out — ADM-ACCESS-R03

## Cannot do
- Undo a deletion or see a history of changes — ADM-EDIT, Out of scope
- See who else is editing — ADM-EDIT, Out of scope

## Data rules that limit the Editor
- Song invariants ADM-SONG-I1…I5 — `admin/_domain.md`
