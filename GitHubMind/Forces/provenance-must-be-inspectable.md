# Force — Provenance Must Be Inspectable

## Status

Public-safe force statement.

## Force

**Provenance that only exists inside the originating system fails at the handoff boundary.**

## Tension

The GitHub Mind has increasingly strong governance primitives. It can define source, claim, privacy, missingness, revision, authority, recovery, custody, and deployment boundaries.

But a recipient rarely sees the full internal architecture. They see a summary, file, image, memo, page, slide, note, export, answer, or care-adjacent record.

If the verification surface is absent, the artifact may look more certain, more official, more current, or more authoritative than it is.

## Operational rule

When an artifact leaves its original context, it should carry an inspectable verification surface.

Minimum force-carriers:

- What is being claimed?
- What is the source class?
- What is missing?
- Who has authority?
- What is the revision state?
- Is this original, derivative, summarized, exported, or superseded?
- Where can correction happen?

## Failure modes

- Provenance stripping: metadata or labels are removed during export.
- Authority inflation: a support artifact reads like a decision authority.
- Certainty inflation: a summary hides uncertainty.
- Revision blindness: old content is reused after being superseded.
- Source flattening: first-hand, second-hand, and synthetic material are presented as equivalent.
- Care distortion: AI-generated summaries enter review or care workflows without visible uncertainty or correction history.
- Surface mismatch: the technical record is accurate, but the human-facing artifact hides its boundaries.

## Design pressure

Mirror Cartographer should avoid building only deeper ledgers. It should also build surfaces that humans and downstream systems can actually read.

The visible artifact should not be pretty at the expense of truth. It should be beautiful because its boundaries are visible.

## Practical lane 1: income

This force supports a sellable service:

**Verification Surface Audit**

The audit reviews whether generated or transformed artifacts still expose enough provenance for safe reliance.

## Practical lane 2: medical and social-care

This force supports:

**Care Verification Surface Design**

A care-support summary should expose observation source, review status, correction history, uncertainty, and clinician-authority boundary at the point where it may shape communication.

## Source labels

- Runtime governance literature emphasizes audit evidence, runtime mediation, and control visibility.
- AI content provenance reporting emphasizes content credentials, watermarking, and the fragility of stripped metadata.
- Social-care AI reporting shows that AI-generated notes can distort records if not reviewed and bounded.
- Medical AI liability reporting shows that accountability must be clear when outputs influence decisions.

## Claim labels

- Claim: provenance must become inspectable at artifact surfaces, not remain only in internal ledgers.
- Confidence: high.
- Evidence maturity: emerging but cross-domain.
- Authority: design force, not legal, clinical, compliance, or financial authority.

## Privacy label

Public-safe.

## Missingness label

No automated verifier exists in this repository yet.

## Revision label

Revise when metadata tooling, claim IDs, and export verification are implemented.
