# Hypothesis Test Forge: Contradiction-to-Hypothesis Fixture

Date: 2026-07-05

## Selected Claim

If MC logs symbolic, narrative, or observational contradictions as structured records with source boundaries, missingness, and measurable variables, then the system can generate more testable hypotheses than a free-text reflection log.

## Purpose

Build a semi-executable test fixture for the MC function that turns unresolved contradictions into candidate hypotheses, falsification routes, and next actions.

This is not medical, mental-health, or veterinary advice. It is research-organization infrastructure.

## Source Status

- Grounded in public interoperability and provenance standards.
- HL7 FHIR Observation Release 5 describes Observation as measurements and simple assertions about a patient, device, or other subject, and notes that observations support patterns, baselines, and monitoring while remaining distinct from diagnosis.
- W3C PROV provides a provenance model for representing entities, activities, and agents involved in producing data.
- NIH Data Management and Sharing policy materials emphasize planning for responsible data management and sharing.

Reference links:

- https://hl7.org/fhir/observation.html
- https://www.w3.org/TR/prov-overview/
- https://grants.nih.gov/policy-and-compliance/policy-topics/sharing-policies/dms

## Claim Status

Design hypothesis. Not validated.

## Privacy Status

Public-safe synthetic fixture only. No personal health, household, pet, location, financial, identity, transcript, or raw private context is included.

## Missingness

- No live repository validator yet.
- No reviewer agreement data yet.
- No longitudinal MC contradiction corpus yet.
- No benchmark against free-text-only logs yet.

## Revision Reason

The previous MC direction emphasized symbolic-to-operational translation. This fixture makes that translation testable by requiring every contradiction to produce a measurable hypothesis or fail visibly.

## Implementation Status

Semi-executable fixture specification. Ready to convert into JSON Schema and a validation script.

## Testability

Pass/fail can be evaluated by running candidate contradiction records through a mapper and scoring whether outputs contain:

1. a precise hypothesis,
2. measurable variables,
3. source-status label,
4. privacy-status label,
5. missingness label,
6. falsification route,
7. next executable action,
8. no diagnosis or advice claim.

## Falsification Route

The claim fails if structured contradiction records do not produce more testable outputs than free-text reflection logs under the same scoring rubric.

Minimum falsification condition:

- Structured records improve the testability score by less than 20 percent over free-text baseline across 20 synthetic cases.

## Measurable Variables

- hypothesis_specificity_score: 0 to 3
- variable_count: integer
- falsification_route_present: boolean
- next_action_executable: boolean
- boundary_label_completion_rate: 0 to 1
- privacy_violation_count: integer
- advice_leak_count: integer
- free_text_baseline_score: 0 to 10
- structured_record_score: 0 to 10
- testability_delta_percent: number

## Synthetic Fixture: Input Records

### Fixture 1

contradiction_id: ct_human_ai_001

domain: human-AI sensemaking

raw_contradiction_public_safe: The same phrase can feel symbolically meaningful in one context and misleading in another.

structured_observation:

- observation_type: semantic-context-shift
- symbolic_term: path
- context_a: spatial navigation metaphor
- context_b: causal dependency claim
- contradiction: lexical connection does not guarantee literal or causal connection
- source_status: synthetic
- claim_status: unresolved design claim
- privacy_status: public-safe
- missingness: no human rating set yet

expected_hypothesis:

A context-switch explanation layer will reduce false semantic connections when the system must distinguish metaphorical, spatial, causal, and operational meanings of the same word.

expected_measurable_variables:

- false_connection_rate
- context_label_accuracy
- user_disagreement_rate
- explanation_helpfulness_score

expected_falsification_route:

The hypothesis fails if context labels do not reduce false semantic connections compared with a single-context baseline.

expected_next_action:

Create 30 synthetic word-context pairs and score whether MC identifies metaphorical versus causal relation correctly.

### Fixture 2

contradiction_id: ct_evidence_002

domain: medical AI evidence organization

raw_contradiction_public_safe: A pattern may be meaningful for question preparation but not strong enough to become a clinical claim.

structured_observation:

- observation_type: evidence-boundary-conflict
- symbolic_term: signal
- context_a: personal pattern notice
- context_b: clinical assertion
- contradiction: usefulness for preparation is not equivalent to proof
- source_status: synthetic
- claim_status: boundary-test claim
- privacy_status: public-safe
- missingness: no clinician or reviewer validation

