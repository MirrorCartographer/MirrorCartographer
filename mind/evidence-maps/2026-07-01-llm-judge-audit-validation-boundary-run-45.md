# Evidence Map — LLM Judge Audit Validation Boundary

Date: 2026-07-01
Run: Evidence Engine 45
Claim ID: C-LLM-JUDGE-AUDIT-VALIDATION-01R
Status: Supported evaluation-governance boundary; implementation unvalidated

## Claim Tested

Weak claim: Automated LLM-as-judge audits can validate Mirror Cartographer / GitHub mind evidence maps.

Revised claim: Automated LLM-as-judge audits may support triage, regression detection, and structured review, but they do not by themselves validate evidence-map truth, source support, risk status, or repository trustworthiness.

## Why This Claim Needed Testing

Recent Evidence Engine outputs repeatedly propose gates that audit prior maps. That creates a second-order risk: the repository may start treating automated audit output as proof. If the judge is another language model, the evaluation pipeline can inherit the same failure modes it is meant to detect: unsupported inference, source misreading, prompt sensitivity, overconfident scoring, and schema-valid but semantically wrong judgments.

## Sources Reviewed

1. NIST AI Risk Management Framework 1.0, January 2023.
   URL: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

2. NIST Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile, NIST AI 600-1.
   URL: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

3. OpenAI API documentation: Working with evals.
   URL: https://developers.openai.com/api/docs/guides/evals

## Evidence Found

### Fact: AI trustworthiness evaluation requires documented test conditions and methodology.

NIST AI RMF states that accuracy measurement should use clearly defined and realistic test sets representative of expected-use conditions, with test methodology documented. It also states that deployed validity and reliability are often assessed through ongoing testing or monitoring.

Implication for MC: an LLM judge score is not enough unless the audit includes the test set, criteria, expected-use context, methodology, and monitoring plan.

### Fact: Metrics can be oversimplified, gamed, and context-blind.

NIST AI RMF warns that measurement approaches can be oversimplified, gamed, lack critical nuance, become relied upon unexpectedly, or fail to account for affected-group and context differences.

Implication for MC: a neat audit score may create false confidence if it compresses symbolic, emotional, evidentiary, and governance questions into one pass/fail label.

### Fact: NIST expects rigorous TEVV, uncertainty reporting, benchmark comparisons, documentation, and independent review.

NIST AI RMF describes testing, evaluation, verification, and validation processes that include metrics, methodologies, uncertainty, benchmark comparison, formal reporting, and independent review to mitigate bias and conflicts of interest.

Implication for MC: LLM judge audits should be treated as one measurement channel, not the final validator.

### Fact: NIST GAI Profile calls for provenance, versioning, human oversight roles, fact-checking, and multiple evaluation methods.

NIST AI 600-1 recommends that GAI system inventories include data provenance, source, signatures, versioning, known issues, human oversight roles, foundation-model versions, and access modes. It also recommends checking generated content against known ground truth using multiple evaluation methods, including human oversight and automated evaluation, and documenting fact-checking techniques for generated information.

Implication for MC: every automated audit must record model version, prompt/version, source material, judge rubric, human-review status, and source-to-claim verification.

### Fact: OpenAI eval guidance treats small successful evals as preliminary and recommends more criteria, prompts, and datasets for robust evaluation.

OpenAI eval documentation states that a small test case can show reliable behavior on a small sample, but robust evals generally need more criteria, different prompts, and different datasets.

Implication for MC: passing an LLM audit on a small group of evidence maps is a local result, not broad validation of the GitHub mind.

## Fact vs Inference

### Supported by evidence

- Automated evaluation can be useful as part of an evaluation workflow.
- Trustworthy evaluation requires documented criteria, representative test sets, methodology, uncertainty, and ongoing monitoring.
- GAI governance should preserve provenance, versioning, known issues, human oversight roles, and fact-checking techniques.
- Evaluation results should be tied to deployment context and should not exceed the conditions tested.

### Inference for Mirror Cartographer

- LLM-as-judge audits are useful for first-pass triage of evidence-map defects.
- A second independent audit layer may reduce, but not eliminate, hallucinated validation.
- The GitHub mind needs an audit ledger that separates machine-judged findings from human/source-verified findings.

