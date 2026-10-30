---
name: scenario-spec
description: Create, convert, update or review feature specs in the project's scenario-spec framework (ISO/IEC/IEEE 29148 + Gherkin, YAML header, DDD domain folders, actors, entities, behavior tags, SemVer, changelog); close open questions with the owner; write the product brief (business goals, stakeholders, success criteria). Use for any work on files under docs/specs/.
---

# Scenario Spec

Works with feature documentation under `docs/specs/`. Each feature is a folder with a behavior spec, a changelog and an optional technical note. Scenarios are at the same time acceptance criteria and QA test cases; rules are the requirements.

**Source of truth:** `docs/specs/_framework/README.md`. Read it at the start of every task. If it disagrees with this file, the README wins. Templates are in `docs/specs/_framework/templates/`, allowed behavior tags in `docs/specs/_framework/tags.md`, actors in `docs/specs/_actors/`.

**One source per fact.** Behavior lives only in scenarios. The `Behavior` table, actor files and header tags index scenarios by ID; they never restate behavior in other words.

## Modes

Pick the mode from the request. If unclear, ask one question.

| Mode | When |
|---|---|
| **convert** | An existing document (Notion page, README, ticket, old spec, pasted text) must become a spec in this framework |
| **create** | A new feature from a description, ticket or design |
| **document-code** | Describe what existing code actually does today (brownfield) |
| **add-finding** | A developer or QA found an edge case, bug or gap |
| **review** | Check specs against the framework rules; report, change nothing unless asked |
| **resolve** | Close open questions: prepare a decision pack, collect the owner's answers, apply them to the specs |
| **product-brief** | Write or update the product-level business document `docs/specs/_product.md` |

## Layout cheat sheet

```
docs/specs/_product.md                             # product brief (business level)
docs/specs/_actors/README.md                       # actor index
docs/specs/_actors/<actor>.md
docs/specs/<domain>/_domain.md                     # boundaries, entities + invariants, glossary
docs/specs/<domain>/<feature>/<feature>.spec.md
docs/specs/<domain>/<feature>/<feature>.changelog.md
docs/specs/<domain>/<feature>/<feature>.tech.md    # optional
```

- Spec ID: `<PREFIX>-<FEATURE>`; the feature folder is `<FEATURE>` in lowercase (`CAT-SEARCH` → `catalog/search/`).
- Rule ID: `<SPEC-ID>-RNN`, as a tag on the line above `Rule:`.
- Scenario ID: `<SPEC-ID>-NNN`. Invariant ID: `<PREFIX>-<ENTITY>-I<N>`. Actor ID: `ACT-<NAME>`.
- IDs are never changed or reused.
- Scenario tags, in order: ID, status (`@approved` / `@proposed`), type (`@happy` / `@edge` / `@error`), then zero or more behavior tags from `tags.md`.
- Header `tags` = sorted union of the behavior tags on the spec's scenarios. Never technology names.
- Language: the framework is in English. Gherkin keywords are always English. Spec text follows the language of the existing specs in the repo; if there are none, ask the user once (default English). UI strings are quoted verbatim in the UI's language.

## Building blocks every writing mode produces

1. **Actors.** For each role or external system the spec needs, use the file in `_actors/`; create it from `templates/actor.md` if missing and add it to `_actors/README.md`. For a role, add the new capabilities to `Can do` / `Cannot do` with the rule IDs. The spec's `Actors` section only links the file and says in one line what the actor does here.
2. **Entities.** Data rules that must always hold (uniqueness, required fields, numbering) are invariants of the owning entity in `_domain.md`, not sentences inside scenarios. Rules link them in the `Behavior` table.
3. **Rules and Behavior table.** Every `Rule:` gets an ID tag and a row in `Behavior` with its text verbatim, linked invariants and scenario numbers. This table is the overview a reader sees first.
4. **Behavior tags.** Tag scenarios by kind of behavior (`confirmation`, `offline`, `double-submit`…). Reuse existing tags; add a new one to `tags.md` with a meaning before using it. Then recompute the header `tags`.
5. **`related`.** Every spec ID mentioned in the text is in `related`.

## Mode: convert (existing doc → framework)

1. **Read the whole source** before writing. Note every behavior statement, rule, number, edge case, role, permission and open question it contains.
2. **Place it.** Decide domain and feature. If the domain has no `_domain.md`, create one from the template and propose the prefix. If the source covers several features, propose the split to the user before writing.
3. **Glossary, entities and actors first.** Collect terms into `_domain.md`; where the source uses synonyms for one thing, pick one term and list the others under "do not confuse". Extract data rules as entity invariants. Extract roles and their permissions into `_actors/`.
4. **Extract rules.** Turn each behavior statement into a `Rule:` that is singular, unambiguous and verifiable (29148). Vague words ("fast", "convenient", "correctly", "if needed") become open questions, not rules.
5. **Write scenarios under each rule.** Happy path first, then edge and error cases with concrete data. Use `Scenario Outline` for variations. Quote UI text verbatim.
6. **Status of what you write:**
   - Behavior the source states explicitly → `@approved`.
   - Behavior you inferred, or edge cases you added from the checklist → `@proposed`.
   - Anything contradictory or missing → `Open questions`, never guessed into a scenario.
