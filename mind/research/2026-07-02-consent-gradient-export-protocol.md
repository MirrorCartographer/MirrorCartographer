# Consent Gradient Export Protocol

Date: 2026-07-02
Status: Public-safe research increment
Repository lane: `mind/research`

## Core finding

Mirror Cartographer needs a **Consent Gradient Export Protocol**.

Operating line:

> A reflection is not export-ready until the system can show what consent layer each part crossed.

## Why this exists

Mirror Cartographer already treats private conversation, symbolic reflection, persistent memory, public explanation, and implementation planning as different lanes. The missing product requirement is a visible export rule that prevents a system from moving material directly from private context into public artifacts just because the material is useful, coherent, or compelling.

This protocol defines how MC should downgrade, transform, or block content before it becomes a public-facing artifact.

## Source status

- Source layer: mixed private-context architecture, file-library architecture packets, and GitHub repository state.
- File-library source status: artifact-backed but chunk-limited; not exhaustive.
- GitHub source status: repository was available and writable for this increment.
- Private-context status: used only to identify recurring architecture pressure, not copied into this file.
- External web status: not used in this increment.

## Claim status

- Claim type: product requirement and privacy architecture rule.
- Evidence level: architecture-derived; not user-study validated.
- Public claim allowed: yes, as abstract method.
- Public claim forbidden: any claim that depends on raw transcripts, personal examples, household examples, health examples, financial examples, relationship examples, credentials, locations, or private identity details.

## Privacy status

Public-safe.

This file intentionally contains no raw transcript excerpts, personal biography, household details, animal-care details, health details, financial details, relationship details, locations, credentials, private contact data, or identifying examples.

## Missingness

- No full raw-chat audit was performed in this increment.
- File retrieval is partial and cannot prove exhaustive coverage.
- Existing GitHub research files may be incomplete or not indexed by search.
- No automated privacy scanner was run against repository history.
- No user-facing consent UI exists in this file; this is a requirement specification.

## Revision reason

Previous MC mind increments established source boundaries, evidence lanes, memory classification, claim promotion, public-safe indexes, and withheld-evidence states. This increment adds the missing transition rule for **export movement**: how a private or mixed-source reflection becomes shareable without carrying private payload.

## Protocol

Every exportable MC artifact should be assembled from content units. Each unit receives a consent-gradient label before export.

### Consent-gradient labels

1. **Private raw**
   - Original user material or close paraphrase.
   - Export rule: blocked from public export.

2. **Private-derived pattern**
   - Abstracted structure inferred from private material.
   - Export rule: allowed only after removing identifying surface, concrete scenario, and sensitive domain payload.

3. **User-approved shareable**
   - Material explicitly approved for a specific audience or artifact.
   - Export rule: allowed only within approved scope.

4. **Public artifact-backed**
   - Material already present in public or intended-public project documents.
   - Export rule: allowed with source status and claim status.

5. **System requirement**
   - Product requirement distilled from private or mixed sources.
   - Export rule: allowed if written without private examples.

6. **Research question**
   - Open inquiry generated from observed architecture gaps.
   - Export rule: allowed if framed as unknown, not as proven finding.

7. **Evaluation criterion**
   - Testable standard for MC behavior.
   - Export rule: allowed if it does not reveal the private case that motivated it.

## Implementation requirements

MC should eventually maintain an export manifest for every artifact.

Minimum manifest fields:

- `artifact_id`
- `artifact_title`
- `created_at`
- `audience`
- `content_unit_id`
- `source_layer`
- `consent_gradient_label`
- `claim_status`
- `privacy_status`
- `transformation_applied`
- `missingness_note`
- `revision_reason`
- `export_decision`

## Evaluation criteria

A generated artifact passes this protocol only if:

- No private raw unit appears in public output.
- Private-derived patterns are abstracted into requirements, methods, tests, or research questions.
- Any source-backed public statement carries source status.
- Any uncertain claim is marked as inference, hypothesis, or open question.
- Missingness is visible rather than hidden.
- Revision reasons are preserved.
- The artifact remains useful after privacy removal.

## Failure modes

- Beautiful-public failure: the output sounds polished but silently contains private-derived specificity.
- Flattening failure: privacy removal erases the useful structure.
- Consent drift: material approved for one context gets reused in another.
- Authority drift: a symbolic reflection becomes a factual claim.
- Source laundering: private material is reframed as public insight without showing the transformation boundary.

## Product implication

MC should treat export as a compiler step, not a formatting step.

The export system should transform private working material into one of five public-safe object types:

- method
- requirement
- test
- research question
- implementation plan

## Next research question

How should MC display the consent-gradient manifest to a nontechnical user without making the interface feel legalistic or dead?