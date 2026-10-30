---
id: ADM-EDIT
title: Song management
summary: Admin list of songs, with adding, editing with live preview, and two-step deletion of songs, keeping song numbers in title order.
domain: admin
tags: [confirmation, deletion, double-submit, narrow-screen, network-failure, preview, search, song-number, unsaved-changes, validation]
version: 0.3.0
status: draft
related: [ADM-ACCESS, ADM-PUBLISH, CAT-VIEW]
---

# Song management

## Purpose
The editor maintains the songbook without touching the database directly: finds a song, writes or corrects its text and key, sees how visitors will see it, and removes songs that are no longer used.

## Scope
**In scope:**
- Admin song list and search, adding, editing, preview, unsaved-changes warning, deleting, renumbering

**Out of scope:**
- Making changes visible to visitors (see ADM-PUBLISH); a new song has no page of its own until then
- Undo or history of changes
- Two editors changing the same song at the same time (the last save wins)
- Different editor roles: every signed-in editor has the same rights
- Time zones and dates: songs carry no dates

## Actors
Actors are defined in `../../_actors/`.
- **Editor** (`_actors/editor.md`) — does everything in this spec
- **Songs database** (`_actors/songs-database.md`) — stores songs

## Behavior

What the feature does, one line per rule. The rules below are the requirements; scenarios under each rule prove them. Data rules for a song are the invariants of the Song entity in `../_domain.md`.

| Rule | Requirement | Invariants | Scenarios |
|---|---|---|---|
| ADM-EDIT-R01 | The admin list shows songs in number order, 20 at a time, loading more on scroll | — | 001–002, 025 |
| ADM-EDIT-R02 | The editor finds a song by part of its title or by its number and opens it for editing | — | 003–005, 026 |
| ADM-EDIT-R03 | A new song needs a title and lyrics, and its title must be unique ignoring letter case | I1, I2, I4, I5 | 006–009, 027 |
| ADM-EDIT-R04 | Changes to an existing song are saved only after confirmation | I1, I4 | 010–013 |
| ADM-EDIT-R05 | The form shows a live preview exactly as visitors see the song page | — | 014–017 |
| ADM-EDIT-R06 | Unsaved changes are not lost silently | — | 018 |
| ADM-EDIT-R07 | Deleting a song needs two confirmations and keeps numbers consecutive | I5 | 019–021 |
| ADM-EDIT-R08 | A save is performed once, however many times the button is tapped | — | 022–024 |

## Scenarios

UI text is quoted exactly as the app shows it.

