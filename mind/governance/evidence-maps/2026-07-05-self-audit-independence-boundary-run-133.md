# Evidence Map: Self-Audit Independence Boundary

Date: 2026-07-05
Status: claim narrowed / independence requirement added
Area: Mirror Cartographer / GitHub mind governance / Evidence Engine

## Claim tested

**Weak claim:** The Evidence Engine can create an evidence map and also certify, by itself, that the update is adequately tested, robust, and ready to treat as implemented knowledge.

## Claim-status update

**Previous implicit assumption:** A researched GitHub update plus AI self-check is enough to treat a claim as strengthened.

**Updated claim:** An AI-created evidence update can improve traceability, but it should not be treated as independently validated unless review, adversarial testing, or repeat scoring is performed by a separate evaluator, separate model path, blinded rerun, domain expert, user test, or benchmarked procedure.

## Evidence found

### Facts

1. NIST AI RMF 1.0 frames trustworthy AI as a lifecycle risk-management problem, not a single artifact problem. It identifies valid and reliable, safe, secure and resilient, accountable and transparent, explainable and interpretable, privacy-enhanced, and fair systems as trustworthiness characteristics. Source: NIST AI RMF 1.0, January 2023, https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

2. NIST AI RMF notes that AI risks can be hard to measure, that metrics may be oversimplified or gamed, and that laboratory or controlled measurements may differ from real-world risks. This weakens any claim that a same-run internal check is enough. Source: NIST AI RMF 1.0, Risk Measurement section, https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

3. NIST's Generative AI Profile recommends document retention for test, evaluation, validation, and verification history; it also recommends inventories that include provenance, known issues, human oversight roles, and underlying model/version information. Source: NIST AI 600-1, July 2024, https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

4. NIST's Generative AI Profile recommends independent evaluations or assessments proportional to risk, standardized measurement protocols, AI red-teaming or independent external evaluations, and regular assessments involving internal experts not on the front-line development team and/or independent assessors. Source: NIST AI 600-1, GOVERN 3.2, GOVERN 4.1, MEASURE 1.3, https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

5. NIST's Generative AI Profile describes AI red-teaming as an evolving practice for identifying adverse behavior, stress-testing safeguards, and analyzing how adverse outcomes could occur. It also states that red-team output quality depends on red-team background and expertise, and that results should receive additional analysis before incorporation into governance and risk management. Source: NIST AI 600-1, Appendix A.1.5, https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

6. HarmBench argues that automated red teaming needs standardized evaluation frameworks and identifies gaps in red-teaming evaluation practice; this supports treating ad hoc self-red-team notes as provisional unless they use a defined evaluation structure. Source: Mazeika et al., "HarmBench: A Standardized Evaluation Framework for Automated Red Teaming and Robust Refusal," 2024, https://arxiv.org/abs/2402.04249

7. PyRIT frames red teaming as risk identification rather than proof of safety. It is a framework for probing systems for harms, risks, and jailbreaks; discovering no issue in a run does not imply absence of issues. Source: Lopez Munoz et al., "PyRIT: A Framework for Security Risk Identification and Red Teaming in Generative AI System," 2024, https://arxiv.org/abs/2410.02828

### Inferences

1. The GitHub mind should separate **created**, **self-checked**, **reviewed**, **adversarially tested**, **independently replicated**, and **operationalized** statuses.

2. Same-agent self-critique is useful as a first-pass failure search, but it has correlated blind spots with the original generation process. It is not equivalent to independent review.

3. Evidence Engine runs should avoid language implying that a claim is validated when the only verification is the same run that wrote the claim.

4. A falsification checklist is stronger than a confidence statement because it defines what would change the claim status.

## Evaluation criterion added

### MC-INDEPENDENT-VALIDATION-01

Every evidence update must receive one of the following statuses:

| Status | Meaning | Allowed wording |
|---|---|---|
| Created | File exists in GitHub. | "Persisted" |
| Self-checked | The same AI run searched for obvious errors. | "Provisional" |
| Cross-checked | A separate source, model path, script, or reviewer checked the update. | "Cross-checked" |
| Adversarially tested | A red-team or falsification pass attempted to break the claim. | "Stress-tested" |
| Independently reviewed | Reviewer was independent of the creator path and had relevant expertise or rubric training. | "Reviewed" |
| Replicated | Similar result obtained by independent rerun, scorer, dataset, or benchmark. | "Replicated" |
| Operationalized | The criterion changes future behavior, UI, scoring, or release gates. | "Operational" |

Minimum rule: an Evidence Engine update may be called **strengthened** after source-backed narrowing, but it may not be called **validated** unless at least Cross-checked plus Adversarially tested or Independently reviewed are complete.

## Falsification checklist

This update is weakened or falsified if:

- A later audit finds that same-agent evidence updates match independent-review outcomes at a high enough rate to justify treating self-checks as validated for this low-risk context.
- The GitHub mind already has an enforced independent-review gate that I failed to detect.
- Evidence maps are only intended as private scratch notes and are never used to support public claims, product claims, job claims, or safety claims.
- A tested process shows that same-run self-critique catches the relevant failure modes at an acceptable threshold for the specific claim class.

## Test plan

### MC-SELF-AUDIT-INDEPENDENCE-PILOT-01

Sample: 30 recent Evidence Engine files.

Procedure:

1. Label each file by creator path, source count, source type, and claim category.
2. Classify status using MC-INDEPENDENT-VALIDATION-01.
3. Re-score 10 files using a separate pass that cannot see the original conclusion until after scoring.
4. For each file, ask: what evidence would lower confidence, and was that evidence actually searched?
5. Mark any file using words such as "proved," "validated," "implemented," or "confirmed" without meeting the validation threshold.
6. Produce a correction list: downgrade, keep provisional, cross-check, or promote.

Success condition:

- At least 90% of audited files have a clear status label.
- At least 90% avoid overclaiming beyond their status.
- Disagreements between original and second-pass scoring are logged and used to revise the rubric.

Failure condition:

- More than 20% of evidence files imply validation without independent or adversarial checks.
- The status labels cannot be applied consistently by two scoring passes.
- The GitHub mind uses evidence maps operationally without enforcing claim-status boundaries.

## Practical implementation note

Future Evidence Engine outputs should report:

- Claim tested
- Evidence found
- Fact / inference split
- GitHub update path
- Claim status after update
- Validation status using MC-INDEPENDENT-VALIDATION-01
- Next proof needed

## Current status

This file is **Created** and **Self-checked**. It is not independently validated.