### Not established

- That any current MC judge prompt reliably identifies unsupported claims.
- That a model judge can consistently detect subtle symbolic overreach, emotional inference, or source-mismatch errors.
- That automated audits improve real-world MC safety or usefulness.
- That the current GitHub mind has sufficient ground-truth samples to calibrate a judge.

## Claim-Status Update

Retire C-LLM-JUDGE-AUDIT-VALIDATION-01 if it exists in any form that implies automated audits validate repository reliability.

Replace with C-LLM-JUDGE-AUDIT-VALIDATION-01R:

"LLM-as-judge audits are allowable only as triage and regression-detection tools unless validated against source-grounded human or independent review. Any confidence update produced by an automated judge must include judge provenance, prompt/rubric version, sampled artifacts, source-support checks, uncertainty, false-positive/false-negative review, and scope limits."

Status: Supported boundary requirement; MC implementation unvalidated.

Confidence: Moderate for the governance boundary. Low for current MC implementation because no repository-wide calibrated audit has been run.

## Evaluation Criterion

An MC audit result may affect claim confidence only if all required fields are present:

1. Audit target: exact file path, commit, and claim ID.
2. Judge identity: model/provider/version or human reviewer identity category.
3. Rubric version: stable rubric ID and full criteria.
4. Input set: sampled files, inclusion/exclusion rule, and sample-size rationale.
5. Source-support method: how each claim was checked against cited source text.
6. Uncertainty: score confidence and known failure modes.
7. Disagreement handling: process for conflicts between judge, source, and human reviewer.
8. Calibration record: at least one prior set with known true/false labels, or an explicit note that no calibration exists.
9. Scope limit: what the audit can and cannot prove.
10. Confidence rule: exact rule for when confidence may increase, decrease, or remain unchanged.

## Falsification Checklist

An LLM-judge audit fails the validation gate if any item is true:

- The judge gives a pass/fail outcome without citing exact source lines or passages.
- The audit does not preserve model, prompt, rubric, and artifact versions.
- The score collapses source support, usefulness, tone, safety, and truth into one undifferentiated label.
- The audit allows a confidence increase without independent or human review.
- The audit does not report uncertainty or likely false positives/false negatives.
- The audit uses only evidence-map summaries instead of original sources.
- The audit does not include adversarial or known-bad examples.
- The audit result is generalized beyond the sampled files.
- The audit treats schema compliance as evidence of factual correctness.
- The audit has no appeal, correction, or contradiction-update path.

## Test Plan — LLM-JUDGE-VALIDATION-GATE-01

Purpose: Determine whether automated audit judgments are accurate enough to support GitHub mind governance.

Minimum test design:

1. Select 30 evidence maps from the repository.
2. Create a stratified set:
   - 10 likely strong maps,
   - 10 likely weak maps,
   - 10 intentionally seeded maps with known defects.
3. Defect categories:
   - unsupported citation,
   - inference stated as fact,
   - overbroad confidence,
   - missing counter-evidence,
   - stale source,
   - missing implementation proof,
   - therapy/medical overclaim,
   - job/opportunity overclaim,
   - accessibility overclaim,
   - summary-fidelity failure.
4. Run the LLM judge with a frozen rubric.
5. Require source-to-claim support excerpts for each judgment.
6. Compare judge labels against human/source-grounded labels.
7. Report precision, recall, false-positive rate, false-negative rate, uncertainty calibration, and disagreement categories.
8. Permit confidence changes only for findings confirmed by source-grounded review.

Passing threshold for use as triage:

- At least 0.80 precision on critical defects.
- At least 0.70 recall on critical defects.
- No unflagged high-severity seeded defect in the test batch.
- Full provenance and rubric reproducibility.

Passing threshold for use as confidence-changing validation:

- Not established. Requires more evidence than this map provides.

## Next Proof Needed

Run LLM-JUDGE-VALIDATION-GATE-01 across 30 existing evidence maps, including seeded known-bad examples, then publish a judge-performance ledger. The next proof is not another template; it is a calibration result showing whether the judge actually catches source-support failures, overclaiming, stale evidence, and inference-as-fact errors.