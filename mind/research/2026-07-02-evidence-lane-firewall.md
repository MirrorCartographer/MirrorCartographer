# Evidence Lane Firewall

## Core finding

Mirror Cartographer needs an **Evidence Lane Firewall**: a structural rule that allows symbolic, reflective, product, research, implementation, and governance lanes to inform one another without allowing claims to inherit proof they have not earned.

Operating line:

> Meaning may travel across lanes. Evidence may not cross without a passport.

## Why this belongs in the GitHub mind

Prior MC materials repeatedly describe the system as provenance-native cognition infrastructure, semantic continuity, contradiction persistence, replayable reasoning, governance telemetry, consent-bounded memory, public-safe export, and source-boundary preservation. The emerging gap is not only provenance capture; it is **proof-transfer prevention**.

A system can preserve source labels and still fail if users, evaluators, or downstream agents treat a resonant symbolic interpretation as though it were empirical evidence, product validation, medical/legal/financial authority, or verified implementation status. The firewall makes that failure mode explicit.

## Source status

- Source class: public-safe synthesis from available MC architecture files, saved context, and current GitHub-mind trajectory.
- Source boundary: private-context material was used only to understand architecture patterns and recurring design constraints.
- Public source posture: this note contains no raw transcript material and no personal, household, health, animal-care, financial, location, relationship, credential, or private identity details.
- GitHub status: written directly as an abstract method note.

## Claim status

- Claim type: product architecture / governance-method proposal.
- Claim strength: design hypothesis, not validated implementation.
- Evidence standard required before stronger claim: runnable schema, test cases, reviewer examples, export-gate behavior, and adversarial examples showing blocked proof-transfer.
- Non-claim: this does not assert that MC already enforces the firewall in production.

## Privacy status

- Public-safe: yes.
- Contains private details: no.
- Contains personal source content: no.
- Contains raw chat excerpts: no.
- Export eligibility: safe for public architecture repository.

## Missingness

The following remain missing or unverified:

1. Canonical runtime schema for lane labels.
2. Machine-readable proof-passport object.
3. UI affordance for showing lane transitions to users.
4. Regression tests that prevent cross-lane proof inheritance.
5. Examples of rejected transfers, such as symbolic resonance being blocked from becoming empirical proof.
6. Documentation showing how the firewall interacts with consent, public export, revision reasons, and mode handoff.

## Proposed object: Proof Passport

Every claim that moves from one lane to another should carry a small passport:

- `origin_lane`: where the claim was produced.
- `target_lane`: where the claim is being used.
- `claim_type`: reflective, symbolic, empirical, implementation, product, governance, legal, medical, financial, or unknown.
- `source_status`: user-provided, model-generated, file-derived, repository-derived, external-source-derived, mixed, or unknown.
- `proof_standard`: what would make the claim acceptable in the target lane.
- `current_support`: what support currently exists.
- `allowed_use`: inspiration, hypothesis, draft requirement, product criterion, public claim, implementation task, or blocked.
- `blocked_reason`: required when transfer is refused.
- `revision_reason`: required when transfer status changes.

## Firewall rules

1. Symbolic material may create hypotheses, interface language, and user-facing reflection options, but it cannot certify factual truth.
2. Reflective material may describe felt coherence, but it cannot become medical, legal, financial, or diagnostic authority.
3. Product requirements may originate from private interaction patterns only after abstraction and privacy clearing.
4. Implementation claims require repository evidence, tests, screenshots, logs, or deployed behavior.
5. Research claims require source citations and dated source review.
6. Public claims require claim-type labeling, privacy review, missingness disclosure, and revision history.
7. Governance claims require an inspectable custody chain: source, transformation, evaluator, confidence, and known limits.

## Evaluation criteria

A working Evidence Lane Firewall should pass these tests:

- **Symbolic-to-empirical block:** a meaningful metaphor cannot be exported as a factual claim without evidence.
- **Private-to-public abstraction:** private context can become a product requirement only after detail removal and source-boundary labeling.
- **Implementation proof check:** a planned feature cannot be described as built unless GitHub/deploy/test evidence exists.
- **Mode handoff visibility:** when a claim shifts from reflective to canonical mode, the UI must show the authority change.
- **Missingness preservation:** uncertain, absent, or unverified context remains visible rather than being smoothed into a confident narrative.
- **Revision accountability:** a claim upgrade or downgrade must include a reason.

## Implementation plan

1. Add `lane`, `claim_type`, `source_status`, `privacy_status`, `proof_standard`, `allowed_use`, and `revision_reason` fields to all public-facing MC notes and export packets.
2. Build a claim-transfer checker that compares `origin_lane` and `target_lane` before export.
3. Add UI labels for `reflection`, `hypothesis`, `requirement`, `verified implementation`, and `public claim`.
4. Create fixture examples of allowed and blocked transfers.
5. Add tests for accidental proof escalation.
6. Connect this object to the existing public export, consent, provenance, missingness, contradiction, and revision protocols.

## Revision reason

Added because the existing trajectory strongly protects provenance, consent, missingness, public export, revision reasons, mode handoff, and claim taxonomies, but still needs a specific anti-collapse mechanism for **evidence transfer between lanes**.