```gherkin
Feature: Song management

  @ADM-EDIT-R01
  Rule: The admin list shows songs in number order, 20 at a time, loading more on scroll

    @ADM-EDIT-001 @proposed @happy
    Scenario: Opening the list
      Given 45 songs exist
      When the editor opens the admin area
      Then the first 20 songs are listed in number order

    @ADM-EDIT-002 @proposed @happy
    Scenario: Scrolling to the end
      Given 45 songs exist and the first 20 are listed
      When the editor scrolls to the bottom of the list
      Then the next 20 songs are added to the list

    @ADM-EDIT-025 @proposed @happy @song-number
    Scenario: Each row shows the song number
      Given the song "Abba" has number 7
      When the editor types "7" in the field "Номер / Назва.."
      Then its row reads "7. Abba"

  @ADM-EDIT-R02
  Rule: The editor finds a song by part of its title or by its number and opens it for editing

    @ADM-EDIT-003 @proposed @happy @search
    Scenario: Search by title
      Given songs "Amazing Grace" and "Abba" exist
      When the editor types "grac" in the field "Номер / Назва.."
      Then only "Amazing Grace" is listed

    @ADM-EDIT-004 @proposed @happy @search @song-number
    Scenario: Search by number
      Given a song with number 7 exists
      When the editor types "7" in the field "Номер / Назва.."
      Then only the song with number 7 is listed

    @ADM-EDIT-005 @proposed @happy
    Scenario: Opening a song for editing
      Given the admin list shows "Abba"
      When the editor taps "Abba"
      Then the form "Редагування" opens with the title, key and lyrics of "Abba"

    @ADM-EDIT-026 @proposed @edge @search
    Scenario: Only spaces in the search field
      Given 45 songs exist
      When the editor types "   " in the field "Номер / Назва.."
      Then the first 20 songs are listed in number order

  @ADM-EDIT-R03
  Rule: A new song needs a title and lyrics, and its title must be unique ignoring letter case

    @ADM-EDIT-006 @proposed @edge @validation
    Scenario Outline: Save is unavailable without required fields
      Given the editor opens the form "Додавання"
      When the title is "<title>" and the lyrics are "<lyrics>"
      Then the button "Зберегти" is disabled

      Examples:
        | title | lyrics   |
        |       | La la la |
        | Abba  |          |
        | " "   | La la la |

    @ADM-EDIT-007 @approved @happy @song-number
    Scenario: Adding a song
      Given the editor filled the title " Abba ", key "C" and lyrics "@Куплет\nLa la la"
      When the editor taps "Зберегти"
      Then the song is stored with the title "Abba"
      And song numbers are reassigned in title order

    @ADM-EDIT-008 @proposed @error @validation
    Scenario: Duplicate title
      Given a song "Abba" exists
      When the editor saves a new song titled "ABBA"
      Then the message "Пісня з такою назвою вже існує" is shown under the title
      And no song is added

    @ADM-EDIT-027 @proposed @happy
    Scenario: The new song has no page until the next publish
      Given the editor added the song "Abba"
      When the app opens the address of the new song's form
      Then the page "Сторінка ще не готова" is shown
      And it says "Якщо пісню щойно додали, вона зʼявиться після публікації — зазвичай за 5 хвилин."
      And the link "До списку пісень" leads to the home page

    @ADM-EDIT-009 @proposed @error
    Scenario: Database rejects the save
      Given the editor filled a valid new song
      When the database returns an error on save
      Then the error message from the database is shown
      And the entered text is kept

  @ADM-EDIT-R04
  Rule: Changes to an existing song are saved only after confirmation

    @ADM-EDIT-010 @proposed @happy @confirmation
    Scenario: Saving changes
      Given the editor changed the lyrics of "Abba"
      When the editor taps "Зберегти" and confirms "Зберегти зміни?" with "Зберегти"
      Then the changes are stored
      And the message "Пісню збережено успішно" is shown

    @ADM-EDIT-011 @proposed @happy @confirmation
    Scenario: Cancelling the confirmation
      Given the editor changed the lyrics of "Abba"
      When the editor taps "Зберегти" and then "Скасувати"
      Then nothing is stored

    @ADM-EDIT-012 @proposed @edge
    Scenario: Success message goes away on the next change
      Given the message "Пісню збережено успішно" is shown
      When the editor changes any field
      Then the message disappears

    @ADM-EDIT-013 @proposed @error
    Scenario: Song cannot be loaded
      Given the song does not exist or the database returns an error
      When the editor opens its form
      Then the error message is shown instead of the form

  @ADM-EDIT-R05
  Rule: The form shows a live preview exactly as visitors see the song page

    @ADM-EDIT-014 @proposed @happy @preview
    Scenario: Preview updates while typing
      Given the editor is on the form "Додавання" or "Редагування"
      When the editor types the line "@Куплет" in the lyrics
      Then the preview shows a section named "Куплет"

    @ADM-EDIT-015 @proposed @happy @preview
    Scenario: Empty form
      Given the editor opens the form "Додавання"
      When the title and lyrics are both empty
      Then the preview shows "Порожній перегляд"

    @ADM-EDIT-016 @proposed @happy @preview @narrow-screen
    Scenario: Switching panels on a narrow screen
      Given the screen is narrow
      When the editor taps "Перегляд"
      Then the preview is shown and the form is hidden

    @ADM-EDIT-017 @proposed @happy
    Scenario: Format help
      Given the editor is on the form
      When the editor taps the help button next to "Зміст"
      Then the dialog "Формат змісту" explains that a line starting with "@" begins a section

  @ADM-EDIT-R06
  Rule: Unsaved changes are not lost silently

    @ADM-EDIT-018 @proposed @edge @unsaved-changes
    Scenario: Leaving the page with unsaved changes
      Given the editor changed a field and did not save
      When the editor closes or reloads the browser tab
      Then the browser asks to confirm leaving

  @ADM-EDIT-R07
  Rule: Deleting a song needs two confirmations and keeps numbers consecutive

    @ADM-EDIT-019 @approved @happy @song-number @confirmation @deletion
    Scenario: Deleting a song
      Given the form "Редагування" of "Abba" is open
      When the editor taps "Видалити"
      And answers "Ти впевнений?" with "Так"
      And answers "Ти точно хочеш цього, потім прийдеться назад додавати вручну ..." with "Так, видалити"
      Then the song is removed
      And song numbers are reassigned in title order
      And the admin list opens

    @ADM-EDIT-020 @proposed @edge @confirmation @deletion
    Scenario: Stopping after the first confirmation
      Given the editor answered "Ти впевнений?" with "Так"
      When the editor taps "Скасувати" in the second dialog
      Then the song is not removed

    @ADM-EDIT-021 @proposed @error @deletion
    Scenario: Database rejects the deletion
      Given the editor reached the second dialog
      When the database returns an error
      Then the error message is shown in the dialog
      And the song is not removed

  @ADM-EDIT-R08
  Rule: A save is performed once, however many times the button is tapped

    @ADM-EDIT-022 @proposed @edge @double-submit
    Scenario: Double tap on save
      Given the editor filled a valid new song
      When the editor taps "Зберегти" twice in quick succession
      Then only one song is added

    @ADM-EDIT-023 @proposed @edge @double-submit
    Scenario: Confirming a save twice
      Given the editor changed the lyrics of "Abba" and the dialog "Зберегти зміни?" is open
      When the editor taps "Зберегти" in the dialog twice in quick succession
      Then the changes are stored once
      And the dialog button shows "Збереження..." while saving

    @ADM-EDIT-024 @proposed @edge @network-failure
    Scenario: Network is lost while saving
      Given the editor filled a valid new song
      When the network connection is lost before the save completes
      Then an error message is shown
      And the entered text is kept
```
