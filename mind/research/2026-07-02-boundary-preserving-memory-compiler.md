# Boundary-Preserving Memory Compiler

## Core finding

Mirror Cartographer needs a **Boundary-Preserving Memory Compiler**: a protocol that converts private, mixed-source, or session-local material into public-safe architectural memory without copying the originating details into the public artifact.

Operating line:

> Memory is useful only when the system can keep the pattern without carrying the private payload.

## Source status

- Source class: mixed architecture context, prior public-safe GitHub mind notes, remembered product requirements, and abstracted interaction patterns.
- Source boundary: private-context material was used only to infer architectural pressure, not as publishable evidence.
- Public source status: repository write target is public; therefore this note is intentionally abstracted.
- Transcript status: raw transcripts are not included, quoted, indexed, summarized by personal content, or exposed.

## Claim status

- Claim type: product architecture / memory-governance requirement.
- Claim strength: design requirement, not empirical proof.
- Evidence lane: internal architectural synthesis only.
- Promotion rule: this can become an implementation requirement after it is linked to tests, UI behavior, data model fields, and privacy review criteria.

## Privacy status

- Public-safe: yes.
- Contains personal details: no.
- Contains household, health, animal-care, financial, location, relationship, credential, or raw transcript detail: no.
- Re-identification risk: low, because the note describes a general system capability rather than a specific user event.
- Required redaction: all originating examples remain withheld.

## Missingness status

Missing before implementation:

1. A typed memory classification schema.
2. A compiler step that separates pattern, source boundary, claim authority, and publishability.
3. A test fixture showing that private examples can produce public requirements without leaking content.
4. A revision ledger field explaining why any private-origin signal was retained, weakened, generalized, or discarded.
5. A UI surface that tells the operator whether a memory is private-only, public-safe, exportable, or blocked.

## Product requirement

MC should not treat memory as a single bucket. Every candidate memory should pass through a compiler that emits a structured record:

- `pattern`: the abstract reusable insight.
- `origin_boundary`: where the signal came from, without exposing protected content.
- `allowed_surfaces`: private session, persistent profile, public index, GitHub mind, export, demo, or blocked.
- `claim_status`: felt signal, interpretation, requirement, research question, evidence-backed claim, or rejected claim.
- `privacy_status`: private, sensitive, public-safe, redacted, synthetic, or blocked.
- `missingness_status`: sufficient, partial, ambiguous, unverified, stale, withheld, or absent.
- `revision_reason`: why the record exists in its current form.

## Evaluation criteria

A Boundary-Preserving Memory Compiler passes if:

1. It can transform a private interaction pattern into a public-safe requirement without exposing the original interaction.
2. It refuses to publish identity-bearing, household, medical, animal-care, financial, location, relationship, credential, or raw transcript content.
3. It labels the authority level of the resulting claim.
4. It preserves enough source-boundary information to audit the route later.
5. It marks uncertainty and missingness instead of filling gaps with invented continuity.
6. It records revision reasons when a memory is weakened, generalized, merged, or blocked.

## Research questions

- What is the smallest memory unit MC can safely retain while still improving continuity?
- How should MC distinguish symbolic recurrence from evidence recurrence?
- When does a repeated private pattern become a public product requirement?
- What labels are needed so future agents can use the memory without overclaiming it?
- How can MC make withheld evidence visible as a boundary state without revealing the withheld content?

## Implementation plan

1. Define a `MemoryRecord` schema with explicit boundary, claim, privacy, missingness, and revision fields.
2. Add a compiler function that accepts raw/private context and returns only an abstracted record.
3. Add blocked-output tests using sensitive fixture categories.
4. Add public-safe export tests proving that no private payload survives compilation.
5. Add a GitHub mind writer that only accepts records marked `public-safe` and `architecture-level`.
6. Add a review command that prints why a record was accepted, generalized, or refused.

## Revision reason

This note extends prior MC public-safe governance work by focusing on the specific conversion step between private continuity and public architectural memory. The meaningful revision is from passive redaction to active compilation: not merely removing details, but producing a structured, reusable, privacy-bound memory artifact.
