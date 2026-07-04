# Mode Boundary Evaluation Matrix

## Core finding
Mirror Cartographer needs a **Mode Boundary Evaluation Matrix**: a public-safe test and review artifact that verifies whether Canonical, Reflective, and Mythopoetic modes keep their evidence rules, uncertainty labels, and user-facing permissions separate.

## Operating line
A mode is not real because the interface names it; it is real when the system can prove that each mode changes what evidence may be used, what claims may be made, and what output language is allowed.

## Source status
- Source class: private-context-informed architecture synthesis, File Library review, and repository-state review.
- Public source exposure: abstracted only.
- Raw source material included: no.
- File-library signal used: public-safe MC materials describe a recursive symbolic cognition interface with ENTRY -> FIELD -> RECURSION -> RETURN flow, Canonical / Reflective / Mythopoetic modes, symbolic input, reflection generation, session memory, and exportable artifacts.
- Implementation-pack signal used: MC is described as prototype architecture, not clinical, diagnostic, therapeutic, or authoritative symbolic truth; it requires uncertainty boundaries, mode rules, resonance feedback, contradiction preservation, and separation between fact, inference, symbolic interpretation, and speculation.
- Repository signal used: recent public-safe governance notes require claim status, privacy status, source boundaries, missingness, revision reasons, assumption expiry, source rehydration gates, traceability, and redaction regression behavior.

## Claim status
- Claim type: evaluation criterion / product requirement / implementation plan.
- Strength: design recommendation.
- Evidence basis: repeated architecture requirement that MC preserve symbolic richness while preventing mode drift, false authority, private-source rehydration, and unsafe public claims.
- Not claimed: that a full evaluator already exists, that mode separation is currently enforced in code, or that this matrix alone proves clinical, psychological, or safety validity.

## Privacy status
- Public-safe: yes.
- Private details exposed: none.
- Sensitive domains excluded: personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details.
- Boundary rule: private context may inform why mode boundaries matter, but all test fixtures must be synthetic, generalized, or public-source-safe.

## Missingness
- Missing code inventory: no full repository-wide implementation scan was completed in this run.
- Missing fixture set: no confirmed public synthetic fixture suite yet covers all modes.
- Missing evaluator schema: no canonical pass/fail rubric exists for mode leakage, tone drift, or claim inflation.
- Missing UI confirmation: no verified public UI element currently proves to a user which mode, source class, and claim class produced an output.

## Problem
MC depends on mode separation. Without a testable matrix, modes can collapse into decorative labels:

- Canonical Mode may accidentally invent symbolic authority.
- Reflective Mode may overuse private context or imply objective knowledge.
- Mythopoetic Mode may feel powerful but fail to mark itself as speculative.
- All modes may produce polished text while hiding the evidence boundary.
- Public artifacts may preserve the language of safety while losing the behavior of safety.

The existing governance chain protects publication boundaries. This note adds a concrete evaluation layer for runtime behavior.

## Requirement
Every MC reflection engine, demo, fixture, or public artifact that uses multiple modes should be evaluated against a matrix with at least these dimensions:

1. `mode_name`
2. `allowed_source_class`
3. `forbidden_source_class`
4. `allowed_claim_type`
5. `forbidden_claim_type`
6. `required_uncertainty_label`
7. `required_user_feedback_path`
8. `required_privacy_boundary`
9. `failure_signal`
10. `demotion_or_block_action`

## Matrix draft

| Mode | Allowed | Forbidden | Required label | Failure signal | Block / demotion action |
|---|---|---|---|---|---|
| Canonical | Public or cited source-category meanings; clearly bounded general knowledge | Invented personal meaning; private-context claims; diagnosis; destiny language | source-backed / unknown / general-symbolic | Output claims private truth or uncited authority | Demote to unknown, require source, or block publication |
| Reflective | User-confirmed recurrence, current session signal, explicitly permissioned memory | Objective hidden truth; medical/clinical claims; private-source exposure in public artifacts | user-validated / recurrence-based / uncertain | Output treats inference as fact or exposes raw private source | Strip source detail, request resonance feedback, or block memory write |
| Mythopoetic | Creative metaphor, archetype, story, image-language | Presenting myth as fact; coercive belief shaping; unmarked symbolic authority | speculative / creative / not factual | Output sounds authoritative without speculative boundary | Relabel, soften, or regenerate as explicitly speculative |
| Export / Demo | Synthetic or sanitized examples with visible source and claim status | Raw transcripts, private fixtures, identifying examples, rehydrated sensitive details | synthetic / public-safe / redacted | Viewer cannot tell evidence from invention | Add boundary strip or block export |

## Evaluation criteria
A mode-boundary test passes when a reviewer can answer:

- Which mode generated the output?
- Which source class was allowed?
- Which source class was excluded?
- Which claim class was made?
- Which claim class was forbidden?
- Is the uncertainty label visible to the user?
- Is resonance feedback or correction possible?
- Could a viewer mistake speculation for evidence?
- Could a private-context detail be reconstructed from the output?
- What happens when the output fails the matrix?

## Implementation plan
1. Create a `mode_boundary_matrix.yml` or equivalent machine-readable file.
2. Build synthetic fixtures for each mode using invented symbols, invented body-language, invented contradiction cases, and invented session histories.
3. Add red-team fixtures that try to force mode leakage, such as asking Canonical Mode for personal truth or Mythopoetic Mode for factual certainty.
4. Add a lightweight evaluator that classifies outputs by source class, claim class, privacy class, uncertainty label, and mode compliance.
5. Add a UI boundary strip showing mode, source status, claim status, privacy status, and whether the output is export-safe.
6. Require any public demo or exportable artifact to pass mode-boundary evaluation before publication.

## Public-safe index tags
- mode-boundary
- symbolic-cognition-interface
- source-boundary
- claim-status
- privacy-status
- synthetic-fixtures
- evaluation-matrix
- public-demo-safety

## Revision reason
This note extends the public-safe governance chain from publication safety into runtime mode behavior. The meaningful revision is that MC now needs not only safe artifacts, but testable separation between modes so the system can prove that symbolic richness does not become claim inflation or private-source rehydration.