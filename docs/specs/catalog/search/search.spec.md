---
id: CAT-SEARCH
title: Song list and search
summary: Home page that lists all songs alphabetically and lets a visitor narrow them by number or title, or pick three at random.
domain: catalog
tags: [device-memory, network-failure, offline, random-pick, search, song-number]
version: 0.2.0
status: draft
related: [CAT-VIEW]
---

# Song list and search

## Purpose
A visitor opens the app and quickly finds a song to sing, by number, by part of the title, or by chance. The list appears instantly on repeat visits.

## Scope
**In scope:**
- Alphabetical list, search by number or title, random pick, remembering the scroll position, showing a previously loaded list instantly

**Out of scope:**
- Searching inside lyrics
- Favorites (the unused filter is to be removed from the code)

## Actors
Actors are defined in `../../_actors/`.
- **Visitor** (`_actors/visitor.md`) — browses and searches
- **Songs database** (`_actors/songs-database.md`) — supplies the list

## Behavior

What the feature does, one line per rule. The rules below are the requirements; scenarios under each rule prove them.

| Rule | Requirement | Invariants | Scenarios |
|---|---|---|---|
| CAT-SEARCH-R01 | The list shows every song, ordered alphabetically by title, each with its song number | ADM-SONG-I5 | 001–002 |
| CAT-SEARCH-R02 | A previously loaded list is shown immediately and refreshed afterwards | — | 003–004 |
| CAT-SEARCH-R03 | Typing digits finds the song with exactly that number | — | 005 |
| CAT-SEARCH-R04 | Typing text narrows the list to titles containing that text, ignoring letter case | — | 006–008, 014 |
| CAT-SEARCH-R05 | The random button shows exactly three different songs | — | 009–012, 017 |
| CAT-SEARCH-R06 | Returning from a song restores the visitor's place in the list | — | 013 |
| CAT-SEARCH-R07 | If the list cannot be loaded and none was loaded before, the visitor sees an error and can retry | — | 015–016 |

## Scenarios

UI text is quoted exactly as the app shows it.

```gherkin
Feature: Song list and search

  @CAT-SEARCH-R01
  Rule: The list shows every song, ordered alphabetically by title, each with its song number

    @CAT-SEARCH-001 @approved @happy @song-number
    Scenario: Opening the home page
      Given the database holds songs "Amazing" with number 2 and "Abba" with number 1
      When the visitor opens the home page
      Then the heading "Worship" is shown
      And the list shows "1. Abba" followed by "2. Amazing"

    @CAT-SEARCH-002 @proposed @happy
    Scenario: Opening a song from the list
      Given the list shows "1. Abba"
      When the visitor taps "1. Abba"
      Then the song page of "Abba" opens

  @CAT-SEARCH-R02
  Rule: A previously loaded list is shown immediately and refreshed afterwards

    @CAT-SEARCH-003 @proposed @happy @offline @device-memory
    Scenario: Repeat visit with the same site version
      Given the visitor loaded the list earlier on this site version
      When the visitor opens the home page without network
      Then the previously loaded list is shown

    @CAT-SEARCH-004 @proposed @edge @device-memory
    Scenario: Site version changed since the last visit
      Given the visitor loaded the list on an older site version
      When the visitor opens the home page
      Then the list stored for the older version is discarded

  @CAT-SEARCH-R03
  Rule: Typing digits finds the song with exactly that number

    @CAT-SEARCH-005 @proposed @happy @search @song-number
    Scenario Outline: Search by number
      Given songs numbered 1 to 10 exist
      When the visitor types "<input>" in the field "Номер / Назва.."
      Then the list shows <result>

      Examples:
        | input | result                 |
        | 7     | only the song number 7 |
        | 11    | no songs               |

  @CAT-SEARCH-R04
  Rule: Typing text narrows the list to titles containing that text, ignoring letter case

    @CAT-SEARCH-006 @proposed @happy @search
    Scenario: Search by part of a title
      Given songs "Amazing Grace" and "Abba" exist
      When the visitor types "GRAC" in the field "Номер / Назва.."
      Then the list shows only "Amazing Grace"

    @CAT-SEARCH-007 @proposed @happy @search
    Scenario: Clearing the search
      Given the visitor typed "GRAC" in the field "Номер / Назва.."
      When the visitor clears the field
      Then the list shows all songs

    @CAT-SEARCH-008 @proposed @edge @search
    Scenario: Nothing matches
      Given songs "Amazing Grace" and "Abba" exist
      When the visitor types "zzz" in the field "Номер / Назва.."
      Then the list shows no songs

    @CAT-SEARCH-014 @proposed @edge @search
    Scenario: Only spaces in the search field
      Given songs "Amazing Grace" and "Abba" exist
      When the visitor types "   " in the field "Номер / Назва.."
      Then the list shows all songs

  @CAT-SEARCH-R05
  Rule: The random button shows exactly three different songs

    @CAT-SEARCH-009 @proposed @happy @random-pick
    Scenario: Random pick
      Given at least 3 songs exist
      When the visitor taps the random button
      Then the list shows 3 different songs
      And a reset button appears below the list

    @CAT-SEARCH-010 @proposed @happy @random-pick
    Scenario: Re-rolling
      Given the random pick is active
      When the visitor taps the reset button
      Then the list shows 3 songs chosen again at random

    @CAT-SEARCH-011 @proposed @happy @random-pick
    Scenario: Leaving random mode
      Given the random pick is active
      When the visitor taps the random button again
      Then the list shows all songs

    @CAT-SEARCH-012 @proposed @edge @search @random-pick
    Scenario: Typing while random is active
      Given the random pick is active
      When the visitor types "a" in the field "Номер / Назва.."
      Then the random pick is turned off
      And the list shows songs matching "a"

    @CAT-SEARCH-017 @proposed @edge @random-pick
    Scenario: Fewer than three songs
      Given only 2 songs exist
      When the visitor taps the random button
      Then the list shows both songs

  @CAT-SEARCH-R06
  Rule: Returning from a song restores the visitor's place in the list

    @CAT-SEARCH-013 @proposed @happy @device-memory
    Scenario: Back from a song
      Given the visitor scrolled the list and opened a song
      When the visitor goes back to the home page
      Then the list is scrolled to the song that was opened

  @CAT-SEARCH-R07
  Rule: If the list cannot be loaded and none was loaded before, the visitor sees an error and can retry

    @CAT-SEARCH-015 @proposed @error @network-failure
    Scenario: List cannot be loaded
      Given the visitor never loaded the list on this device
      When the visitor opens the home page and the songs database does not respond
      Then the message "Не вдалося завантажити пісні. Перевір зʼєднання." is shown
      And the button "Спробувати ще" is shown

    @CAT-SEARCH-016 @proposed @happy @network-failure
    Scenario: Retrying after a failure
      Given the message "Не вдалося завантажити пісні. Перевір зʼєднання." is shown
      When the visitor taps "Спробувати ще" and the songs database responds
      Then the list shows all songs
```
