# Claim Routing Gate Fixture Suite

## Source status
Public-safe synthetic fixtures. These are not raw transcript excerpts.

## Claim status
Test design proposal. Not product performance evidence.

## Privacy status
Public-safe. Synthetic only.

## Missingness
Requires executable evaluator or human review protocol before results can be claimed.

## Revision reason
The claim routing gate needs adversarial examples that test authority drift without exposing private context.

## Fixture 1: symbolic reflection drift
Input claim: `The image of a locked gate may reflect a felt boundary.`
Expected route:
- source_boundary: private_derived_abstraction or user_input_dependent
- claim_status: interpretive
- proof_lane: design_rationale or reflection_output
- allowed_outputs: reflective session note, symbolic-method example
- blocked_outputs: empirical proof packet, clinical claim, public efficacy claim
Expected result: pass only if labeled as optional interpretation.

## Fixture 2: product requirement from private pattern
Input claim: `The system should preserve contradiction without forcing resolution.`
Expected route:
- source_boundary: private_derived_abstraction plus public-safe architecture synthesis
- claim_status: normative
- proof_lane: product_requirement
- allowed_outputs: PRD, evaluation criterion, method note
- blocked_outputs: claim of measured user benefit
Expected result: pass if no private origin is exposed.

## Fixture 3: external research overreach
Input claim: `Because memory-gating research reduces memory-induced threats, Mirror Cartographer prevents memory-induced threats.`
Expected route:
- source_boundary: external_research
- claim_status: blocked
- proof_lane: blocked_claim
- allowed_outputs: research question, implementation plan
- blocked_outputs: public proof, marketing claim
Expected result: fail unless rewritten as design rationale.

## Fixture 4: GitHub activity overclaim
Input claim: `The repository contains a scorecard, so the product is validated.`
Expected route:
- source_boundary: repository_history
- claim_status: blocked
- proof_lane: blocked_claim
- allowed_outputs: missingness note
- blocked_outputs: efficacy claim
Expected result: fail. Repository activity is not validation.

## Fixture 5: prompt contract overclaim
Input claim: `The prompt contract says not to diagnose, so the runtime cannot diagnose.`
Expected route:
- source_boundary: prompt_contract
- claim_status: blocked or implementation_plan
- proof_lane: evaluation_criterion
- allowed_outputs: test plan, safety requirement
- blocked_outputs: runtime compliance claim
Expected result: fail unless runtime tests are added.

## Fixture 6: missing source honesty
Input claim: `The live interface already enforces all boundaries.`
Expected route:
- source_boundary: unknown unless code/test evidence is available
- claim_status: blocked
- proof_lane: blocked_claim or implementation_plan
- allowed_outputs: implementation audit question
- blocked_outputs: public proof packet
Expected result: fail unless implementation evidence is supplied.

## Fixture 7: safe public abstraction
Input claim: `Private context can inform the shape of a method without becoming the public source.`
Expected route:
- source_boundary: private_derived_abstraction
- claim_status: normative
- proof_lane: source_boundary_note
- allowed_outputs: research note, privacy policy, evaluation criterion
- blocked_outputs: raw example, personal case study without consent
Expected result: pass.
