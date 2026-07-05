# Public-Safe Answer Provenance Compression

Date: 2026-07-05
Status: research note
Repository target: public Mirror Cartographer mind

## Core finding

Mirror Cartographer needs a Public-Safe Answer Provenance Compression layer: a way to show enough source-boundary and claim-lineage information for trust, debugging, and governance without exposing private source topology, raw transcript details, or identifying context.

Operating line: provenance should survive privacy protection, but it must survive as bounded structure rather than leaked memory.

## Source status

- Source class: private-context-derived architecture synthesis plus public-safe project artifact review.
- Public GitHub status: written as an abstract method note only.
- File/library status: available project artifacts describe MC as provenance-native cognition infrastructure, replayable reasoning, contradiction persistence, evaluator coordination, governance telemetry, symbolic state transitions, and consent-bounded state. Those source ideas are used here only at the architectural level.
- Saved-context status: used only to preserve continuity of prior research targets and product direction.
- Raw transcript status: not used, not quoted, not reproduced.
- Private UI/source repo status: not inspected for personal content in this note.

## Privacy status

Public-safe.

This note intentionally excludes personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details. It does not encode private examples, private symbol histories, private event sequences, personal names beyond the project/repository identity already public in the repository context, or recoverable user-specific source topology.

## Claim status

- Strong claim: MC needs answer-level provenance indicators that remain useful after redaction.
- Strong claim: full provenance is not always public-safe; provenance must be compressed, typed, and privacy-filtered before publication.
- Moderate claim: a compact provenance display can reduce overclaiming by separating what came from public docs, private architecture context, inference, implementation decision, and missing evidence.
- Open claim: the best compression schema should be tested against real user tasks and adversarial re-identification attempts before public demo use.

## Missingness

- No exhaustive raw chat archive was available for this note.
- No formal threat model has yet been applied to compressed provenance strings.
- No UI prototype has yet tested whether users understand compressed provenance labels.
- No automated evaluator yet verifies that answer provenance does not leak private source topology.

## Problem

MC research notes are increasingly public-safe because they abstract away private material. However, abstraction creates a second risk: once the private material is removed, future readers may not know why a note exists, what kind of evidence supports it, or whether it is a product requirement, research question, evaluation criterion, or speculative design idea.

The system therefore needs a middle layer between raw provenance and no provenance.

## Proposed layer

Public-Safe Answer Provenance Compression converts detailed internal source lineage into compact, non-identifying labels.

Each published answer or research note should be able to carry a small provenance capsule with these fields:

1. Source boundary
   - public_artifact
   - private_context_architecture_only
   - repo_state
   - external_source
   - model_inference
   - missing_source

2. Claim type
   - observed_requirement
   - derived_requirement
   - design_hypothesis
   - evaluation_criterion
   - implementation_plan
   - research_question
   - limitation

3. Evidence strength
   - source_bound
   - pattern_supported
   - inferred
   - speculative
   - blocked

4. Privacy class
   - public_safe
   - private_context_used_no_details
   - publication_blocked
   - requires_redaction_review

5. Revision reason
   - new_source
   - contradiction_found
   - privacy_risk_reduced
   - missingness_exposed
   - implementation_scope_changed
   - claim_promoted
   - claim_demoted

## Example public-safe provenance capsule

```yaml
provenance_capsule:
  source_boundary:
    - public_artifact
    - private_context_architecture_only
    - repo_state
  claim_type: derived_requirement
  evidence_strength: pattern_supported
  privacy_class: public_safe
  missingness:
    - no_raw_archive_exhaustive_parse
    - no_reidentification_red_team_yet
  revision_reason: missingness_exposed
```

## Product requirement

MC should expose answer provenance at the level of source class, claim class, privacy class, and missingness, not at the level of raw underlying private content.

A public-safe answer must be able to say:

- what kind of source informed it,
- what kind of claim it is making,
- how strong the claim is,
- what was deliberately excluded,
- what is still missing,
- why the answer changed from a prior version.

## Evaluation criteria

A provenance-compressed answer passes only if:

1. It does not expose private facts or reconstructable private source sequences.
2. It preserves enough source-boundary information for audit and revision.
3. It distinguishes observed requirements from inferred requirements.
4. It marks missing evidence in the same artifact as the claim.
5. It records meaningful revision reasons when a claim changes.
6. It remains understandable to non-developer readers.
7. It supports future automated checks.

## Failure modes

- Over-compression: labels become too vague to support audit.
- Under-compression: labels leak private source topology.
- False certainty: an inferred requirement is presented as directly observed.
- Privacy laundering: private context is transformed into a public sentence that still preserves identifying structure.
- Orphan claims: public-safe notes survive but no longer explain what product behavior they should change.
- Label drift: the same label is used differently across research notes.

## Implementation plan

1. Define a shared provenance capsule schema in the public repo.
2. Add capsule blocks to new public-safe research notes.
3. Backfill capsules into the most recent public-safe notes first.
4. Create a review checklist for each capsule field.
5. Add a simple static linter that flags missing fields.
6. Add adversarial review prompts that try to reconstruct private source topology from published capsules.
7. Add a promotion rule: no private-context-derived claim can become a public product requirement unless it has a public-safe capsule and explicit missingness.

## Research questions

- What is the minimum provenance label set that preserves audit value without leaking private source structure?
- Should source-boundary labels be visible to end users, maintainers only, or both?
- Can answer provenance compression become a UI element rather than only a markdown field?
- How should compressed provenance interact with consent revocation and section-level repair?
- What is the correct failure response when a claim is useful but its provenance cannot be made public-safe?

## Revision reason

This note follows the prior retrieval-audit/source-boundary work by moving from answer-time source display into compressed, reusable provenance metadata. The meaningful revision is narrowing from broad audit trail visibility to a smaller publication-safe capsule that can travel with answers, notes, demos, and evaluation artifacts.

## Next research target

Public-safe provenance capsule schema and linter rules.
