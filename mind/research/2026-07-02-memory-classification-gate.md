# Memory Classification Gate

## Core finding

Mirror Cartographer needs a **Memory Classification Gate**.

## Operating line

**A signal is not memory until MC can say what kind of memory it is allowed to become.**

## Public-safe architecture claim

MC already treats meaning as trajectory, contradiction, provenance, source boundary, consent state, and revision state. The next architectural requirement is a gate that classifies every captured signal before it can persist, influence later interpretation, appear in an export, or be reused as evidence.

This is not a user-detail feature. It is a custody rule for interpretive systems that handle sensitive symbolic, emotional, embodied, or contextual material.

## Source status

- **Available file context:** Public-facing MC materials describe provenance-aware memory, replayable reasoning, contradiction persistence, evaluator coordination, semantic state transitions, consent-bounded state, export paths, and privacy architecture needs.
- **Saved context:** Used only to understand the continuing MC architecture direction and prior public-safe research chain.
- **GitHub context:** Prior mind additions indicate a developing boundary stack around source status, claim status, missingness, consent, provenance, revision, export, mode handoff, and evidence-lane separation.
- **Private conversational context:** Used only as architecture background. No raw transcript content or private user facts are included here.

## Claim status

- **Strong architectural inference:** If MC preserves meaning across time, the system needs a pre-persistence classifier that declares what a signal may become.
- **Not yet implemented claim:** This document does not assert that the gate already exists in product code.
- **Not a clinical, financial, legal, or identity claim:** This is an information-architecture and governance requirement.

## Privacy status

Public-safe. This note contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.

## Missingness

- No confirmed implementation audit of current UI/backend storage behavior in this run.
- No formal schema found for memory classes.
- No automated test suite found for memory classification, export eligibility, or downstream influence permissions.
- No public user-study evidence yet validating whether users understand or trust these classifications.

## Proposed memory classes

1. **Ephemeral signal**
   - May shape the current response only.
   - Must not persist.
   - Must not influence later sessions.

2. **Session-local state**
   - May persist only inside the active session.
   - Must expire or be explicitly cleared.
   - Must not become profile memory without consent.

3. **Private continuity memory**
   - May support future interpretation for the same user.
   - Must remain private by default.
   - Must include source, consent, revision, and deletion handles.

4. **Public-safe abstraction**
   - May inform public architecture, requirements, evaluation criteria, or implementation plans.
   - Must remove private specifics.
   - Must label claim type and source boundary.

5. **Evidence artifact**
   - May support public claims only if source permission, evidence type, and citation boundary are explicit.
   - Must not be silently inferred from private continuity material.

6. **Blocked memory**
   - Must not persist, export, or guide later interpretation.
   - Used when source status, consent, safety, or privacy boundary is insufficient.

## Product requirement

Every MC capture event should produce a memory classification packet before storage or reuse:

- `signal_id`
- `source_status`
- `privacy_status`
- `claim_status`
- `consent_scope`
- `allowed_memory_class`
- `allowed_downstream_uses`
- `blocked_downstream_uses`
- `revision_reason_required`
- `expiration_or_review_rule`
- `export_eligibility`
- `evidence_eligibility`
- `deletion_handle`

## Evaluation criteria

A Memory Classification Gate passes only if MC can answer these questions for any retained signal:

1. What kind of memory is this?
2. Who or what allowed it to become that kind of memory?
3. What can it influence?
4. What can it never influence?
5. Can it appear in public output?
6. Can it be used as evidence?
7. What would require reclassification?
8. How can it be deleted, downgraded, or contested?

## Research questions

- How should MC distinguish symbolic continuity from evidence continuity?
- What interface makes memory classification visible without overwhelming the user?
- What default class should ambiguous signals receive?
- How should contradiction affect memory class?
- When a reflection is rejected, should the rejection persist as boundary evidence while the rejected content expires?
- Can public-safe abstractions be generated automatically without leaking private particulars?

## Implementation plan

1. Add a memory classification schema to the MC architecture docs.
2. Add a small runtime classifier that defaults ambiguous items to the least-permissive class.
3. Attach classification metadata to every saved reflection, symbol, contradiction, export, and revision event.
4. Add UI labels for memory class and allowed downstream use.
5. Add tests proving blocked classes cannot appear in export or evidence lanes.
6. Add a reclassification workflow for user contestation, mode handoff, source correction, and privacy downgrade.

## Revision reason

Added because the existing MC boundary stack defines source, consent, provenance, revision, missingness, public export, and evidence-lane controls, but still needs a named gate that decides what a captured signal is allowed to become before it persists or influences later interpretation.
