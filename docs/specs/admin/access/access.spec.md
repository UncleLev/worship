---
id: ADM-ACCESS
title: Admin access
summary: Hidden entry to the admin area through a press gesture, protected by email and password sign-in.
domain: admin
tags: [device-memory, hidden-entry, sign-in]
version: 0.1.1
status: draft
related: [ADM-EDIT, CAT-VIEW]
---

# Admin access

## Purpose
Only the editor can change songs. The entry point is invisible to visitors, and every admin page requires sign-in.

## Scope
**In scope:**
- Secret gesture, sign-in, sign-out, redirect after sign-in

**Out of scope:**
- Creating accounts, password reset, multiple roles

## Actors
Actors are defined in `../../_actors/`.
- **Visitor** (`_actors/visitor.md`) — may discover the gesture but cannot pass sign-in
- **Editor** (`_actors/editor.md`) — signs in and out
- **Authentication service** (`_actors/auth-service.md`) — verifies credentials and keeps the session

## Behavior

What the feature does, one line per rule. The rules below are the requirements; scenarios under each rule prove them.

| Rule | Requirement | Invariants | Scenarios |
|---|---|---|---|
| ADM-ACCESS-R01 | The gesture long, short, short, short, long on the home page title opens the admin area | — | 001–005 |
| ADM-ACCESS-R02 | Every admin page requires a signed-in editor | — | 006–009 |
| ADM-ACCESS-R03 | The editor can sign out | — | 010 |

## Scenarios

UI text is quoted exactly as the app shows it.

```gherkin
Feature: Admin access

  @ADM-ACCESS-R01
  Rule: The gesture long, short, short, short, long on the home page title opens the admin area

    @ADM-ACCESS-001 @proposed @happy @hidden-entry
    Scenario: Correct gesture
      Given the visitor is on the home page
      When the visitor presses the title "Worship" long, short, short, short, long
      Then the admin area opens

    @ADM-ACCESS-002 @proposed @edge @hidden-entry
    Scenario Outline: Press length
      Given the visitor presses the title
      When the press lasts <ms> milliseconds
      Then it counts as a <kind> press

      Examples:
        | ms  | kind  |
        | 399 | short |
        | 400 | long  |

    @ADM-ACCESS-003 @proposed @edge @hidden-entry
    Scenario: Wrong sequence
      Given the visitor is on the home page
      When the visitor presses the title short, short, short, short, short
      Then the admin area does not open

    @ADM-ACCESS-004 @proposed @edge @hidden-entry
    Scenario: Pause too long
      Given the visitor made the first 3 presses of the gesture correctly
      When 3 seconds pass without a press
      And the visitor makes the last 2 presses
      Then the admin area does not open

    @ADM-ACCESS-005 @proposed @happy @hidden-entry
    Scenario: Gesture on a song page
      Given the visitor is on the song page of a song
      When the visitor makes the gesture on the song number "№N"
      Then the admin area opens
      And after sign-in the form "Редагування" of that song opens

  @ADM-ACCESS-R02
  Rule: Every admin page requires a signed-in editor

    @ADM-ACCESS-006 @proposed @happy @sign-in
    Scenario: Not signed in
      Given the visitor has no session
      When the visitor opens any admin page
      Then the form "Увійти" with fields "Email" and "Пароль" is shown instead of the page

    @ADM-ACCESS-007 @proposed @happy @sign-in
    Scenario: Valid credentials
      Given the form "Увійти" is shown
      When the editor enters a registered email and the correct password and taps "Увійти"
      Then the requested admin page is shown

    @ADM-ACCESS-008 @proposed @error @sign-in
    Scenario: Invalid credentials
      Given the form "Увійти" is shown
      When the editor enters a wrong password and taps "Увійти"
      Then the message from the authentication service is shown under the fields
      And the form stays open

    @ADM-ACCESS-009 @proposed @happy @sign-in @device-memory
    Scenario: Existing session
      Given the editor signed in earlier on this device and the session is still valid
      When the editor opens an admin page
      Then the page is shown without the form "Увійти"

  @ADM-ACCESS-R03
  Rule: The editor can sign out

    @ADM-ACCESS-010 @proposed @happy @sign-in
    Scenario: Signing out
      Given the editor is on the admin song list
      When the editor taps the button "Вийти"
      Then the session ends
      And the home page opens
```

## Open questions
- **Q2** Where are database writes limited to signed-in editors? `supabase/migrations/20260320000000_create_songs.sql` has only a public read policy, so write policies are set outside the repo. Record them in `_actors/auth-service.md`. Missing fact — the owner of the Supabase project knows.
