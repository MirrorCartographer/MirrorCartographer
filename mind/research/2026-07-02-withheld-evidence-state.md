# Withheld Evidence State Protocol

Date: 2026-07-02

## Core finding

Mirror Cartographer needs a **Withheld Evidence State Protocol**.

Operating line:

**“Evidence that cannot be shown is not the same as evidence that does not exist.”**

## Why this belongs in MC

MC already distinguishes public lanes, source status, claim status, evidence boundaries, and public/private boundaries. It also treats cognition as evolving state rather than disposable text. The next missing piece is a formal state for material that influences architecture or local reasoning but cannot be exposed, quoted, exported, or promoted into public proof.

Without this state, the system risks two opposite errors:

1. **Overexposure:** private, household, health, animal-care, financial, location, relationship, credential, or raw transcript details leak into public artifacts because they helped produce the architecture.
2. **False absence:** reviewers see a public-safe output and assume the private source basis was empty, invented, or unsupported because the evidence is intentionally not shown.

The correct public-safe treatment is neither exposure nor erasure. It is a labeled source state.

## Protocol definition

A source, claim, or requirement may be marked `withheld_evidence` when all of the following are true:

- the underlying material exists or was consulted in private-context form;
- the material is not safe or appropriate for public publication;
- the public artifact contains only abstraction, method, requirement, test, or implementation plan;
- the private material is not treated as public proof;
- the missingness is explicitly labeled rather than hidden.

## Required labels

Every item using this state should include:

- **source status:** private-context-informed, mixed-source-informed, file-backed, GitHub-backed, public-source-backed, or unsourced hypothesis;
- **claim status:** requirement, method, research question, evaluation criterion, product constraint, hypothesis, or verified implementation;
- **privacy status:** public-safe abstraction; private evidence withheld; no raw transcript exposed;
- **missingness:** what cannot be shown, what remains unverified, and what would be needed for public proof;
- **revision reason:** why the finding was created or changed.

## Claim rule

A withheld source may justify an internal requirement or design constraint, but it may not justify an external factual claim unless independently supported by public or shareable evidence.

Allowed:

- “MC needs a consent boundary for private-to-public distillation.”
- “This requirement was private-context-informed and public-safe.”
- “The evidence basis is withheld and cannot be used as public proof.”

Not allowed:

- “Private transcript evidence proves this public claim.”
- “A withheld source should be trusted because MC saw it.”
- “Personal material can be summarized closely enough that the person remains identifiable.”

## Product requirement

Add `withheld_evidence` as a first-class state in MC source metadata.

Recommended schema fields:

- `source_visibility`: public | private | mixed | withheld
- `evidence_role`: inspiration | requirement_basis | local_context | public_proof | excluded
- `publication_allowed`: yes | no | abstract_only | needs_review
- `claim_promotion_allowed`: yes | no | only_with_independent_evidence
- `redaction_reason`: privacy | safety | legal | consent | raw_transcript | identity_risk | irrelevant_detail
- `review_status`: pending | cleared | blocked | revised

## Evaluation criteria

A good implementation passes these tests:

1. A private-context-informed requirement can be published without exposing private facts.
2. A reviewer can see that evidence was withheld intentionally, not accidentally omitted.
3. The system prevents withheld evidence from being cited as public proof.
4. The public artifact still names its source boundary, claim status, privacy status, missingness, and revision reason.
5. A later reviewer can decide what independent evidence would be needed to promote the claim.

## Public-safe example

Finding: MC needs stronger public/private distillation.

- source status: private-context-informed plus file/GitHub architecture review
- claim status: product requirement
- privacy status: public-safe abstraction; underlying private material not exposed
- missingness: no public proof claim; implementation still needed
- revision reason: previous source, claim, memory, and export gates need a non-erasing label for evidence that exists but cannot be shown

## Research questions

- How should MC display withheld evidence without creating false authority?
- When should a withheld source be downgraded to `excluded` rather than used as a requirement basis?
- What independent proof is required before a withheld-evidence-derived insight can become a public claim?
- How should user correction override or narrow withheld evidence states?

## Privacy boundary

This note publishes only abstract architecture. It does not include personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.
