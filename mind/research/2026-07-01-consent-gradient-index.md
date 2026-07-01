# Consent Gradient Index

Date: 2026-07-01
Status: public-safe research note
Repository lane: mind / research

## Core finding

Mirror Cartographer needs a Consent Gradient Index: a typed index that records how a captured state, symbol, reflection, or derived requirement is allowed to move across privacy and publication boundaries.

## Operating line

Consent is not a switch. It is a gradient of allowed movement.

## Why this matters

Mirror Cartographer already treats inner-state material as structured symbolic context rather than disposable prompt text. That makes consent more complex than yes/no persistence. A symbol may be safe for private reflection, unsafe for cross-session memory, safe only as an abstract product requirement, or safe for public release only after transformation into a method.

The Consent Gradient Index prevents three failure modes:

1. Over-retention: carrying more private state forward than the system needs.
2. Over-publication: publishing a redacted fragment that still exposes a private source story.
3. Over-flattening: deleting useful architecture because the raw source is private.

## Source status

- Source class: mixed private-context-derived architecture, File Library artifacts, and GitHub repository context.
- Public repository status: MirrorCartographer/MirrorCartographer is available through the GitHub connector with write permission.
- Private UI repository status: MirrorCartographer/mirror-cartographer-ui exists but is private; no UI internals were quoted or exported here.
- File-library source pattern: MC artifacts describe symbolic-state intake, translation into operational variables, state graph continuity, consent controls, AI reflection, outputs, and mode separation.
- Transcript status: raw chat details were not used as publishable evidence.

## Claim status

- Public-safe claim: MC requires a consent model richer than binary save/delete.
- Product claim: Consent state should be indexed at object level and transformation level.
- Research claim: Needs evaluation against privacy leakage, user comprehension, revision traceability, and cross-session boundary drift.
- Not claimed: clinical efficacy, diagnostic value, safety guarantees, general user outcomes, or sentience/consciousness claims.

## Privacy status

Public-safe. This note contains only abstracted architecture, method requirements, and evaluation criteria. It intentionally excludes personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details.

## Missingness

- No audited user study proves users understand all gradient states.
- No complete implementation exists here for object-level consent tagging.
- No automated privacy classifier is specified yet.
- No adversarial leakage test has been run against transformed public outputs.
- No UI copy has been validated for comprehension or accessibility.

## Proposed index fields

Each MC state object should carry a consent packet with at least these fields:

- object_id: stable internal identifier.
- object_type: symbol, body-marker, metaphor, reflection, mode-output, memory, export, requirement, evaluation note, public method.
- source_lane: private session, saved profile, file artifact, GitHub note, public source, synthetic example.
- allowed_scope: immediate reflection, session memory, long-term profile, private export, team share, public abstraction, public release.
- transformation_required: none, redact, aggregate, synthesize, abstract-to-method, convert-to-requirement, convert-to-evaluation-criterion, exclude.
- prohibited_uses: diagnosis, identity inference, public quotation, raw transcript reconstruction, claim proof, model authority transfer.
- expiration_or_review: none, user-review-needed, time-review-needed, source-change-review, safety-review.
- revision_reason: new source, user correction, missingness discovered, privacy risk, claim downgrade, implementation change.
- current_claim_strength: observation, interpretation, requirement, hypothesis, validated behavior, blocked claim.

## Product requirement

Before MC persists, exports, publishes, or uses a state object for downstream inference, it should check the Consent Gradient Index and return one of five actions:

1. Allow as-is.
2. Allow only privately.
3. Transform before reuse.
4. Require user review.
5. Exclude and record the reason.

## Evaluation criteria

A working implementation should pass these tests:

- Boundary clarity test: a reviewer can tell why an object is private, public-safe, or excluded.
- Transformation survival test: the public artifact remains useful after all private source content is removed.
- Non-reconstruction test: public artifacts cannot reasonably reconstruct the private source story.
- Mode integrity test: symbolic, product, research, and safety outputs keep separate authority types.
- Revision trace test: every change in consent status records a meaningful reason.
- Accessibility test: consent choices are readable outside code-only formats and understandable without expert vocabulary.

## Research questions

1. What is the smallest consent vocabulary users can understand without losing meaningful control?
2. How should MC display consent as movement rather than a static checkbox?
3. When should a private symbol become a public method instead of being deleted?
4. What evidence is required before a repeated private pattern becomes a product requirement?
5. How can MC preserve continuity while avoiding hidden boundary debt?

## Implementation plan

Phase 1: Add consent packet schema to state objects.

Phase 2: Add boundary labels to all generated reflections and exports.

Phase 3: Add a transformation ledger whenever private material becomes public architecture.

Phase 4: Add automated pre-publication checks for prohibited categories and raw-source leakage.

Phase 5: Add user-facing review UI for disputed, high-risk, or ambiguous objects.

## Revision reason

Created because the existing public-safe MC mind now has separate notes for source boundaries, evidence lanes, provenance, revision, missingness, public claim typing, and mode handoff. The missing connective requirement is a consent index that governs object movement across all of those systems.
