# Revision Reason Ledger Protocol

## Core finding

Mirror Cartographer needs a Revision Reason Ledger.

## Operating line

**A changed reflection must carry its why, not only its after.**

## Public-safe source status

- Source class: public repository README plus privacy-bounded architecture memory from available MC files.
- Public source anchor: the public README already names source status, claim status, user correction, outcome feedback, and public/private boundaries as tracked system objects.
- Private-context use: used only to understand MC's architecture direction and recurring requirements; not used as publishable evidence.
- Raw transcript status: not included, not quoted, not summarized.

## Claim status

- Claim type: product requirement and governance method.
- Claim strength: architecture recommendation, not empirical validation.
- Evidence status: supported by existing MC requirement patterns around provenance, correction, uncertainty, public/private boundaries, and replayable continuity.
- Validation required: needs implementation test inside a reflection review workflow.

## Privacy status

Public-safe. This protocol contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail.

## Missingness

- No complete archive-wide audit was available in this run.
- Existing public files show the need for correction and source-status tracking, but do not yet define a normalized revision-reason taxonomy.
- No UI implementation is confirmed here.

## Revision reason taxonomy

Each meaningful change to a reflection, requirement, memory object, evidence note, or public export candidate should require one revision reason:

1. `user_correction` — user directly corrected wording, meaning, scope, tone, fact, or interpretation.
2. `source_upgrade` — stronger source became available.
3. `source_downgrade` — prior source became unavailable, weak, stale, private, ambiguous, or non-public.
4. `privacy_boundary` — content was removed or abstracted because it crossed public/private limits.
5. `claim_status_change` — statement moved between symbolic, speculative, hypothesis, supported, verified, rejected, or withheld.
6. `mode_mismatch` — prior output used the wrong interpretive mode or authority lane.
7. `missing_context` — prior output was incomplete because needed context was absent.
8. `overclaim_reduction` — wording was weakened to avoid unsupported authority.
9. `implementation_feedback` — product behavior showed a requirement needed revision.
10. `public_surface_clearance` — artifact was revised to make it safe and legible for outside readers.

## Required fields

For each revised object, MC should store:

- `object_id`
- `object_type`
- `previous_claim_status`
- `new_claim_status`
- `previous_privacy_status`
- `new_privacy_status`
- `source_status_before`
- `source_status_after`
- `revision_reason`
- `revision_summary_public_safe`
- `changed_by`
- `timestamp`
- `export_allowed`
- `missingness_note`

## Evaluation criteria

A revision passes if:

- the previous state remains inspectable;
- the revision reason is explicit;
- private evidence is not leaked into the public explanation;
- claim authority does not increase without a source-status upgrade;
- user correction has priority over system inference;
- public exports show only safe abstraction, not raw private substrate.

## Implementation plan

1. Add `revision_reason` as a required field to memory, reflection, evidence, and export candidate schemas.
2. Add a review step whenever claim status, privacy status, source status, or wording authority changes.
3. Expose a small public-safe revision note in exported artifacts.
4. Keep private source details in a sealed internal ledger, not in public files.
5. Add tests that fail when public artifacts contain changed claims without a revision reason.

## Research questions

- Which revision reasons should be user-visible by default?
- When should a revision reason be mandatory versus optional?
- How should MC distinguish a style edit from an authority-changing edit?
- Can revision logs improve user trust without making the interface feel bureaucratic?

## Meaningful revision reason for this file

Initial addition. Derived from repeated MC requirements for provenance, correction, source boundaries, claim status, missingness, and public-safe export discipline.