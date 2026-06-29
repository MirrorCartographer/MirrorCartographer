# Agency Fixture Validation Report Contract

Date: 2026-06-29
Status: durable architecture artifact
Privacy posture: public-safe; no private user material; all examples remain abstract.

## Architecture question

How should MC write the actual first JSON Schema file and validation report format so fixture failures produce useful reviewer feedback rather than cryptic schema errors?

## Finding

MC should use a two-contract pattern:

1. Fixture Schema Contract: validates whether a near-miss agency fixture contains the minimum observable evidence needed for deterministic checks and human review.
2. Validation Report Contract: converts raw schema/rule failure into repair receipts that explain what is missing, why it matters, what to fix, and what the validator is not allowed to decide.

The schema is a gate. The report is a translation layer. Neither one decides symbolic truth.

## Research basis

Current sources reviewed:

- JSON Schema Draft 2020-12 core specification: defines JSON Schema as a JSON-based format for describing structure, extracting information, and controlling interaction with JSON data. It also defines output formatting patterns including basic, detailed, and verbose results.
  Source: https://json-schema.org/draft/2020-12/json-schema-core

- JSON Schema Draft 2020-12 validation specification: warns that format validation varies by implementation and recommends treating some format checks as annotations unless full assertion support is explicitly declared.
  Source: https://json-schema.org/draft/2020-12/json-schema-validation

- W3C PROV overview: defines provenance as information about entities, activities, and people involved in producing data or things, supporting assessment of quality, reliability, and trustworthiness.
  Source: https://www.w3.org/TR/prov-overview/

- STRIDE-AI, 2026: argues that AI threat modeling needs explicit probabilistic trust boundaries and a structured assessment lifecycle connecting governance standards, threat modeling, testing, and reporting.
  Source: https://arxiv.org/abs/2605.17163

- OWASP-LLM defense attribution work, 2026: shows why aggregate pass/fail is weak; defenses should be attributed to the specific threat class they cover, with brittleness tested under paraphrase and mutation.
  Source: https://arxiv.org/abs/2606.02822

## Useful concepts extracted

### 1. Validation output should be human-facing, not only machine-facing

JSON Schema already distinguishes output structures. MC should not expose validator internals directly to reviewers. The report should translate failures into repair receipts.

Required repair receipt fields:

- location: where the failure occurred
- problem: what failed
- why_it_matters: why the fixture cannot support agency review yet
- suggested_repair: what to add or change
- authority_limit: what the validator cannot conclude

### 2. Use schema for evidence shape, not semantic authority

The fixture schema can require:

- public-safety level
- caution variant
- suspect variant
- delta statement
- agency-boundary type
- observable pressure signals
- tripwire candidates
- missing evidence
- reviewer prompt
- provenance

It must not decide:

- user intent
- symbolic truth
- emotional correctness
- whether a private person was actually influenced

### 3. Preserve thin-boundary disagreement

A valid fixture can still invite disagreement. For MC, disagreement around Caution vs Suspect is not automatically noise. It can indicate a real agency boundary.

The schema therefore supports:

- primary_expected
- acceptable_disagreement
- thin_boundary

### 4. Add provenance as a first-class object

Every fixture and validation report should include provenance fields. This supports auditability without exposing private reasoning.

Minimum provenance fields:

- created_by or validator_name
- source_basis or source_schema
- review_status or ruleset_version
- updated_at or generated_at

### 5. Separate schema failures from rule flags

Schema validation answers: is the fixture well-formed?

Deterministic rule checks answer: are observable agency-pressure tripwires present?

Reviewer adjudication answers: what label best fits this case?

Those layers must stay separate so the system does not create fake precision.

## Implementation added

Created two machine-readable schemas:

1. `mind/schemas/agency-near-miss-fixture.v1.schema.json`

Purpose: validates the fixture object for the first 20 public-safe near-miss agency scenarios.

2. `mind/schemas/agency-validation-report.v1.schema.json`

Purpose: validates reviewer-facing validation reports that translate raw failures into repair receipts.

## Design rule

Every validation failure should answer four reviewer questions:

1. What is missing or malformed?
2. Why does that weaken agency-boundary testing?
3. What concrete repair would make the fixture reviewable?
4. What should the validator refuse to conclude?

## Example repair receipt pattern

Location: `/deterministic_rule_inputs/observable_pressure_signals`

Problem: no observable pressure signal supplied.

Why it matters: without a visible signal, the fixture cannot distinguish Caution from Suspect through evidence.

Suggested repair: add one quoted or paraphrased signal showing whether choice was preserved, narrowed, rushed, or socially pressured.

Authority limit: this failure does not prove the scenario is manipulative; it only proves the fixture lacks enough evidence for review.

## Requirements update

MC architecture should now include an Agency Fixture Validation Layer with three outputs:

- machine validity: valid / invalid
- reviewer status: valid / valid_with_warnings / needs_repair / blocked
- repair receipts: structured human-readable guidance

Validation results should never be shown as raw JSON Schema error dumps in the UI. They should be translated into short receipts attached to the relevant fixture section.

## Next research question

How should MC run the first fixture through this schema and generate one real validation report, including one intentionally broken fixture, so the repair receipt pattern can be tested against actual failure cases?
