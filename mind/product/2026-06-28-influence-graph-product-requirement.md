# Product Requirement — Consent-Scoped Influence Graph

Status labels

- Source status: derived from public-safe MC architecture, prior GitHub mind artifacts, saved architectural context, and current external research alignment.
- Claim status: product requirement proposal.
- Privacy status: public-safe; no private source content.
- Missingness: no UI, no backend, no test fixtures, no security review, no user research.
- Revision reason: created because PublicSafeCompiler needs a visible influence layer, not only a source-boundary note.

## Product name

Consent-Scoped Influence Graph

## User problem

A researcher or reviewer wants to understand how an MC artifact was shaped without needing access to private chats, saved context, personal details, or raw transcripts.

The current plain-language boundary labels help, but they do not show the structure of influence.

## Product goal

Make influence inspectable without making private source material visible.

## Non-goals

- Do not expose raw private content.
- Do not publish private memories.
- Do not claim that hidden context is evidence.
- Do not turn private user history into a public dataset.
- Do not imply medical, veterinary, therapeutic, legal, financial, or credential authority.

## Required functionality

### 1. Influence lane selector

Every artifact must declare which lanes shaped it.

Lanes:

- public_repo
- saved_architecture_context
- conversation_pattern_context
- external_research
- synthetic_fixture
- implementation_observation

### 2. Blocked lane declaration

Every artifact must declare blocked classes.

Default blocked classes:

- personal details
- household details
- health details
- animal-care details
- financial details
- location details
- relationship details
- credential details
- raw transcript details

### 3. Claim dependency table

Each major claim must be tagged as:

- public evidence
- repository precedent
- architecture inference
- synthetic fixture only
- speculative hypothesis
- unsupported / needs research

### 4. Transformation record

For each private or mixed-source influence, record the transformation type.

Examples:

- abstracted into method
- converted into product requirement
- converted into evaluation criterion
- converted into research question
- converted into privacy-safe index
- blocked entirely

### 5. Export view

Produce a small Markdown block that can be appended to any GitHub artifact.

### 6. Failsafe

If an artifact cannot explain its influence without leaking private content, it must be marked `blocked` or `internal-only`.

## UX requirement

The UI should make the graph readable to non-engineers.

A reviewer should be able to see:

- what shaped the artifact
- what did not cross
- what is evidence
- what is speculation
- what remains missing

## Evaluation criteria

A good influence graph passes these checks:

1. A reviewer can tell whether private context shaped the artifact.
2. A reviewer cannot reconstruct private details from the graph.
3. Claims are not upgraded beyond their evidence lane.
4. Missingness is explicit.
5. The graph can be compared across artifacts.

## First implementation plan

1. Add `InfluenceGraphRecord` schema.
2. Create one fixture record for the PublicSafeCompiler artifact family.
3. Add a checklist to future mind artifacts.
4. Later, convert the checklist into CI or pre-publication validation.

## Key phrase

A public artifact should not pretend it has no past. It should show which parts of the past were allowed to matter.
