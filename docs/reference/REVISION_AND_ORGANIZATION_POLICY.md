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

## What counts as meaningful revision

A revision is meaningful when it changes how a future reader would understand, trust, use, test, or build from the material.

Meaningful revisions include changes to:

- the central claim or definition
- the scope of what the project says it can do
- safety, medical, legal, veterinary, financial, or psychological boundaries
- authorship, attribution, or co-creation framing
- source status: whether something is source-backed, user-backed, speculative, or not available
- claim status: observation, user report, symbolic hypothesis, fact, next step, or not enough information
- product behavior or feature requirements
- evaluation criteria or pass/fail standards
- evidence level or proof status
- public-facing language that could affect trust or interpretation
- code behavior, build behavior, deployment behavior, or data handling
- anything that removes, adds, or reframes a major idea

Examples of meaningful revisions:

- changing "sacred recursive system" to "bounded symbolic reflection interface"
- changing "hallucination audit" to "audit label" because no real audit engine exists yet
- adding a health-adjacent warning
- adding user feedback controls
- changing a source-derived medical hypothesis into a question-for-clinician boundary
- rewriting a README to reduce overclaiming
- changing the mapping engine behavior
- adding a new category such as disruption type or source status

## What does not count as meaningful revision

A revision is not meaningful when it improves readability or navigation without changing the substance.

Non-meaningful changes include:

- fixing typos
- fixing punctuation
- correcting spacing
- renaming a heading without changing the meaning
- adding a link to an index
- adding tags or search keywords
- alphabetizing a list
- moving a file reference into a catalog
- formatting markdown
- making a sentence shorter while preserving the same claim
- adding a table of contents
- adding cross-links between already-existing files

These changes do not usually require a formal revision note, though they can still be mentioned in a changelog if useful.

## Gray zone

Some edits are small but still meaningful.

Use this test:

Would a reader make a different decision, trust the claim differently, understand the project differently, or build a different feature because of this edit?

If yes, label it.

If no, it is probably organization or cleanup.

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