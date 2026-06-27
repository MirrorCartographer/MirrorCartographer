# TikTok Connector Roadmap

## Phase 0 — Manual intake

Goal: work without TikTok credentials.

Capabilities:

- user pastes TikTok URL
- user adds why it matters
- connector normalizes URL
- MC creates tags and claim labels
- user chooses memory status
- public-safe items can be added to source index

Deliverables:

- URL intake form
- metadata placeholder
- MC interpretation card
- memory gate
- export to field map

## Phase 1 — Data export intake

Goal: support user-supplied TikTok data exports.

Capabilities:

- ingest CSV/JSON if supplied by user
- map rows to connector schema
- deduplicate URLs/video IDs
- batch review saved/liked/history items
- classify into MC categories

Deliverables:

- parser spec
- import validation checklist
- batch review UI
- privacy defaults

## Phase 2 — OAuth/API intake

Goal: integrate official TikTok developer access where permitted.

Capabilities depend on approved TikTok app scopes.

Possible capabilities:

- user authorization
- profile metadata where allowed
- video metadata where allowed
- content posting only if explicitly requested and separately permissioned

Required boundaries:

- no hidden background posting
- no scraping behind auth
- clear token storage and revocation
- scope display before connection

Deliverables:

- OAuth flow spec
- token storage design
- scope-to-feature matrix
- disconnect/delete flow

## Phase 3 — Field map clustering

Goal: turn TikTok references into navigable MC maps.

Clusters:

- symbols
- body/embodiment
- animal care
- visual style
- music/audio
- humor
- opportunity
- biology/research
- product idea
- discard/review later

Deliverables:

- clustering rules
- user-editable categories
- project link graph
- GitHub artifact export

## Phase 4 — Evidence discipline

Goal: prevent TikTok from becoming false authority.

Capabilities:

- flag advice claims
- separate anecdote from evidence
- require reliable sources before health/legal/financial/veterinary use
- mark platform metadata as partial if API-derived

Deliverables:

- claim escalation rule
- evidence-needed checklist
- source-index integration
- review-later queue

## First executable build task

Create a static prototype called `TikTok Field Intake` with:

1. URL input
2. user note box
3. auto-generated canonical URL placeholder
4. claim labels
5. privacy labels
6. project category selector
7. memory gate
8. output JSON matching `schema.json`

## Success criterion

A user can paste one TikTok link and, within one minute, know:

- what is source fact
- what is their own meaning
- what MC inferred
- what is private
- what can become public-safe
- where the item belongs in the MC field map
