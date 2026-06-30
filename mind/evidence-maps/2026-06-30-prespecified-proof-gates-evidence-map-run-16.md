# Evidence Map Run 16 — Prespecified Proof Gates

Date: 2026-06-30

## Claim tested

**C-PRESPEC-01:** Mirror Cartographer proof gates can be designed after looking at outputs and still be treated as strong proof if the final writeup is clear and well cited.

## Status update

**Retire and replace.**

Replacement claim:

**C-PRESPEC-01R:** Any MC evaluation intended to upgrade claim confidence must record the claim, artifact set, scoring rule, exclusion rule, pass/fail threshold, and downgrade rule before scoring starts. Later analysis may be useful, but it must be labeled exploratory unless it is rerun under a locked rule.

Current status:

**Supported evidence-governance requirement; implementation unvalidated.**

## Evidence found

### 1. NIST AI RMF 1.0, 2023

NIST treats trustworthy AI as a lifecycle problem requiring governance, measurement, documentation, and repeated test/evaluation/verification/validation activity. The RMF says metrics, methods, test sets, limitations, deployment conditions, generalizability boundaries, and reassessment should be documented.

Source: NIST AI Risk Management Framework 1.0, NIST AI 100-1, January 2023. https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

Fact: AI assurance requires documented measurement, methods, context, limitations, and reassessment.

MC inference: MC gates should not upgrade confidence unless the measurement rule and artifact set are visible before the gate is run.

### 2. Kahan, Forbes, and Cro, 2019

Clinical-trial methods research warns that choosing an analysis approach after seeing results can bias conclusions. It also warns that vague pre-planning is not enough if it leaves many later choices open.

Source: Kahan BC, Forbes G, Cro S. "How to design a pre-specified statistical analysis approach to limit p-hacking in clinical trials: the Pre-SPEC framework." arXiv:1907.04078, 2019. https://arxiv.org/abs/1907.04078

Fact: Pre-planning only reduces bias when it actually constrains later researcher discretion.

MC inference: A gate such as "review for agency" is too weak unless it defines observable indicators, ambiguous-case handling, and failure thresholds before scoring.

### 3. Rubin, 2020

A critical review defines preregistration as time-stamped registration of hypotheses, methods, and analyses before data collection or analysis. It also argues that preregistration is not a cure-all; credibility also depends on clear rationale, accessible materials, and robustness to alternative interpretations.

Source: Rubin M. "Does preregistration improve the credibility of research findings?" arXiv:2010.10513, 2020. https://arxiv.org/abs/2010.10513

Fact: Preregistration improves historical transparency, but it is insufficient by itself.

MC inference: MC should combine prespecified gates with artifact transparency, deviation logs, and robustness checks.

### 4. Registered Reports in Software Engineering, 2023

Registered-report practice in empirical software engineering reviews the research protocol before results are known and supports reporting results even when they do not support the hypothesis, provided the approved protocol was followed.

Source: Ernst NA, Baldassarre MT. "Registered Reports in Software Engineering." arXiv:2302.03649, 2023. https://arxiv.org/abs/2302.03649

Fact: Protocol-first review helps separate method quality from favorable results.

MC inference: MC should retain null, failed, and ambiguous results rather than only archiving successful proof cases.

## Fact vs inference boundary

Facts supported by sources:

- AI evaluation needs documented metrics, methods, context, and limitations.
- Choosing analysis rules after seeing evidence can bias conclusions.
- Prior rules must be detailed enough to constrain later discretion.
- Prior rules are not sufficient alone; materials, rationale, deviations, and robustness still matter.

Inferences for MC:

- Post-hoc evidence maps should not independently upgrade claim confidence.
- MC needs a locked-rule requirement before any confidence upgrade.
- Exploratory findings can create future tests, but they should not be reported as confirmatory proof.

Not established:

- This does not prove MC evaluations are currently biased.
- This does not prove prespecification makes MC valid.
- This does not prove MC improves hiring, health reflection, trust calibration, or symbolic reflection outcomes.

## Evaluation criterion added

### PRESPEC-GATE-01 — Confidence Upgrade Lock

A claim may be upgraded only if these were recorded before scoring:

1. Claim ID and exact claim text.
2. Artifact set or sampling rule.
3. Inclusion and exclusion rules.
4. Primary pass/fail criterion.
5. Scoring rubric with observable indicators.
6. Ambiguous-case rule.
7. Downgrade or retirement rule.
8. Deviation log.
9. Statement of whether the result can upgrade, maintain, downgrade, or only generate a future hypothesis.

Automatic downgrade to exploratory-only:

- Artifact set selected after seeing favorable results.
- Threshold changed after scoring begins.
- Failed cases omitted.
- Exploratory interpretation written as confirmatory proof.

## Test plan

### PRESPEC-RUN-01

Sample:
The last 15 Evidence Engine maps in `mind/evidence-maps/`.

Procedure:
For each map, classify it as:

- confirmatory-prespecified,
- exploratory-post-hoc,
- mixed or unclear.

Then record:

- whether the claim existed before evidence collection,
- whether the scoring rule existed before evaluation,
- whether failed or ambiguous cases were retained,
- whether a status upgrade relied only on post-hoc synthesis.

Pass threshold:
At least 80% of claim upgrades must have prior rules or be reclassified as exploratory.

Failure condition:
Any map that upgrades a claim only through post-hoc synthesis is downgraded to **exploratory evidence only**.

## Next proof needed

Run **PRESPEC-RUN-01** on the last 15 Evidence Engine maps and publish a downgrade ledger. Until then, MC evaluation gates are promising governance architecture, not validated proof infrastructure.
