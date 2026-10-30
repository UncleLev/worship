---
implements: <PREFIX>-<FEATURE>@<version>
---

# <Feature name> — technical notes

<!-- Only Overview is required. Add other sections as needed; delete empty ones. -->

## Overview
- `<path/to/module>` — <role>

## Flow
```mermaid
sequenceDiagram
  Client->>API: ...
```

## Integrations
### <System>
- Endpoint: ...
- Timeout: ... (<SCENARIO-ID>)
- Retries / idempotency: ...
- Errors: ...

## State
```mermaid
stateDiagram-v2
  [*] --> ...
```

## Data
- <Entity / invariant> (<SCENARIO-ID>)

## Decisions
- <Decision and why>

## Known limitations
- ...