7. **Build the Behavior table and tags** (see Building blocks).
8. **Technical content** in the source (endpoints, DB, libraries, architecture) does not go into the spec. If it meets the tech.md criteria, move it to `<feature>.tech.md`; otherwise drop it and mention that in the report.
9. **Header:** `version: 0.1.0`, `status: draft` unless the user says the behavior is already approved/live. If it is live, ask whether to start at `1.0.0` with `status: released`.
10. **Changelog:** one `[version]` entry with `Added` listing the scenario range and `Source:` (who owned the original doc, default BA), plus the first Status history row.
11. **Report** (in chat, not in files): what was mapped where, what became `@proposed`, open questions, what was dropped and why, and anything in the framework that did not fit the source well. That last part is feedback on the framework itself — always include it.

`@proposed` is allowed in a fresh draft (`0.x`). It must be resolved before the spec moves to `ready`.

## Mode: create

1. Read all material (ticket, design, notes), the domain's `_domain.md` and `_actors/`.
2. Fill the spec template: Purpose, Scope, Actors, Behavior, Scenarios grouped by `Rule`, optional Non-functional, Open questions. Produce all Building blocks.
3. Run the edge case checklist from the README, including permissions against each actor's `Can do` / `Cannot do`; add missing cases as `@proposed` or mark them Out of scope.
4. `version: 0.1.0`, `status: draft`. Create the changelog from its template.

## Mode: document-code

1. Read the code paths for the feature; never guess behavior. Read UI strings from the code and quote them verbatim.
2. Write scenarios describing what the code does now, all `@proposed`. Produce all Building blocks.
3. Behavior that looks like a bug is **not** encoded as spec: add it to Open questions with file and line. An invariant the code breaks gets "Holds today?: No" with a link to that question.
4. Implementation details found along the way go to `tech.md` if it meets the criteria.
5. Brownfield approval follows the README (whole-spec review, `draft → released`, `1.0.0`).

## Mode: add-finding

1. Classify:
   - **Bug** — code contradicts an `@approved` scenario. No spec change; tell the user which scenario is violated.
   - **Spec gap** — spec is silent or wrong. Continue.
2. Add the scenario under the right `Rule` with the next free ID, `@proposed` and behavior tags. If no rule fits, add a new rule with the next free rule ID and a `Behavior` row. Update header `tags` and actor files if needed.
3. Add a line to `[Unreleased] → Proposed` in the changelog with the source (Dev/QA + ticket).
4. Do not bump the version. Bumping happens when the BA approves (see below).

### When a proposed scenario is approved

1. Tag `@proposed` → `@approved`.
2. Move its changelog line from `[Unreleased]` into a new version section under the right category.
3. Bump `version` in the header (`Added`/`Deprecated` → MINOR, `Changed`/`Removed` → MAJOR, `Clarified` → PATCH). If several changes, the highest bump wins.
4. If the feature was `released`, set `status: in-development` and add a Status history row.

Rejected → delete the scenario and its `[Unreleased]` line. The ID stays burned.

Metadata changes (`tags`, `related`, `design`, behavior tags on scenarios) never bump the version and are not written to the changelog.

## Mode: review

Check and report per file, grouped by severity. Do not edit unless asked. Prefer running these as a script over reading by eye.

- **Header:** all required fields present; `id` matches prefix and folder; `domain` matches folder; no extra fields; `tags` equals the sorted union of scenario behavior tags; every tag exists in `tags.md`; no technology names in tags; every spec ID mentioned in the text is in `related`.
- **Version:** header version equals the highest version in the changelog.
- **Status:** `ready` or later has no `@proposed` scenarios and no blocking open questions.
- **Rules:** every `Rule:` has an ID tag; every rule has a `Behavior` row with identical text and vice versa; scenario ranges in `Behavior` match the scenarios under each rule; every rule has at least one scenario.
- **Scenarios:** every scenario has ID, status and type tags in that order; IDs unique and never reused (they follow creation order, not file order); every scenario has `Given`, `When` and `Then`.
- **29148 quality:** one behavior per scenario; no vague words; no implementation details (URLs, HTTP verbs, table names, component names); concrete data in `Given`; UI text verbatim, not translated; terms match `_domain.md` and actor titles.
- **Actors:** every actor named in the spec has a file in `_actors/` and a row in `_actors/README.md`; every rule ID in actor files exists; capabilities in the spec's rules appear in the role's `Can do`.
- **Entities:** every invariant ID in `Behavior` exists in `_domain.md`.
- **Edge cases:** checklist from README covered or explicitly out of scope.
- **tech.md:** present when criteria are met; `implements` version equals the spec version; no copied code.
- **Changelog:** every entry has a scenario or rule ID and Source; ranges only where the README allows; categories match the bump rules; Status history matches current status.

## Mode: resolve (close open questions)

Goal: the owner closes every open question in one sitting, then the specs are updated by the framework rules. Never answer a product question yourself.

