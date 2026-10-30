---
id: ADM-PUBLISH
title: Publish changes
summary: Admin button that rebuilds the public site so edited songs become visible, with a five-minute progress countdown.
domain: admin
tags: [confirmation, device-memory, progress]
version: 0.1.1
status: draft
related: [ADM-EDIT]
---

# Publish changes

## Purpose
Song pages are generated ahead of time, so edits are invisible to visitors until the site is rebuilt. The editor starts the rebuild from the admin area and sees that it is in progress.

## Scope
**In scope:**
- Publish button, confirmation, in-progress state and countdown, failure to start

**Out of scope:**
- Detecting when the rebuild really finished (the countdown is a fixed estimate)
- Rollback
- Showing progress on other devices: a second publish started elsewhere waits in the queue

## Actors
Actors are defined in `../../_actors/`.
- **Editor** (`_actors/editor.md`) — starts the publish
- **Publish service** (`_actors/publish-service.md`) — starts the site rebuild
- **Authentication service** (`_actors/auth-service.md`) — the publish service accepts only callers with a valid session

## Behavior

What the feature does, one line per rule. The rules below are the requirements; scenarios under each rule prove them.

| Rule | Requirement | Invariants | Scenarios |
|---|---|---|---|
| ADM-PUBLISH-R01 | Publishing starts only after the editor confirms | — | 001–003 |
| ADM-PUBLISH-R02 | While a publish is running, the editor sees a countdown of the remaining 5 minutes | — | 004–006 |
| ADM-PUBLISH-R03 | A failure to start is reported and does not block another attempt | — | 007 |

## Scenarios

UI text is quoted exactly as the app shows it.

```gherkin
Feature: Publish changes

  @ADM-PUBLISH-R01
  Rule: Publishing starts only after the editor confirms

    @ADM-PUBLISH-001 @proposed @happy @confirmation
    Scenario: Confirming
      Given the editor is on the admin song list and no publish is running
      When the editor taps the button "Розгорнути" and then "Підтвердити"
      Then the publish service is asked to rebuild the site
      And the button shows the in-progress icon

    @ADM-PUBLISH-002 @proposed @happy
    Scenario: Confirmation text
      Given no publish is running
      When the editor taps the button "Розгорнути"
      Then the dialog "Розгорнути зміни?" is shown
      And it says "Переконайся, що всі правки завершені — деплой опублікує поточний стан даних."
      And it says "Деплой займає приблизно 5 хвилин."

    @ADM-PUBLISH-003 @proposed @happy @confirmation
    Scenario: Cancelling
      Given the dialog "Розгорнути зміни?" is open
      When the editor taps "Скасувати"
      Then the publish service is not called

  @ADM-PUBLISH-R02
  Rule: While a publish is running, the editor sees a countdown of the remaining 5 minutes

    @ADM-PUBLISH-004 @approved @happy @progress
    Scenario: Viewing progress
      Given a publish started 1 minute ago
      When the editor taps the button "Розгорнути"
      Then the dialog "Деплой виконується..." is shown
      And it says "Залишилось приблизно 4:00"
      And it offers only "Закрити"

    @ADM-PUBLISH-005 @approved @edge @progress @device-memory
    Scenario: Reloading the page during a publish
      Given a publish started 1 minute ago on this device
      When the editor reloads the admin page
      Then the button still shows the in-progress icon
      And the countdown continues from the same moment

    @ADM-PUBLISH-006 @approved @happy @progress
    Scenario: Countdown ends
      Given a publish started 5 minutes ago
      When the editor opens the admin page
      Then the button shows the ready icon

  @ADM-PUBLISH-R03
  Rule: A failure to start is reported and does not block another attempt

    @ADM-PUBLISH-007 @proposed @error
    Scenario: Publish service returns an error
      Given the editor confirmed a publish
      When the publish service returns an error
      Then the in-progress state ends
      And the dialog "Розгорнути зміни?" opens with the error message
      And the editor can tap "Підтвердити" again
```
