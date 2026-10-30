---
id: CAT-VIEW
title: Song page
summary: Shows one song's sections, with chords hidden by default, key selection with transposition, and sharing.
domain: catalog
tags: [chords, device-memory, sharing, song-number, transposition]
version: 0.4.0
status: draft
related: [CAT-SEARCH, ADM-EDIT]
---

# Song page

## Purpose
A visitor reads the lyrics of a song during worship. A visitor who plays an instrument can reveal the chords and play in a more comfortable key.

## Scope
**In scope:**
- Song header, sections, chord visibility, key selection and transposition, sharing, unknown song

**Out of scope:**
- Editing (see ADM-EDIT)
- Flat notation in output (flats are converted to sharps)
- Lyrics in Latin script: a line whose first word contains a capital A–H may be read as chords

## Actors
Actors are defined in `../../_actors/`.
- **Visitor** (`_actors/visitor.md`) — reads the song, shows chords and transposes
- **Device share sheet** (`_actors/share-sheet.md`) — receives the shared link

## Behavior

What the feature does, one line per rule. The rules below are the requirements; scenarios under each rule prove them. Data rules for a song are the invariants of the Song entity in `../../admin/_domain.md`.

| Rule | Requirement | Invariants | Scenarios |
|---|---|---|---|
| CAT-VIEW-R01 | The page shows the song title, its number and each section with its name | ADM-SONG-I5 | 001–003, 015–016 |
| CAT-VIEW-R02 | Chords are hidden by default, and the visitor's choice is remembered on the device | — | 004–006 |
| CAT-VIEW-R03 | Chords can be transposed to any of the 12 keys | ADM-SONG-I3 | 007–009 |
| CAT-VIEW-R04 | A song's key is its saved key, or else the root of its first chord | ADM-SONG-I3 | 010, 012, 014 |
| CAT-VIEW-R05 | Sharing offers the page link to the device's share sheet | — | 011, 013 |

## Scenarios

UI text is quoted exactly as the app shows it.

```gherkin
Feature: Song page

  @CAT-VIEW-R01
  Rule: The page shows the song title, its number and each section with its name

    @CAT-VIEW-001 @proposed @happy @song-number
    Scenario: Opening a song
      Given the song "Abba" with number 1 has sections "Куплет" and "Приспів"
      When the visitor opens the song page of "Abba"
      Then the header shows "№1"
      And the title "Abba" is shown
      And the sections "Куплет" and "Приспів" are shown in order

    @CAT-VIEW-002 @proposed @error
    Scenario: Unknown song
      Given no song exists with id 999
      When the visitor opens the song page with id 999
      Then one of these messages is shown, chosen at random:
        | Ой, ну ми вирішили що цю пісню вже не співають, сорі     |
        | Адмін не сильно любив цю пісню                            |
        | Хммм, хтось вирвав сторінку з цією піснею, пошукай іншу   |
      And the link "До списку пісень" leads to the home page

    @CAT-VIEW-015 @proposed @edge
    Scenario: Song added but not yet published
      Given the song with id 96 exists but was added after the last publish
      When the visitor opens the song page with id 96
      Then the page "Сторінка ще не готова" is shown
      And it says "Якщо пісню щойно додали, вона зʼявиться після публікації — зазвичай за 5 хвилин."
      And the link "До списку пісень" leads to the home page

    @CAT-VIEW-016 @proposed @error
    Scenario: Address that is not a song page
      Given the address "/45345345" is not a page of the site
      When the visitor opens it
      Then the page "Такої сторінки немає" is shown
      And the link "До списку пісень" leads to the home page

    @CAT-VIEW-003 @approved @happy
    Scenario: Back arrow
      Given the visitor opened a song page from a shared link
      When the visitor taps the back arrow
      Then the home page opens

  @CAT-VIEW-R02
  Rule: Chords are hidden by default, and the visitor's choice is remembered on the device

    @CAT-VIEW-004 @proposed @happy @chords
    Scenario: First visit
      Given the visitor never changed chord visibility
      When the visitor opens a song page
      Then chord lines are not shown
      And lyric lines are shown

    @CAT-VIEW-005 @proposed @happy @chords
    Scenario: Showing chords
      Given chords are hidden
      When the visitor taps the chords button
      Then chord lines are shown above their lyric lines
      And the key button is shown

    @CAT-VIEW-006 @proposed @happy @chords @device-memory
    Scenario: Choice is kept for the next song
      Given the visitor showed chords on one song
      When the visitor opens another song
      Then chord lines are shown

  @CAT-VIEW-R03
  Rule: Chords can be transposed to any of the 12 keys

    @CAT-VIEW-007 @proposed @happy @chords @transposition
    Scenario Outline: Choosing a key
      Given chords are shown
      And the song is written in "<origin>"
      When the visitor selects the key "<target>"
      Then the chord "<before>" is shown as "<after>"

      Examples:
        | origin | target | before | after |
        | C      | D      | C      | D     |
        | C      | D      | Am     | Bm    |
        | G      | C      | D/F#   | G/B   |

    @CAT-VIEW-008 @proposed @happy @chords @transposition
    Scenario: Key list marks the original key
      Given chords are shown
      And the song is written in "G"
      When the visitor opens the key list
      Then the item "G" reads "G origin"
      And the current key is highlighted

    @CAT-VIEW-009 @proposed @edge @chords @transposition
    Scenario: Key resets on another song
      Given the visitor transposed one song to "D"
      When the visitor opens another song
      Then the key button shows the other song's own key

  @CAT-VIEW-R04
  Rule: A song's key is its saved key, or else the root of its first chord

    @CAT-VIEW-010 @approved @happy @chords
    Scenario Outline: Determining the key
      Given a song whose saved key is "<saved>" and whose first chord is "<chord>"
      When the visitor shows chords on its page
      Then the key button shows "<key>"

      Examples:
        | saved | chord | key |
        | A     | C     | A   |
        |       | F#m   | F#  |
        |       | H     | B   |

    @CAT-VIEW-012 @proposed @edge @chords
    Scenario: Song without a key
      Given a song with no saved key and no chord lines
      When the visitor shows chords on its page
      Then no key button is shown

    @CAT-VIEW-014 @proposed @happy @chords @transposition
    Scenario: Chords are shown in the saved key
      Given a song whose saved key is "G" and whose first chord line is typed "C F G"
      When the visitor shows chords on its page
      Then the first chord line reads "G C D"
      And the key button shows "G"

  @CAT-VIEW-R05
  Rule: Sharing offers the page link to the device's share sheet

    @CAT-VIEW-011 @proposed @happy @sharing
    Scenario: Share on a supporting device
      Given the device supports sharing
      When the visitor taps the share button
      Then the share sheet opens with the song title and the page link

    @CAT-VIEW-013 @proposed @edge @sharing
    Scenario: Share on a device without a share sheet
      Given the device does not support sharing
      When the visitor taps the share button
      Then the page link is copied
      And the message "Посилання скопійовано" is shown
```
