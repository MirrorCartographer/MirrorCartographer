# Evidence Map Run 26 — Source Provenance and Traceability Boundary

Date: 2026-06-30
Status: evidence-governance requirement; implementation unvalidated
Claim ID: C-SOURCE-PROVENANCE-01R
Related areas: Evidence Engine, Mirror Cartographer GitHub mind, proof film, evidence maps, claim registry

## Claim tested

Weak claim / assumption:

> AI-generated evidence maps and proof-film summaries can count as strong audit evidence when they cite credible sources, even if the repository does not preserve enough provenance to reconstruct how the claim, sources, inference, and confidence update were produced.

## Result

The stronger, safer claim is:

> MC evidence artifacts may use AI-generated synthesis only as an audit interface. They should not be treated as strong evidence unless each claim preserves source provenance, inference provenance, versioning, and confidence-change rationale sufficient for later reconstruction and challenge.

This is a governance requirement. It does not prove that the current GitHub mind already satisfies the requirement.

## Evidence reviewed

### 1. W3C PROV

Type: primary technical standard family

Relevant fact:

- W3C PROV defines provenance as information about entities, activities, and people involved in producing data or a thing, usable for assessments of quality, reliability, and trustworthiness.
- PROV supports attribution, processing steps, provenance of provenance, reproducibility, versioning, procedures, and derivation.

Implication for MC:

- An evidence map should not only cite a source. It should preserve enough information about the entity, activity, agent, derivation, and version history to let another reviewer reconstruct the artifact's origin.

Source: https://www.w3.org/TR/prov-overview/

### 2. NIST AI Risk Management Framework

Type: government AI risk-management framework

Relevant fact:

- NIST AI RMF frames trustworthy AI as requiring lifecycle risk management, documentation, evaluation, and governance rather than one-time assertions of trust.

Implication for MC:

- A GitHub mind claim should not gain confidence merely because a generated map sounds coherent. It needs a lifecycle record: claim origin, evidence used, scoring rule, reviewer/auditor action, failure cases, and residual uncertainty.

Source: https://www.nist.gov/itl/ai-risk-management-framework

### 3. OECD AI Principles

Type: intergovernmental AI governance standard

Relevant fact:

- OECD AI Principles promote trustworthy AI and explicitly include transparency, explainability, robustness, safety, and accountability as values-based principles.
- OECD defines AI systems as machine-based systems that infer outputs from inputs and may influence physical or virtual environments.

Implication for MC:

- MC evidence outputs are AI-mediated inferences. Their transparency requirement should include not only final text, but what inference step transformed source evidence into claim status.

Source: https://oecd.ai/en/ai-principles

### 4. ISO/IEC 42001:2023 overview

Type: international AI management-system standard overview

Relevant fact:

- ISO/IEC 42001 is an AI management-system standard for establishing, maintaining, and continually improving AI governance.
- ISO's public overview identifies traceability, transparency, and reliability as benefits and frames the standard as managing AI-related risks and opportunities through structured governance.

Implication for MC:

- The GitHub mind should treat traceability as a system property, not as decorative citation. Evidence maps need repeatable structure and update discipline.

Source: https://www.iso.org/standard/42001

## Fact / inference separation

Facts supported by sources:

1. Provenance is specifically about the entities, activities, and people involved in producing data or artifacts, and can support assessments of quality, reliability, and trustworthiness.
2. Provenance frameworks include attribution, derivation, versioning, reproducibility, procedures, and provenance of provenance.
3. Major AI governance frameworks emphasize transparency, accountability, lifecycle risk management, and documented governance.
4. ISO's public overview of ISO/IEC 42001 connects AI management systems with traceability, transparency, reliability, and ongoing risk management.

Inferences for MC:

1. A citation-only evidence map is not enough for high-confidence audit use.
2. AI-generated synthesis should be treated as an interface over evidence, not as evidence by itself.
3. Claim-status updates should preserve the reason for movement, including what evidence changed, what inference was made, and what uncertainty remains.
4. Proof-film artifacts should expose provenance chains rather than compress them into persuasive narrative.