### 1. Prepare the decision pack (no spec edits yet)
1. **Collect** every `Open questions` item in scope (one spec, a domain, or all of `docs/specs/`). Keep the original reference: `<SPEC-ID> Qn`.
2. **Verify each claim against the code** before presenting it. Read the cited file and line; where behavior is uncertain, run the code on a concrete input (for example, call the parser or transposition function on a sample string) and quote the result. A question whose premise turns out false is reported as such and rewritten, not answered.
3. **Classify** each question:
   - **Bug** — the code contradicts an `@approved` scenario, an invariant, or a stated Out of scope promise. Goes to the fix list; the owner only confirms.
   - **Decision** — the specs do not say what should happen. The owner chooses.
   - **Missing fact** — something outside the repo must be looked up (accounts, hosting, policies). List who can answer it.
4. **Elicit, don't invent.** Do not add features or new requirements. A new problem found while verifying is added as a separate, clearly marked question, not folded into another one.
5. **Group** questions that one underlying choice settles (for example, everything about who may edit). Each group opens with one plain "why" question whose answer decides the options.
6. **Options per question**, not per group: 2–3 real alternatives, a recommended default that fits the product's size and actors, and for each option its concrete consequence: which scenario IDs, rule IDs or invariants change, and what new scenarios it would need (with the next free IDs). Add an acceptance check the owner can verify after the change.
7. **Order** groups by impact: data integrity and access first, then visible behavior, then cosmetics.

Write the pack to the conversation, not to the repo. Structure:
1. **Quick answer sheet** — one table: question ref, class, recommended default, one-line consequence. Accepting every default must close all questions.
2. **Groups** — per group: the "why" question, then each question with verification evidence, options, default, consequence, acceptance check.
3. **Found while verifying** — new questions, marked.
4. **Missing facts** — what to look up and who knows it.

Ask the owner to answer the quick sheet first ("defaults" or per-question changes). Ask about at most 3 groups at a time if they want to go through details.

### 2. Apply the answers
For each answered question, in the spec PR:
- **Decision → behavior** — add or change scenarios and rules as `@proposed` per add-finding, or directly `@approved` if the owner approved the exact wording in this sitting; update the `Behavior` table, actors' `Can do` / `Cannot do`, invariants, header `tags`.
- **Decision → current behavior is right** — tag the affected scenarios `@approved` if they were `@proposed`, and add a Status history row `@proposed → @approved` with their IDs.
- **Bug** — no spec change; record it under `Known limitations` in the feature's tech.md as **Bug**, with file and line and the violated rule, scenario or invariant. Data problems go there as **Data**, agreed code changes without behavior impact as **Task**. Point the invariant's "Holds today?" at that entry until the fix lands.
- **Missing fact** — write the fact where it belongs (`_actors/`, `_domain.md`, `tech.md`) and remove the question.
- Remove the closed question from `Open questions`. Do not renumber the remaining ones.
- Changelog and version per the README bump table. Removing or rewriting an open question alone does not bump the version.
- Finish with a review-mode check and report what changed, per question.

## Mode: product-brief (`docs/specs/_product.md`)

The business-level document above the feature specs: why the product exists, for whom, what counts as success, and where each goal is delivered. It points at specs by ID and never restates scenario behavior. No user stories, no personas written in first person, no stakeholder-management boilerplate (influence grids, communication plans).

### Gather
1. Read the repo first: specs, `_actors/`, `_domain.md` files, tech notes, README, app metadata (manifest, layout), data seeds, deploy workflow and git history. Every fact in the brief must come from there or from the owner.
2. Interview the owner when available: at most 3 questions at a time, starting with the problem and who has it, then goals, then constraints. If the owner is not available, write the questions into the brief instead (see below).

### Write (template `templates/_product.md`)
1. **Problem** — what was hard before this product and for whom, with evidence from the repo (for example, how content was changed before).
2. **Stakeholders** — a table: stakeholder, link to `_actors/` file (or "not an actor in the app"), what they need from the product. Only stakeholders the repo or the owner confirms.
3. **Goals and success criteria** — each goal is an outcome, not a feature. Each criterion is either **verifiable now** (can be checked from the product or the repo, with how) or **needs a measurement source** (say which). A goal the evidence does not support goes to "Goals not confirmed" as a question, not into the list.
4. **Scope and constraints** — in and out of scope at product level; constraints that come from the repo (static site, one editor, hosting) with their source.
5. **Goal map** — a table goal → domains → spec IDs and rule IDs that deliver it. Every rule in the specs appears in at least one row; a rule that serves no goal is flagged as a question.
6. **Assumptions** — each labeled `A-n`, with its basis and the question that would confirm it.
7. **Questions for the owner** — `PQ-n`, each saying what it blocks.

The brief has a header `id: PRODUCT`, `version` (SemVer, bumped like a spec) and `related` with every spec ID it maps. Keep it proportional: for a product with a handful of specs, aim for one screen per section.

## Rules that always apply

- Never invent behavior. Unknown → Open questions.
- Never reuse a scenario, rule, invariant or actor ID.
- Never put dates in the spec header; dates live in the changelog only.
- Spec text describes **what**, never **how**.
- When editing an existing spec, keep everything you were not asked to change.
