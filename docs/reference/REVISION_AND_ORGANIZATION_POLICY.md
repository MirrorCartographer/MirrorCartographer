# Revision and Organization Policy

This repository should be useful as a reference library, not confusing as a pile of rewritten fragments.

The default rule is additive organization: preserve source material and add indexes, summaries, tags, cross-links, and interpretation layers around it.

Revisions are allowed, but they must be labeled clearly.

## Source categories

### 1. Source-derived notes

These are files created from uploaded images, articles, screenshots, conversations, or prior documents.

They may summarize or translate source material into product language.

They should not pretend to be untouched originals.

### 2. AI-organized summaries

These are files where the assistant organizes raw material into clearer categories, maps, or reference paths.

They should be treated as interpretation and synthesis.

### 3. Revised public language

These are files rewritten to make Mirror Cartographer clearer, safer, more searchable, or more useful.

A revision should explain why it was made.

### 4. Product implementation files

These are code or build files that directly affect the demo or deployment.

Examples:

- `src/lib/mirrorMap.ts`
- `src/app/page.tsx`
- `.github/workflows/ci.yml`
- `package.json`

### 5. Boundary and audit files

These are files that clarify what the project should not claim.

Examples:

- `docs/HARDCORE_INTERROGATION_AUDIT.md`
- `docs/RESEARCH_GROUNDED_FIX_PLAN.md`
- `docs/EVALUATION_PACKET.md`

## Revision labeling rule

When a file is meaningfully rewritten, the revision should include at least one of the following:

- a status note
- a reason for revision
- a source note
- a boundary note
- a changelog entry

## Acceptable reasons to revise

A file may be revised when the goal is to:

- make it clearer
- reduce overclaiming
- improve safety boundaries
- organize for searchability
- correct generic or inflated language
- separate source from interpretation
- turn theory into product requirements
- improve code quality or deployment reliability

## What should not happen

Do not silently delete useful material.

Do not hide earlier thinking because it was messy.

Do not pretend revised public language was the original source.

Do not erase the fact that many artifacts are AI-assisted or co-created.

Do not turn symbolic or medical-adjacent material into authority claims.

## Recommended revision note format

Use this format at the top or bottom of revised reference files when appropriate:

Revision note:

- Status: revised / organized / source-derived / implementation-facing.
- Reason: why the revision was made.
- Source: what material it draws from.
- Boundary: what should not be inferred.

## Repository-wide principle

Preserve the raw signal when possible.

Make the organized layer clear.

Make the revised layer useful.

Make the boundary visible.