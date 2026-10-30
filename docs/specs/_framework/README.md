# Spec Framework

Rules for documenting features as scenario-based specifications. Framework version: 0.3 (changes in section 13).

## 1. Foundations

- **ISO/IEC/IEEE 29148** — requirement quality: every requirement is necessary, unambiguous, singular, verifiable and has a unique ID. Besides individual requirements, 29148 expects context: who the users are and what the system does as a whole. The `Behavior` section, actors and entities cover that.
- **Gherkin** — notation: `Rule` = requirement, the `Scenario`s under it = examples that prove it, including edge cases. Every scenario is at the same time an acceptance criterion and a QA test case.
- **SemVer** — spec version. **Keep a Changelog** (adapted) — change history.

Specs are *aligned* with 29148, not certified against it.

**One source per fact.** Behavior is defined only by scenarios. Overviews (`Behavior`, actors, tags) never restate behavior; they index it by ID. A mismatch between an overview and the scenarios is caught by review.

**Language.** The framework, templates and skill are in English. Spec text may be in any language the team chooses; keep one language per repository. Gherkin keywords are always English. UI text is always quoted in the UI's language.

## 2. What lives where

| What | Where | Owner |
|---|---|---|
| Why the product exists, goals, success criteria | `_product.md` | BA / product owner |
| Feature behavior (what the system does) | `<feature>.spec.md` | BA; dev and QA propose |
| History of behavior and status changes | `<feature>.changelog.md` | Together with the spec |
| How the feature is built | `<feature>.tech.md` (optional) | Developers |
| Domain boundaries, entities, glossary | `_domain.md` | BA + tech lead |
| Roles, external systems, role permissions | `_actors/<actor>.md` | BA |
| Behavior tag vocabulary | `_framework/tags.md` | BA |
| Cross-cutting technical decisions | `docs/adr/` | Tech lead |

The spec describes **what**, tech.md describes **how**. The spec knows nothing about code; tech.md refers to a spec version.

## 3. Directory structure

Documentation lives in the monorepo next to the code.

```
docs/specs/
├── _product.md                      # product brief
├── _framework/
│   ├── README.md
│   ├── tags.md
│   └── templates/
├── _actors/
│   ├── README.md                    # actor index
│   └── <actor>.md
├── <domain>/
│   ├── _domain.md
│   └── <feature>/
│       ├── <feature>.spec.md
│       ├── <feature>.changelog.md
│       └── <feature>.tech.md        # optional
docs/adr/
```

- **Top-level folder = domain** (a DDD bounded context). Its name equals the `domain` field.
- **Folder inside = feature**. Files: `<feature>.<type>.md`, where `<feature>` = folder name, `<type>` ∈ `spec`, `changelog`, `tech`. Kebab-case.
- **Feature folder name = second part of the spec ID**, lowercase: `CAT-SEARCH` → `catalog/search/`, `ORD-GIFT-CARD` → `ordering/gift-card/`.
- **Two levels** (domain → feature). Add subdomains when a domain grows past ~8–10 features.
- **A cross-domain feature** lives in the domain that initiates the behavior. Other domains describe their part in their own specs and link it through `related`. Scenarios are not duplicated.
- **`_actors/`** is shared by all domains, because one role appears in many domains.

## 4. Spec header

```yaml
---
id: ORD-CHECKOUT
title: Checkout
summary: Placing an order from the cart, choosing delivery and paying.
domain: ordering
tags: [confirmation, payment, validation]
version: 1.3.0
status: in-development
design: https://figma.com/file/...   # optional
related: [PAY-REFUND, ADR-0004]       # optional
---
```

| Field | Required | Rule |
|---|---|---|
| `id` | yes | `<PREFIX>-<FEATURE>`, uppercase. Prefix comes from `_domain.md`. Never changed or reused |
| `title` | yes | Human name of the feature |
| `summary` | yes | One sentence: what the feature does. Helps search, including AI |
| `domain` | yes | Equals the domain folder name |
| `tags` | yes, may be `[]` | Sorted list of all behavior tags on this spec's scenarios. Nothing else. See section 6, "Behavior tags" |
| `version` | yes | SemVer, see section 9 |
| `status` | yes | See section 7 |
| `design` | no | One link |
| `related` | no | Only IDs of other specs or ADRs, never paths. Required when the spec text mentions other specs |

There are no dates in the header: the changelog is the only source of dates.

## 5. Product brief, actors and entities

### Product brief (`_product.md`)

One business-level document per product, above the feature specs (the business/stakeholder level of 29148). Template: `templates/_product.md`.

