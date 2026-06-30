# Boundary Stack Manifest

**Date:** 2026-06-30

## Core finding

A boundary layer that is not located inside a stack becomes hard to test, hard to explain, and easy to bypass.

Mirror Cartographer now needs a public-safe Boundary Stack Manifest: a map of how its source, memory, claim, privacy, temporal, release, and feedback boundaries compose before any output is treated as publishable, reusable, or product-valid.

## Source status

- Public repository surface reviewed: `MirrorCartographer/MirrorCartographer`.
- Public README reviewed for current product/boundary claims.
- Recent repository commit history reviewed for prior boundary-layer additions.
- File Library context reviewed only as architecture context.
- Saved/private context used only for orientation and not quoted.
- Fresh external research reviewed for memory trust-boundary fit.

## Claim status

- **Supported:** Mirror Cartographer publicly frames itself as a bounded symbolic reflection interface, not a therapy product, diagnostic authority, medical tool, oracle, source database, or objective truth engine.
- **Supported:** Public README already lists source status, claim status, audit/overreach labels, health-adjacent boundary flags, evidence boundary, update hook, and user feedback loop.
- **Supported:** Recent public repo commits show multiple boundary modules added in sequence, including release scope, revision provenance, and public proof packet work.
- **Design inference:** The growing number of boundary modules now creates a second-order need: a manifest that tells future readers and implementers what order the gates run in, what each gate is allowed to decide, and which claims remain out of scope.

## Privacy status

Public-safe. This note contains no raw transcript details, personal identifiers, household details, health facts, animal-care details, financial facts, location details, relationship details, credentials, or private source text.

## Missingness

- Code search for this repository is not indexed, so file-level completeness cannot be inferred from search results alone.
- Private UI repository was identified but not inspected for private details.
- This note does not prove implementation behavior; it defines a public-safe research and architecture need.
- No claim is made that all prior boundary artifacts are complete, consistent, or wired into runtime.

## Meaningful revision reason

Earlier MC mind increments created individual gates: context admission, quarantine, temporal validity, lineage, contestability, distillation, compression loss, deployment boundary, evidence-before-belief, revision provenance, release scope, and public proof packet. The revision need is now compositional: MC needs a way to prevent boundary artifacts from fragmenting into a library of slogans.

## Boundary stack proposal

The stack should be evaluated in this order:

1. **Source Admission** — decide whether a context source may influence the run.
2. **Privacy Quarantine** — remove or isolate protected/private material before abstraction.
3. **Temporal Validity** — label whether remembered context is current, historical, superseded, contested, unknown-age, or retired-private.
4. **Context Lineage** — preserve the transformation path from source category to public-safe claim.
5. **Evidence Before Belief** — require support status before the system accepts a claim as stable.
6. **Operationalization Boundary** — separate orienting meaning from authoritative instruction.
7. **Release Scope** — decide what the remaining artifact is allowed to become.
8. **Public Proof Packet** — package only the testable public claim, not the private path.
9. **Contestability Receipt** — expose how a public claim can be challenged, corrected, or retired.
10. **Compression Loss Ledger** — state what was lost or weakened during safe abstraction.
11. **Revision Provenance** — record why the public artifact changed without exposing the private correction.
12. **Deployment Boundary** — distinguish repo presence, demo existence, implementation readiness, and public validity.

## Public-safe system principle

Do not only label every claim. Locate every label inside the stack that gave it permission to exist.

## Research questions

1. Which gates must run before generation, and which can run after drafting?
2. Which labels should be machine-readable in every artifact?
3. Which failures require blocking publication versus adding a missingness label?
4. How should the UI display stacked boundaries without making reflection feel bureaucratic?
5. How can MC preserve symbolic resonance while preventing false proof-transfer?

## Evaluation criteria

A public artifact passes the Boundary Stack Manifest check only if it:

- names the source class without exposing private source content;
- states claim status;
- states privacy status;
- states temporal status where memory/context is involved;
- states missingness;
- states release scope;
- contains no protected personal details;
- distinguishes evidence, inference, symbolic interpretation, speculation, and product plan;
- includes a contestability path;
- gives a revision reason if it modifies prior framing;
- does not imply that redaction alone creates public validity.

## Implementation plan

- Add a machine-readable `boundary_stack_version` field to all future mind records.
- Add a required `gate_results` array listing each gate, verdict, label, and failure mode.
- Add a release blocker when private material is removed but the remaining public claim still overreaches.
- Add a public-facing short label set for UI: `source`, `claim`, `privacy`, `time`, `scope`, `contestability`.
- Add evaluator fixtures where artifacts are redacted but still invalid because they overclaim.

## Attractor phrase

**A boundary is not a sticker. It is a stack.**
