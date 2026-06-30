# Claim Routing Gate

## Source status
- Public-safe synthesis from available Mirror Cartographer files, saved architectural context, and visible GitHub repository history.
- Private-context material was used only to identify architecture shape, not to publish personal examples, household details, health/animal-care details, finances, location, relationship material, credentials, or raw transcript content.
- Fresh external research consulted: 2026 work on trustworthy AI memory search, temporal validity in retrieval memory, privacy-preserving multi-agent memory, and ground-truth-preserving memory systems.

## Claim status
- Status: architecture-method proposal.
- Not a claim that Mirror Cartographer currently implements this gate in production.
- Not a clinical, psychological, legal, financial, or diagnostic claim.
- Not evidence that symbolic interpretation is objectively true.

## Privacy status
- Public-safe: yes.
- Contains no private transcript excerpts, personal cases, account data, animal-care details, household facts, medical records, financial details, location details, or relationship details.
- Uses abstract method language only.

## Missingness
- GitHub code search for the repository is not indexed, so implementation coverage cannot be asserted from code search.
- Available files include concept, prompt-contract, atlas, and continuity material, but not a complete verified runtime audit.
- External research is current as of 2026-06-30, but should be rechecked before public release.

## Meaningful revision reason
Previous mind layers established source status, privacy status, temporal validity, quarantine, contestability, distillation, compression loss, deployment boundary, evidence-before-belief, revision provenance, release scope, public proof packets, boundary stack, interpretation admissibility, and instruction-source collision. The next missing layer is routing: once a candidate claim survives those gates, the system still needs to know where the claim is allowed to go.

## Core finding
A claim is not safe because it is labeled. It is safe only when routed to the lane that matches its proof.

## Problem
Mirror Cartographer can produce many kinds of outputs: symbolic reflection, product requirement, research question, evaluation criterion, implementation plan, public description, private session note, and evidence summary. If a single claim can move between those lanes without reclassification, it can silently gain authority.

Example failure pattern:
1. A symbolic reflection is generated as an optional meaning.
2. The same sentence is reused in a product document.
3. Later it is cited as evidence that the system discovered a general law.

The privacy boundary may remain intact, yet the epistemic boundary fails.

## Claim routing gate
Every publishable claim should carry a routing label before release.

Required routing fields:
- `claim_id`: stable local identifier.
- `source_boundary`: public source, private-derived abstraction, external research, implementation observation, or unknown.
- `proof_lane`: design rationale, source-bound method, product requirement, evaluation criterion, research question, implementation plan, or blocked claim.
- `authority_level`: descriptive, interpretive, speculative, normative, empirical, or operational.
- `allowed_outputs`: where the claim may appear.
- `blocked_outputs`: where the claim may not appear.
- `upgrade_conditions`: what evidence would be required to move it into a stronger lane.
- `contestability_receipt`: how a reviewer can challenge the routing.

## Routing rules
1. Symbolic interpretation may enter reflection artifacts, but not evidence artifacts unless re-labeled as interpretation.
2. Private-derived abstraction may enter method artifacts, but not public proof unless the source is replaced by public evidence or the claim is framed as design rationale.
3. External research may support general design risk, but not claim product implementation.
4. GitHub commits may support repository activity, but not product efficacy.
5. Prompt contracts may support intended behavior, but not runtime compliance.
6. UX requirements may support product direction, but not completed capability.
7. Evaluation fixtures may support test design, but not benchmark performance.
8. Missing source status routes the claim to `research_question` or `blocked_claim`, not public proof.

## Public-safe index entry
- Finding name: Claim Routing Gate.
- Function: prevent safe-looking claims from gaining unauthorized authority through reuse.
- Boundary preserved: privacy, source, claim, proof, implementation, release, and contestability.
- Recommended artifact families: research note, schema, PRD, scorecard, fixture suite, attractor note.

## Evaluation question
When a claim is moved from one artifact type to another, does the system preserve or downgrade authority instead of silently upgrading it?

## Key phrase
Do not only ask whether a claim is true. Ask where it is allowed to stand.
