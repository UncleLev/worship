---
id: <PREFIX>-<FEATURE>
title: <Feature name>
summary: <One sentence: what the feature does>
domain: <domain>
tags: []      # derived: all behavior tags used on the scenarios
version: 0.1.0
status: draft
design:        # optional, one link
related: []    # optional, IDs of specs or ADRs
---

# <Feature name>

## Purpose
<What the feature gives users and the business. 2–4 sentences.>

## Scope
**In scope:**
- ...

**Out of scope:**
- ...

## Actors
<!-- Actors are defined in docs/specs/_actors/. Here: only what the actor does in this feature. -->
- **<Role>** (`_actors/<actor>.md`) — <what it does in this feature>
- **<External system>** (`_actors/<system>.md`) — <its part in the feature>

## Behavior
<!-- One row per Rule. Requirement = the Rule text word for word. -->
| Rule | Requirement | Invariants | Scenarios |
|---|---|---|---|
| <PREFIX>-<FEATURE>-R01 | <One requirement, unambiguous and verifiable> | <invariant ID or —> | 001–002 |

## Scenarios

UI text is quoted exactly as the app shows it.

```gherkin
Feature: <Feature name>

  @<PREFIX>-<FEATURE>-R01
  Rule: <One requirement, unambiguous and verifiable>

    @<PREFIX>-<FEATURE>-001 @approved @happy @<behavior tag, optional>
    Scenario: <Short name>
      Given <precondition with concrete data>
      When <action>
      Then <observable result; UI text verbatim>

    @<PREFIX>-<FEATURE>-002 @approved @edge
    Scenario Outline: <Short name>
      Given <precondition with <param>>
      When <action>
      Then <result <outcome>>

      Examples:
        | param | outcome |
        | ...   | ...     |
```

## Non-functional
<!-- Optional. Delete the section if not needed. -->
- **<PREFIX>-<FEATURE>-N01** <Measurable requirement>

## Open questions
<!-- Delete the section if there are no questions. -->
- **Q1** <Question> — blocks <SCENARIO-ID>
