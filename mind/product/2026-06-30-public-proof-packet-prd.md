# PRD — Public Proof Packet Layer

## Product name

Public Proof Packet Layer.

## Problem

Mirror Cartographer can produce privacy-safe public artifacts, but public safety alone does not prove that a claim is bounded, source-aware, or release-ready. A redacted artifact may still overclaim, hide missingness, collapse symbolic resonance into evidence, or imply implementation state that has not been verified.

## Goal

Attach a compact proof packet to every public-facing MC artifact so a reader can inspect claim type, source boundary, privacy transformation, missingness, evaluation status, and revision triggers without seeing private source material.

## Users

- public readers trying to understand what MC claims
- collaborators reviewing product/research artifacts
- evaluators checking safety and overclaiming
- maintainers deciding whether a release is public-safe
- future agents deciding what context may influence a new artifact

## User stories

1. As a public reader, I can see whether an artifact is implemented, proposed, speculative, or research-bound.
2. As a maintainer, I can publish an artifact without leaking private context.
3. As an evaluator, I can reject an artifact that is redacted but still overclaims.
4. As a future agent, I can tell whether prior context is admissible, quarantined, superseded, or missing.
5. As a collaborator, I can contest a claim using the packet's stated evidence and revision triggers.

## Functional requirements

- Provide a proof-packet template for public artifacts.
- Require source status, claim status, privacy status, missingness, revision reason, and release verdict.
- Support links to related ledgers: context admission, quarantine, lineage, contestability, compression loss, temporal validity, release scope, and revision provenance.
- Allow `pass_with_limits` verdicts when the artifact is useful but bounded.
- Prevent `pass` when private, health-adjacent, financial, legal, animal-care, household, location, relationship, credential, or raw transcript material is exposed.
- Preserve public usefulness while documenting what was intentionally excluded.

## Non-functional requirements

- Human-readable Markdown first.
- Machine-parseable enough for future automation.
- No dependency on raw private transcripts.
- Short enough to attach to normal GitHub docs.
- Conservative by default when source status or implementation status is uncertain.

## Release gates

A public artifact can be released only if:

1. Privacy status is `public_safe` or `abstracted_private_context`.
2. Claim status does not exceed the evidence class.
3. Missingness is explicit.
4. Revision triggers are defined.
5. No prohibited private categories appear.
6. Symbolic interpretation is not framed as proof.
7. Implementation claims are source-bound to repository state or a runnable artifact.

## Out of scope

- Automatic transcript redaction.
- Legal compliance certification.
- Medical, therapeutic, veterinary, financial, or emergency advice validation.
- Private source publication.

## Success metric

A reviewer can read an MC public artifact plus its packet and correctly answer:

- what is claimed,
- what is not claimed,
- what evidence supports it,
- what private source material was excluded,
- what remains missing,
- when the artifact must be revised.