- Sections: Problem, Stakeholders, Goals and success criteria, Scope and constraints, Goal map, Assumptions, Questions for the owner.
- **Goals are outcomes**, not features. Each success criterion is marked **verifiable now** (with how) or **needs a measurement source** (with which). A goal the evidence does not support goes to "Goals not confirmed" as a question.
- **Goal map**: goal → domains → spec and rule IDs. Every rule appears in at least one row; a rule that serves no goal is a question.
- **Assumptions** are labeled `A-n`, each with its basis and the question that confirms it. Owner questions are `PQ-n`.
- It never restates scenario behavior, uses no user stories, first-person personas or stakeholder-management boilerplate.
- Header: `id: PRODUCT`, `title`, `summary`, `version` (bumped like a spec), `related` (every spec ID in the goal map).


### Actors (`_actors/`)

One file per role or external system. A spec names actors by `title` and does not redefine them.

```yaml
---
id: ACT-EDITOR
title: Editor
summary: One sentence: who this is and what they do.
kind: role            # role | system
---
```

- **ID** — `ACT-<NAME>`, uppercase. The file name is the kebab-case `title`.
- **A role** has the sections `Who`, `Identified by`, `Can do`, `Cannot do`. Others are optional when needed (for example, what is remembered on the device).
- **A system** has the sections `Role`, `Used by`.
- **`Can do` / `Cannot do`** — capabilities with a reference to a rule ID (`ORD-CHECKOUT-R02`). **`Used by`** — spec IDs. Name and reference behavior here; do not describe it.
- `_actors/README.md` — a table of all actors: ID, title, kind, file.

### Entities (`_domain.md`)

An entity is described in the domain that **owns** it (creates and changes it). Other domains only read it and refer to it.

- A table of fields: name, code name, meaning.
- A table of invariants with IDs `<PREFIX>-<ENTITY>-I<N>` (`ADM-SONG-I2`): data rules that must always hold.
- Spec rules link invariants in the `Behavior` section instead of restating them.
- For brownfield, a "Holds today?" column: whether the current code keeps the invariant, with a link to an Open question if not.

## 6. Spec body

Sections in order:

1. **Purpose** — what the feature gives users and the business, 2–4 sentences.
2. **Scope** — In scope / Out of scope.
3. **Actors** — links to files in `_actors/`, with one line on what the actor does in this feature.
4. **Behavior** — overview of the feature: a table of rules, one row per rule.
5. **Scenarios** — one `gherkin` block: `Feature` → `Rule` → `Scenario`.
6. **Non-functional** — optional. ID format `<ID>-N01`.
7. **Open questions** — `Q1`, `Q2`…, marked with what they block.

User stories are not used in specs: `Purpose`, `Behavior` and `_actors/` cover them.

### Behavior

```markdown
| Rule | Requirement | Invariants | Scenarios |
|---|---|---|---|
| ORD-CHECKOUT-R01 | An order can be placed only when its total is at least the minimum | ORD-ORDER-I1 | 001–003 |
```

- Every rule in Gherkin has a row, and every row has a rule. `Requirement` equals the `Rule:` text word for word.
- `Invariants` — invariant IDs from `_domain.md`, or `—`.
- `Scenarios` — numbers of the scenarios under this rule: a range and/or a list (`001–003, 014`).

### Rules

- **Rule ID** — `<SPEC-ID>-RNN`, two digits (`ORD-CHECKOUT-R01`). Put as a tag on the line above `Rule:`. Never reused.

### Scenarios

```gherkin
Feature: Checkout

  @ORD-CHECKOUT-R01
  Rule: An order can be placed only when its total is at least the minimum

    @ORD-CHECKOUT-001 @approved @happy
    Scenario: Order with a sufficient total
      Given the cart holds items worth 500 UAH
      And the minimum order total is 300 UAH
      When the customer taps "Place order"
      Then delivery options open
```

Scenario tags, in this order:
- **ID** — `@<SPEC-ID>-NNN`, three digits, numbered through the whole feature in order of creation. A scenario added later under an earlier rule takes the next free number, so numbers need not follow file order. Never reused, even after the scenario is deleted.
- **Status** — `@approved` or `@proposed`. Rejected scenarios are removed from the spec.
- **Type** — `@happy`, `@edge` or `@error`.
- **Behavior tags** — zero or more, from `tags.md`.

The source of a scenario (BA/Dev/QA) is not written in the spec; it is in the changelog.

### Behavior tags

Tags are a behavior index, so people and AI can find every scenario of a kind across all specs (`grep -rn "@confirmation" docs/specs`).

