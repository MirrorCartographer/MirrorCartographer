# Care View Adapter Protocol

Source status: mixed synthesis from existing GitHub mind, File Library MC architecture packets, and fresh public research signals.
Claim status: design hypothesis, product requirement, and evaluation scaffold; not a clinical, veterinary, legal, or efficacy claim.
Privacy status: public-safe abstraction only. No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details are included.
Missingness: repository search remains imperfect; this pass used directly fetched public repository files, File Library snippets, and current public research. No private examples were published.
Revision reason: prior mind runs established permissioned views, ClaimBoundaryCompiler, One Record Five Doors, and Living ViewDiff. This pass adds an adapter layer for converting a private continuity record into a care-facing communication object without implying diagnosis, treatment, triage, or professional authority.

## Strongest attractor

Continuity.

The strongest current pattern is continuity across audiences: the same underlying meaning-state record may need a private view, a professional-facing view, a care-team view, a public-safe method view, and a research-safe aggregate view. The missing layer is the adapter that decides what survives each crossing.

## Core discovery

Mirror Cartographer needs a Care View Adapter.

A Care View Adapter is not a medical assistant. It is a bounded transformation layer that converts a private expressive continuity record into an observation-and-question packet suitable for a professional or care team.

It answers:

1. What is directly observed?
2. What is interpreted or symbolic?
3. What is missing?
4. What is time-sequenced?
5. What should be reviewed by a professional?
6. What must not be inferred from this record?
7. What did the transformation remove, abstract, or downgrade?

## Relation to existing MC mind

Existing public repository language already defines MC as a bounded symbolic reflection interface with source status, claim status, audit labels, health-adjacent boundary flags, evidence boundaries, and grounded next steps. The Care View Adapter extends that by making the professional-facing transformation explicit instead of leaving it as an informal summary.

Existing Living ViewDiff work says continuity is knowing what changed between views. The Care View Adapter supplies one specific high-stakes ViewDiff route: private expressive state to care-facing observation packet.

## Fresh external alignment

Public signals point in the same direction:

- AI transparency work increasingly treats provenance as architecture, not post-hoc labeling.
- Provenance and watermarking can conflict unless verification layers are audited together.
- AI literacy work emphasizes critical evaluation and validation rather than tool use alone.
- Health-data leaks show that even supposedly anonymized or partial health records can create re-identification risk when exposed publicly.
- Ambient clinical documentation adoption shows practical demand for summaries, but also consent, bias, privacy, and review concerns.

## Proposed adapter stages

### 1. Source separation

Separate the private record into categories:

- direct observation
- time marker
- intensity or frequency marker
- action already taken
- user-stated question
- symbolic expression
- interpretation
- missing evidence
- privacy-blocked material

### 2. Claim downgrade

Symbolic or interpretive material may only enter the care-facing view as:

- context phrase
- user-reported concern
- question to ask
- non-evidentiary pattern note

It must not become diagnosis, causality, treatment recommendation, or urgency classification.

### 3. Audience routing

Different audiences receive different views:

- personal private view: full expressive record, if user consents to persistence
- care helper view: task-support summary and observation checklist
- professional view: timeline, observations, questions, prior actions, missing data
- public method view: abstracted workflow only
- research-safe aggregate: category-level pattern without identity or raw content

### 4. ViewDiff attachment

Every care-facing output should attach a ViewDiff showing:

- preserved invariants
- removed categories
- changed claim types
- added constraints
- missing evidence
- revision reason
- permitted use

## Evaluation criteria

A Care View Adapter succeeds if:

1. The professional-facing packet is shorter than the private record but preserves the clinically or operationally relevant observation structure.
2. No private expressive detail is necessary to understand the public-safe method.
3. Every claim has a source and claim label.
4. Interpretive material is downgraded or quarantined.
5. The adapter surfaces missingness rather than filling gaps.
6. The user can see what was changed before sharing.
7. The output supports better communication without replacing judgment.

## Product implication

The next demo should use a fictional scenario and show:

Private expressive record
→ Care View Adapter
→ professional observation packet
→ ViewDiff proof strip
→ next-question checklist

The demo should be fictional, compact, visually legible, and explicitly non-diagnostic.

## Boundary

This protocol does not provide diagnosis, triage, treatment, prognosis, veterinary advice, mental health care, legal compliance, or emergency decision-making. Its public-safe claim is limited to structured communication, privacy-aware transformation, and evaluation of meaning-preserving summaries.