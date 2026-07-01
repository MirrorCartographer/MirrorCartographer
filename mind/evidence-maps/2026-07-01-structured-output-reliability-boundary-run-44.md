# Evidence Map: Structured Output Reliability Boundary

Date: 2026-07-01
Run ID: Evidence Engine run 44
Claim ID: C-STRUCTURED-OUTPUT-RELIABILITY-01R
Status: Supported boundary requirement; Mirror Cartographer implementation unvalidated

## Claim tested

Weak claim / assumption:

> If Mirror Cartographer outputs are structured, schema-valid, or generated through a strict evidence-map template, then the resulting artifact is reliable evidence.

## Result

The claim is not supported as stated.

Structured output is evidence of **format control**. It is not, by itself, evidence of truth, semantic accuracy, completeness, user benefit, safety, or real-world reliability.

Mirror Cartographer should treat schema-valid evidence maps as **machine-readable containers requiring verification**, not as verified evidence objects.

## Source basis

Primary and high-quality sources reviewed:

1. NIST AI Risk Management Framework 1.0, January 2023
   URL: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

2. NIST AI RMF Generative AI Profile, NIST AI 600-1
   URL: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

3. OpenAI API documentation: Structured model outputs
   URL: https://developers.openai.com/api/docs/guides/structured-outputs

4. Geng et al., "Generating Structured Outputs from Language Models: Benchmark and Studies," 2025
   URL: https://arxiv.org/abs/2501.10868

5. Ray, "The Constraint Tax: Measuring Validity-Correctness Tradeoffs in Structured Outputs for Small Language Models," 2026
   URL: https://arxiv.org/abs/2605.26128

## Evidence found

### Supported facts

- OpenAI Structured Outputs are designed to make model responses adhere to a supplied JSON Schema. This is a format/schema-adherence guarantee, not a guarantee that the content is factually correct or safe.

- OpenAI documentation recommends creating and using evals to determine the structure that works best for the use case. This implies that the schema itself and resulting output behavior require empirical validation.

- NIST AI RMF defines trustworthy AI through multiple characteristics, including valid and reliable, safe, secure and resilient, accountable and transparent, explainable and interpretable, privacy enhanced, and fair with harmful bias managed. Format adherence covers only a small part of this broader trustworthiness surface.

- NIST identifies availability of reliable metrics, lifecycle stage differences, real-world operational differences, and inscrutability as AI risk-measurement challenges. A clean structured artifact does not remove those measurement problems.

- Structured-output research distinguishes syntactic/schema validity from answer accuracy, executable accuracy, quality, and task success. Recent work reports cases where hard schemas improve validity while reducing answer accuracy or increasing wrong-but-valid outputs.

### Inferences for Mirror Cartographer

- MC evidence-map templates likely improve consistency, auditability, searchability, and downstream automation.

- MC cannot treat template completion as claim validation unless every filled field is checked against source evidence and task-specific success criteria.

- MC should track a separate failure mode: "valid-looking evidence artifact with unsupported semantic content."

- A structured MC output can make weak evidence look more authoritative because neat format increases legibility without necessarily increasing truth.

## Boundary statement

Structured output can support:

- consistent fields,
- required metadata,
- easier parsing,
- easier audits,
- lower missing-key risk,
- better comparison across artifacts.

Structured output does **not** prove:

- the claim is true,
- the source supports the claim,
- the inference is valid,
- the artifact is complete,
- the user outcome is beneficial,
- the system is safe,
- the output generalizes to future cases.

## Claim-status update

Retire or downgrade any claim equivalent to:

> Structured evidence-map format makes the evidence reliable.

Replace with:

> Structured evidence-map format improves auditability and machine readability, but reliability requires separate source-support checks, semantic validation, task-success evaluation, and operational monitoring.

New status:

C-STRUCTURED-OUTPUT-RELIABILITY-01R: Supported boundary requirement; implementation unvalidated.

Confidence: Medium-high for the boundary principle. Low for current MC implementation compliance until audited.

## Evaluation criterion

An MC structured output is not evidence-valid unless it passes all five layers:

1. Schema validity
   - Required fields present.
   - Field types valid.
   - No unsupported hidden fields.

2. Source-support validity
   - Every factual claim points to a source.
   - The cited source actually supports the claim.
   - Direct facts are separated from interpretations.

3. Semantic validity
   - Field contents mean what the schema says they mean.
   - Confidence values are justified by evidence quality.
   - No inference is recorded as fact.

4. Task validity
   - The output helps answer the intended question.
   - The output does not merely look complete.
   - Success criteria were defined before scoring.

5. Operational validity
   - The artifact remains reviewable over time.
   - Stale claims are flagged.
   - Contradictions and superseding claims are linked.

## Falsification checklist

A structured MC artifact fails the reliability boundary if any item is true:

- It is valid JSON/Markdown but contains a factual claim with no source.
- It cites a source that does not support the specific claim.
- It labels an interpretation, resonance, or hypothesis as fact.
- It marks confidence higher than the evidence quality supports.
- It has required fields filled with generic filler rather than claim-specific content.
- It lacks a falsification condition.
- It cannot identify what evidence would change the status.
- It uses a clean template to hide uncertainty.
- It passes schema validation but fails human source-to-claim review.

## Test plan: STRUCTURED-OUTPUT-RELIABILITY-GATE-01

Sample:

- Select the 25 most recent evidence maps in the GitHub mind.

For each artifact, score separately:

1. Schema pass/fail
2. Source-support pass/fail
3. Fact/inference separation pass/fail
4. Confidence calibration pass/fail
5. Falsification condition pass/fail
6. Next-proof specificity pass/fail
7. Staleness/review-date pass/fail

Metrics to publish:

- Schema-valid rate
- Source-supported claim rate
- Unsupported factual-claim count
- Inference-as-fact count
- Wrong-valid-artifact rate
- Overconfident-status rate
- Missing-falsification-rate
- Evidence-map reliability score

Minimum acceptable gate:

- 100% schema-valid rate
- 95% source-supported claim rate
- 0 critical unsupported claims
- 0 therapy/medical/legal/job-fit overclaims
- 100% explicit fact/inference separation
- 100% explicit next-proof requirement

## Next proof needed

Run STRUCTURED-OUTPUT-RELIABILITY-GATE-01 across the 25 most recent GitHub mind evidence maps and publish a ledger showing where structured artifacts were valid containers versus actually verified evidence.

The strongest next proof is not another structured map. It is a source-to-claim audit demonstrating that structured maps survive adversarial review.