- A tag names a **kind of behavior** (`confirmation`, `offline`, `double-submit`), never a technology (database, library, storage). Technologies belong in `tech.md`.
- Tags go on scenarios, not on the spec. The header `tags` is a derived list.
- A tag does not repeat the domain or the feature name.
- A new tag is first added to `tags.md` with its meaning.

### Text quality rules (29148)

- **One scenario — one behavior.** A second check in `Then` = a second scenario.
- **Verifiable.** No "fast", "convenient", "correctly", "if needed". Only what QA can confirm: numbers, exact text, state.
- **UI text verbatim**, in the UI's language, even if the spec is in another language: `Then "Пісню збережено успішно" is shown`. QA cannot check translated text.
- **Behavior, not implementation.** `When the customer taps "Place order"`, not `When the frontend sends POST /orders`.
- **Unambiguous.** Terms come only from the `_domain.md` glossary and actor titles. A new term → add it there or replace it.
- **Concrete data** in `Given`. Variations of one rule → `Scenario Outline` + `Examples`.
- **Complete structure.** Every scenario has `Given`, `When` and `Then`.
- **Every `Rule` has at least one scenario.** Every scenario belongs to a `Rule`.
- **Gherkin keywords in English**, text in the team's language.

### Edge case checklist

When creating or reviewing a spec, check that these are covered (or deliberately listed in Out of scope):
- empty, boundary and invalid values;
- repeated action / double click / idempotency;
- access rights and different roles (compare with the actors' `Can do` / `Cannot do`);
- unavailability, timeout or error of an external system;
- concurrent changes to the same data;
- time zones, dates, day boundaries;
- interruption midway (app closed, network lost).

## 7. Feature statuses

`draft` → `in-design` → `ready` → `in-development` → `released` → `deprecated`

| Transition | Who | Condition |
|---|---|---|
| → `draft` | BA | The spec exists, with a purpose and at least the happy path |
| `draft` → `in-design` | BA | Enough scenarios to start design |
| `in-design` → `ready` | BA + tech lead | Design exists, all scenarios `@approved`, no blocking open questions. Version becomes `1.0.0` |
| `ready` → `in-development` | Developer | Work started |
| `in-development` → `in-design` | Developer / tech lead | A problem was found that requires redesign. Reason goes into the changelog or Open questions |
| `in-development` → `released` | Tech lead / QA | Feature is in production, all `@approved` scenarios are covered |
| `released` → `in-development` | BA | An approved behavior change, with a version bump |
| any → `deprecated` | BA | Feature removed or replaced; `related` points to the replacement |

Every status change is recorded in `Status history` in the changelog. A status change does **not** bump the version.

Approving `@proposed` scenarios that are already listed in an earlier version is also a status change: one Status history row `@proposed → @approved` with the scenario IDs, no bump.

### Existing feature (brownfield)

A spec documented from code that is already in production:
- All scenarios start as `@proposed`, status `draft`, version `0.1.0`.
- The BA reviews it **as a whole in one PR**: each scenario is approved, removed, or moved to Open questions as a possible bug. No per-scenario entry is needed — one `Changed status` line with a range in the changelog is enough.
- Then the spec moves straight to `released` with version `1.0.0`, skipping `in-design` and `ready`, because design and code already exist. Status history entry: `draft → released`, reason "Brownfield review".

## 8. What bumps the version

| Change | Bump |
|---|---|
| Behavior: scenario, rule, NFR | Per the table in section 9 |
| Wording without a behavior change, including verbatim UI text | PATCH (`Clarified`) |
| Metadata: `tags`, `related`, `design`, `status`, behavior tags on scenarios | No bump, not written to the changelog (status only in Status history) |
| Open questions: adding, rewriting or removing one | No bump, not written to the changelog. The answer that changes behavior bumps as a behavior change |
| Actors, entities, glossary | Does not bump the spec. If an invariant change changes behavior, it is a rule change in the spec, with a bump |

## 9. Versioning and changelog

### Version

- Before `ready` the spec lives in `0.x`. Moving to `ready` = `1.0.0`.
- In `0.x`, a change that would bump MAJOR bumps MINOR instead (`0.1.1` → `0.2.0`), as in SemVer.
- The header version equals the highest version in the changelog.

| Changelog category | Meaning | Bump |
|---|---|---|
| `Added` | New scenario, rule or NFR | MINOR |
| `Deprecated` | Scenario still applies but will be removed | MINOR |
| `Changed` | Behavior of an approved scenario changed | MAJOR |
| `Removed` | Scenario removed | MAJOR |
| `Clarified` | Wording only, behavior unchanged | PATCH |

### Entry format

```
- <SCENARIO-ID | RULE-ID> — <what changed> (Source: BA | Dev | QA[, TICKET])
```

ID and source are required, ticket is optional. One line — one scenario or one rule. A range (`ORD-CHECKOUT-001…012`) is allowed for the initial version, for a `Clarified` change that affects many scenarios the same way, and for a brownfield review. Newest versions on top, dates as `YYYY-MM-DD`.

### Unreleased

The `[Unreleased] → Proposed` section exists only inside an open PR. Before merging to main, every proposed scenario is either approved (moves to a new version) or removed.

### Status history

A table at the end of the changelog: `Date | From | To | Reason`.

## 10. Technical notes (`<feature>.tech.md`)

Created when the feature has at least one of:
- an integration with an external system;
- non-trivial state (state machine, queues, background jobs, idempotency, cache);
- a decision that does not follow obviously from the code;
- data- or event-level links between domains.

Not created for simple CRUD or UI logic.

Rules:
- The header `implements: <SPEC-ID>@<version>` is required. A version behind the spec → tech.md is stale.
- Only `Overview` is required. The rest (`Flow`, `Integrations`, `State`, `Data`, `Decisions`, `Known limitations`) as needed; no empty sections.
- Module paths instead of code. Diagrams in Mermaid.
- A technical detail that implements specific behavior refers to a scenario or rule ID: `(ORD-CHECKOUT-014)`.
- tech.md changes do not bump the spec version and are not written to the changelog — history is in git.
- `Known limitations` items that are defects are marked **Bug**, **Data** or **Task** and name the rule or invariant they violate. They are removed when fixed.
- Local decisions go to `Decisions`. Decisions that affect several features or the whole project go to a separate ADR in `docs/adr/`.

## 11. Change process

Approving a scenario = the BA's approval of the PR (or the tech lead's, if there is no BA).