Not proven:

1. That MC currently maintains sufficient provenance across all evidence artifacts.
2. That adding provenance fields will improve reviewer accuracy.
3. That MC's current GitHub structure satisfies W3C PROV, NIST AI RMF, OECD, or ISO/IEC 42001 requirements.
4. That AI-generated maps are reliable without independent review.

## Claim-status update

Previous implied claim:

> C-SOURCE-PROVENANCE-01: Source-cited AI evidence maps are strong audit evidence.

Retired.

Replacement claim:

> C-SOURCE-PROVENANCE-01R: Source-cited AI evidence maps are only audit-interface artifacts unless they preserve enough provenance to reconstruct source selection, inference steps, versioning, confidence movement, and residual uncertainty.

Current status:

Supported evidence-governance requirement; implementation unvalidated.

Confidence:

Moderate for the governance requirement. Low for current MC implementation compliance.

## New evaluation criterion

Criterion ID: PROVENANCE-TRACE-CRITERION-01

An MC evidence artifact may support a confidence upgrade only if it includes all of the following:

1. Claim text before update.
2. Claim text after update, if changed.
3. Source list with source type: primary, regulatory, peer-reviewed, standards body, high-quality secondary, or weak/uncertain.
4. Evidence role per source: supports, constrains, contradicts, background only, or method source.
5. Inference step: what was concluded from the source, stated separately from source fact.
6. Confidence movement: no change, downgrade, upgrade, retire, replace, or split.
7. Reason for confidence movement.
8. Known missing evidence.
9. Falsification condition.
10. Next proof needed.
11. Artifact version/date.
12. Authoring mode: AI-generated, human-authored, co-authored, independently reviewed, or unreviewed.

Failure rule:

If any of items 1, 3, 5, 6, 8, 9, or 12 are missing, the artifact may not be used for a confidence upgrade. It may only be used as a hypothesis-generating note or audit-interface draft.

## Falsification checklist

A future audit should downgrade C-SOURCE-PROVENANCE-01R if:

- Reviewers can accurately reconstruct claim status and evidence lineage from existing maps without added provenance fields.
- Citation-only maps perform as well as provenance-rich maps in seeded-error detection and confidence calibration.
- Provenance fields add review burden without improving error detection, reproducibility, or confidence calibration.
- A better standard or empirical result shows a lighter structure is sufficient for the intended MC use.

## Test plan

Test ID: PROVENANCE-TRACE-GATE-01

Purpose:

Determine whether provenance-rich evidence maps improve audit quality compared with citation-only evidence maps.

Materials:

- 10 existing Evidence Engine maps.
- 10 transformed versions using PROVENANCE-TRACE-CRITERION-01.
- Seeded defects in both sets: unsupported inference, stale source, source-role mismatch, confidence overclaim, missing contradiction.

Method:

1. Give reviewers citation-only versions and provenance-rich versions in counterbalanced order.
2. Ask reviewers to identify unsupported claims, source-role errors, confidence overclaims, and missing next-proof requirements.
3. Measure detection accuracy, false positives, review time, confidence calibration, and reviewer explanation quality.

Pass threshold:

- Provenance-rich maps detect at least 20 percent more seeded defects without increasing false positives by more than 10 percent.
- Reviewers show better confidence calibration: fewer high-confidence ratings on defective artifacts.
- At least 80 percent of confidence movements are reconstructable from the artifact alone.

Downgrade rule:

If provenance-rich maps do not improve audit accuracy or calibration, do not require the full criterion for all maps. Replace with a lighter traceability standard.

## Next proof needed

Run PROVENANCE-TRACE-GATE-01 on the last 10 Evidence Engine maps. Publish a traceability ledger listing which maps can currently support confidence updates and which must be downgraded to hypothesis-generating notes.