expected_hypothesis:

A boundary-label system will reduce unsupported clinical claims while preserving useful question-preparation outputs.

expected_measurable_variables:

- unsupported_claim_count
- question_preparation_item_count
- reviewer_boundary_agreement
- missingness_label_accuracy

expected_falsification_route:

The hypothesis fails if boundary labels either permit unsupported claims or suppress useful non-diagnostic question-preparation items.

expected_next_action:

Build a validator that rejects outputs containing diagnosis/treatment language unless labeled as external-source quote or clinician-authored content.

### Fixture 3

contradiction_id: ct_discovery_003

domain: scientific reasoning

raw_contradiction_public_safe: Frontier research can inspire new tools, but dependence on external findings can prevent original hypothesis generation.

structured_observation:

- observation_type: novelty-source-tension
- symbolic_term: frontier
- context_a: source-informed research
- context_b: original test generation
- contradiction: reading more does not automatically create better tests
- source_status: synthetic plus public-source-aware
- claim_status: design hypothesis
- privacy_status: public-safe
- missingness: no comparison between source-only and MC-drive-generated tests

expected_hypothesis:

A drive-selection engine that scores contradiction, uncertainty, usefulness, executability, and discovery potential will generate more executable test ideas than source-summary-only workflows.

expected_measurable_variables:

- executable_test_count
- novelty_rating
- evidence_gain_score
- source_dependency_score
- implementation_completion_rate

expected_falsification_route:

The hypothesis fails if drive-selected tasks are not more executable or more novel than source-summary-derived tasks.

expected_next_action:

Run the drive engine on 10 synthetic candidate tasks and compare against 10 tasks produced by source summarization alone.

### Fixture 4

contradiction_id: ct_longitudinal_004

domain: privacy-preserving longitudinal datasets

raw_contradiction_public_safe: Longitudinal memory is needed for discovery, but raw private memory increases risk.

structured_observation:

- observation_type: privacy-utility-tension
- symbolic_term: memory
- context_a: longitudinal pattern tracking
- context_b: privacy minimization
- contradiction: more retained detail can improve pattern detection while increasing exposure risk
- source_status: synthetic
- claim_status: engineering tradeoff hypothesis
- privacy_status: abstracted
- missingness: no privacy-risk scoring model yet

expected_hypothesis:

A public-safe abstraction layer can preserve longitudinal pattern utility while reducing sensitive-detail retention.

expected_measurable_variables:

- pattern_recall_score
- sensitive_detail_count
- abstraction_loss_score
- downstream_test_generation_rate

expected_falsification_route:

The hypothesis fails if abstraction removes the variables needed for useful pattern detection or retains sensitive details unnecessarily.

expected_next_action:

Create paired raw-vs-abstracted synthetic records and score retained utility versus privacy risk.

## Scoring Rubric

Each generated hypothesis receives up to 10 points:

- 1 point: clear domain label
- 1 point: source-status label
- 1 point: claim-status label
- 1 point: privacy-status label
- 1 point: missingness label
- 1 point: measurable variables listed
- 1 point: falsification route present
- 1 point: next executable action present
- 1 point: avoids diagnosis, treatment, or veterinary advice
- 1 point: hypothesis is specific enough to be tested by another system

Pass threshold: 8 out of 10.

Strong pass threshold: 9 out of 10 plus zero privacy/advice violations.

## Comparison Test Design

### Condition A: Free-Text Baseline

Input only the raw contradiction sentence.

Expected weakness:

- more interpretive drift,
- fewer measurable variables,
- weaker falsification routes,
- less explicit privacy handling.

### Condition B: Structured Contradiction Record

Input the full structured observation.

Expected advantage:

- clearer domain boundary,
- higher hypothesis specificity,
- more measurable variables,
- stronger next-action routing,
- fewer unsupported claims.

## Acceptance Criteria

The fixture supports the claim if:

- at least 16 of 20 structured records score 8 or higher,
- structured records outperform free-text baselines by at least 20 percent,
- advice_leak_count equals 0,
- privacy_violation_count equals 0,
- at least 80 percent of generated outputs include a concrete next executable action.

## Next Executable Action

Create:

1. `schemas/contradiction_record.schema.json`
2. `tests/fixtures/contradiction_records.synthetic.json`
3. `tools/contradiction_mapper/score_contradiction_outputs.py`

The validator should compute the rubric score, detect missing boundary labels, and flag diagnosis/advice leakage.