**New feature.** The BA creates the spec in a PR (`draft`, `0.1.0`) and iterates in `0.x`. Moving to `ready` with `1.0.0` is approved by the BA and the tech lead. Code comes in separate PRs with `Implements:`.

**A developer found an edge case.** In their PR they add a `@proposed` scenario and an `[Unreleased]` entry. At review the BA either approves it (tag → `@approved`, entry → new version, header bump) or rejects it (scenario removed). Code and the approved scenario are merged together.

**QA found a problem.** Classify first:
- **Bug** — the code does not match an `@approved` scenario. Fix the code; the spec does not change.
- **Spec gap** — the spec is silent or wrong. Continue as for a developer's edge case. If QA does not work in the repo, they describe the case in a ticket and the BA or a developer adds the scenario.

**Behavior change after release.** The BA opens a PR with the scenario change, the bump and `released → in-development`. Code comes in a separate PR referring to the new version.

Rules:
- The version bump happens in the PR where the scenario becomes `@approved`.
- `@proposed` is not merged into main. Exception: a brownfield spec in `draft` before its review (section 7).
- Two PRs with the same bump → a changelog conflict; the second one takes the next version after rebase.
- Every PR fills in the `Spec` section of the PR template.

## 12. Tests

Recommendation: an automated test that checks a scenario includes its ID in its name or tag (`@ORD-CHECKOUT-014`, `it('ORD-CHECKOUT-014: ...')`). Coverage can then be found by search and later checked automatically.

## 13. Framework changes

### 0.3
- Product brief `_product.md` (section 5) and its template.
- Open questions do not bump the version (section 8).
- Skill modes `resolve` (close open questions) and `product-brief`.
- Scenario approvals in Status history; scenario numbers follow creation order, not file order; `Behavior` scenario lists.
- Bugs and data fixes found in specs go to `Known limitations` in tech.md, marked **Bug** / **Data** / **Task**, with the violated rule or invariant.

### 0.2
- Rule IDs (`<SPEC-ID>-RNN`) and the `Behavior` section — the feature overview.
- `_actors/` — one file per role or system, with role permissions.
- Entities and invariants in `_domain.md`.
- Tags are a behavior index on scenarios; header `tags` is derived; technology tags are not allowed.
- UI text verbatim.
- What bumps the version (section 8): metadata does not.
- Feature folder name = part of the ID.
- Brownfield: whole-spec review and `draft → released`.
- Ranges in the changelog for `Clarified` and brownfield.
- In `0.x`, MAJOR changes bump MINOR.
- Framework, templates and skill in English; spec text in the team's language.

### 0.1
- First version.
