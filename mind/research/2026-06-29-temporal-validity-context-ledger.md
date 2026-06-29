# Temporal Validity Context Ledger

## Public-safe finding

Mirror Cartographer should treat context as time-bound, not merely relevant. A memory, symbol interpretation, prior preference, or product requirement can be semantically related to the current task while still being stale, superseded, contradicted, incomplete, or no longer permitted for use.

## Core claim

**Context can expire without becoming false.**

A prior source may remain historically true while becoming invalid for current interpretation, release, or action. MC therefore needs a Temporal Validity Context Ledger that records whether a source-shaped claim is current, historical, superseded, unresolved, or intentionally retired.

## Source status

- Internal/private context: used only to identify the architectural need for time-aware context handling. No private transcript, personal, household, health, animal-care, financial, location, relationship, credential, or raw source details are included.
- File Library source: implementation materials describe MC as a structured reflection system with explicit uncertainty boundaries, mode routing, resonance feedback, contradiction logs, trajectory nodes, and false-progress checks.
- GitHub source: public README frames MC as a bounded symbolic reflection interface with source status, claim status, evidence boundary, grounded next step, and user feedback loop.
- External research source: recent retrieval-memory research identifies stale-fact errors as a structural RAG failure and proposes temporal validity ledgers/supersession rules for evolving knowledge. Recent memory-agent research also treats memory retrieval as a trust boundary rather than a simple utility layer.

## Claim status

- Supported: MC already needs continuity, contradiction preservation, source labels, claim labels, and public compression before release.
- Supported by external research: similarity retrieval alone does not reliably distinguish current from superseded material when knowledge evolves.
- Inference: MC should apply temporal-validity handling not only to factual claims, but also to symbolic interpretations, user-confirmed associations, design requirements, and public-safe artifacts.
- Not claimed: this ledger proves subjective truth, diagnoses users, validates symbols as objective facts, or replaces external records.

## Privacy status

Public-safe. This note contains only abstracted architecture, method requirements, evaluation criteria, and source-boundary descriptions.

## Missingness

- No full repository tree was available through indexed search; known files and direct paths were used.
- File Library retrieval is chunk-based and not exhaustive.
- External research was available as public web/arXiv metadata and abstracts, not full replication.
- No production telemetry or user study evidence exists in this note.

## Revision reason

Previous MC mind runs focused on source boundary, claim transport, context admission, redaction fidelity, representational fidelity, and operationalization boundaries. This run adds the missing time axis: what happens when an admitted context was once valid but no longer should shape the present output.

## Product implication

Add a `TemporalValidityContextLedger` between Context Admission and Claim Transport.

The ledger should classify each influencing context item as:

- `current`: permitted to influence present output.
- `historical`: may explain lineage, but should not drive current recommendation.
- `superseded`: replaced by newer contradictory or corrective context.
- `contested`: actively disputed by user feedback or source conflict.
- `unknown_age`: usable only with a missingness warning.
- `retired_private`: known to the system but not admissible for public release or current generation.

## Minimal record fields

- `context_id`
- `source_boundary_class`
- `source_status`
- `claim_status`
- `privacy_status`
- `first_seen_at`
- `last_confirmed_at`
- `superseded_by`
- `temporal_validity_status`
- `allowed_use_now`
- `missingness_note`
- `revision_reason`

## Evaluation criteria

A valid MC output should pass these checks:

1. It does not treat old context as current merely because it is semantically similar.
2. It marks historically useful context as historical when appropriate.
3. It downgrades or blocks superseded context.
4. It preserves contradiction without collapsing it into certainty.
5. It separates symbolic recurrence from factual currency.
6. It labels unknown-age context as missingness.
7. It avoids publishing private source detail while preserving public-safe revision lineage.
8. It gives the user a contestability path when the system's time-state is wrong.

## Research questions

- How should MC decide that a symbolic association is stale without erasing continuity?
- What minimum timestamp and confirmation metadata must be attached to every trajectory node?
- Can a public artifact show that a claim was revised without revealing the private context that caused revision?
- Which context classes require explicit re-confirmation before influencing public release?
- How should MC distinguish `historically true`, `currently operative`, and `safe to publish`?

## Boundary phrase

**Memory is not a warehouse. It is a dated crossing.**
