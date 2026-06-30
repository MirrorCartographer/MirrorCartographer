# Provenance Carry-Forward Ledger

## Primitive

A claim that survives reuse must carry its provenance with it.

## Purpose

The Provenance Carry-Forward Ledger is a public-safe Mirror Cartographer governance primitive for preserving source, claim, privacy, missingness, revision, and authority labels when an artifact is copied, summarized, exported, renamed, layered, or embedded inside another workflow.

The repository has accumulated strong primitives for assurance, reversibility, interruption, recovery, custody, deployment proof, governance state, and layer drift. The next reliability gap is not whether labels exist in the original artifact. The gap is whether those labels survive movement.

## Core rule

If an output is reused, its claim identity and boundary labels must move with it or the reuse must be marked as unverified derivative material.

## Ledger fields

- Original artifact path.
- Original claim ID or claim name.
- Source labels carried forward.
- Claim labels carried forward.
- Privacy labels carried forward.
- Missingness labels carried forward.
- Revision labels carried forward.
- Authority boundary carried forward.
- Derivative artifact path.
- Derivative transformation type.
- Transformation risk.
- Reviewer or automated check.
- Carry-forward status.
- Required repair action.

## Transformation types

- Direct copy.
- Summary.
- Plain-language explanation.
- Executive brief.
- Care-support summary.
- Product page.
- Governance report.
- Export package.
- External handoff.
- Missing-file recovery note.

## Carry-forward statuses

- Preserved: labels remain intact and equivalent.
- Compressed: labels are shortened but materially equivalent.
- Weakened: labels are present but less specific.
- Broken: labels are missing or conflict with the source artifact.
- Unknown: source artifact or original label set cannot be verified.

## Failure modes watched

- Source loss: cited evidence disappears during summarization.
- Claim inflation: bounded claim becomes stronger after reuse.
- Privacy thinning: privacy boundary is omitted in a public derivative.
- Missingness erasure: known gaps disappear.
- Revision break: outdated material is reused without status.
- Authority drift: design support is presented as legal, clinical, financial, or compliance authority.
- Path rot: a referenced artifact cannot be fetched at the stated path.

## Income lane

Service candidate: Provenance Carry-Forward Audit.

Use case: organizations using AI to create policies, product claims, risk reports, documentation, customer summaries, clinical-adjacent summaries, or executive briefs need proof that important labels survive reuse.

Deliverables:

- artifact lineage map;
- derivative claim table;
- label survival audit;
- broken-provenance register;
- repair language;
- public-safe evidence package.

## Medical and social-care lane

Support artifact: Care Provenance Carry-Forward Map.

Use case: patient, caregiver, clinician, administrative, and social-care summaries often transform the same observation into different formats. The map preserves whether an observation is reported, reviewed, uncertain, escalated, corrected, or superseded.

Boundary: this supports communication and continuity. It does not diagnose, treat, or replace clinician judgment.

## Source label

- Fresh source pattern: 2026 agentic AI governance research emphasizes runtime controls, identity, audit evidence, lifecycle management, and path-dependent governance.
- Fresh care pattern: 2026 healthcare and social-care AI reporting emphasizes documentation-support benefits alongside risks from hallucinated or poorly reviewed summaries.

## Claim label

- Claim: provenance must survive derivative reuse for governance labels to remain meaningful.
- Confidence: high for governance logic; medium-high for market demand.
- Evidence maturity: emerging but convergent.
- Authority: design primitive, not legal, clinical, financial, or compliance authority.

## Privacy label

Public-safe. No private health, household, financial, client, or personal records included.

## Missingness label

This primitive has not yet been implemented as an automated repository-wide checker. Current status is conceptual and manually enforceable.

## Revision label

Revise if:

- repository artifacts receive formal claim IDs;
- automated path and label checking is implemented;
- AI governance standards define formal provenance requirements for derivative summaries;
- care-summary regulations create stricter documentation lineage requirements.
