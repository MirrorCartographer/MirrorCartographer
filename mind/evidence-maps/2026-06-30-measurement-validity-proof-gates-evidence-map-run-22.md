# Evidence Map Run 22 — Measurement-validity boundary for MC proof gates

Date: 2026-06-30
Status: evidence map + evaluation criterion + claim-status update + falsification checklist

## Claim tested

**C-MEASURE-VALIDITY-01:** Mirror Cartographer proof gates can use internally defined pass/fail scores as strong evidence that an artifact, claim, or workflow is stronger.

## Why this claim needed stronger evidence

Recent Evidence Engine runs created many gates: reproducibility gates, red-team gates, human-review gates, health-escalation gates, proof-film gates, and opportunity-selection gates. Those gates are useful, but many depend on scores such as "pass," "audit-ready," "stronger," "safe enough," "agency preserved," or "reviewer attribution accuracy."

Weak point: a gate can look rigorous while measuring the wrong construct, measuring inconsistently, or supporting a stronger conclusion than the score can justify.

## Evidence base searched

Sources prioritized:

1. NIST AI Risk Management Framework 1.0, especially reliability, validity, measurement, monitoring, and risk-management language.
2. ISO/IEC 25010 software quality model, especially quality-in-use and product-quality framing.
3. OECD AI accountability/risk-assessment material.
4. Standards-adjacent measurement logic from evaluation practice: intended use, context of use, stakeholder needs, and lifecycle monitoring.

## Evidence found

### Fact — AI-system validity and reliability require ongoing measurement, not one-time assertion

NIST AI RMF states that validity and reliability for deployed AI systems are often assessed through ongoing testing or monitoring that confirms the system performs as intended. It also treats measurement of validity, accuracy, robustness, and reliability as part of trustworthiness and says measurement should account for potential harms.

**Implication for MC:** a proof gate cannot be treated as strong evidence merely because it was executed once. It needs repeatable scoring, failure logging, and monitoring of whether the measured property remains stable across artifacts and contexts.

### Fact — quality evaluation must be tied to stakeholder needs and context of use

ISO/IEC 25010 frames system/software quality as the degree to which a system satisfies stated and implied stakeholder needs, and the standard is used for requirements specification and evaluation across the lifecycle.

**Implication for MC:** terms like "good," "useful," "strong," "audit-ready," or "safe" are not free-floating properties. They need context: who uses the artifact, for what task, under what risk, with what acceptable failure mode.

### Fact — AI accountability work treats risk assessment as identifying, evaluating, and measuring risks that affect whether a system functions as intended and in a trustworthy way

OECD accountability material frames AI risk/impact assessment as identifying, evaluating, and measuring risks affecting trustworthy function, and it emphasizes proportional risk treatment.

**Implication for MC:** MC gates should not only ask whether an artifact passed. They should identify what risk the gate is supposed to measure, what risk remains after passing, and what risk would force downgrade.

## Fact / inference separation

### Supported facts

- AI-system trustworthiness requires measurement of validity and reliability, not only narrative justification.
- Measurement should be related to intended system performance and potential harms.
- Software/product-quality evaluation should be anchored to stakeholder needs and context of use.
- Risk assessment should identify and measure risks, then treat them proportionally.

### MC-specific inferences

- MC proof gates need a measurement-validity layer before their pass/fail outcomes can justify confidence upgrades.
- MC should separate three things: gate execution, construct measured, and claim-status consequence.
- A gate can pass while the underlying claim remains unvalidated if the metric only measures documentation quality, reviewer agreement, or formatting compliance.
- MC should downgrade any claim whose confidence depends on a score that lacks construct definition, scoring reliability, threshold rationale, or failure consequences.

### Not established

- This evidence does not prove that any current MC metric is valid.
- This evidence does not prove that MC improves audit accuracy, emotional orientation, job selection, health reflection, or safety outcomes.
- This evidence does not prove that the proposed measurement-validity checklist is sufficient.

## Claim-status update

Retire the broad claim:

**C-MEASURE-VALIDITY-01:** "MC proof gates can use internally defined pass/fail scores as strong evidence that a claim is stronger."

Replace with:

**C-MEASURE-VALIDITY-01R:** "MC proof gates can support limited confidence updates only when the measured construct, intended use, scoring rule, reliability check, threshold rationale, failure consequence, and residual-risk statement are specified before evaluation."

Status: **supported evaluation-governance requirement; MC implementation unvalidated.**

## New evaluation criterion — MEASURE-VALIDITY-GATE-01

Before any MC gate can upgrade claim confidence, the gate must document:

1. **Construct name:** what property is being measured.
2. **Construct boundary:** what the metric does not measure.
3. **Intended use:** what decision the score is allowed to influence.
4. **Artifact set:** which artifacts are included/excluded and why.
5. **Scoring rule:** explicit rubric, scale, and examples.
6. **Threshold rationale:** why the pass threshold is meaningful.
7. **Reliability check:** at minimum, repeat scoring or independent scoring on a subset.
8. **Failure consequence:** what downgrade, revision, or retirement follows failure.
9. **Residual-risk statement:** what remains uncertain even after passing.
10. **No-overclaim statement:** the strongest conclusion the gate is not allowed to support.

## Falsification checklist

A proof gate fails measurement-validity review if any of the following are true:

- The metric name is vague, such as "better," "stronger," or "safe," without construct definition.
- The pass/fail threshold is arbitrary or unexplained.
- The scoring rule is created after reviewing the target outputs but presented as confirmatory.
- The gate measures documentation quality but upgrades a performance claim.
- The gate measures reviewer agreement but upgrades a truth claim.
- The gate measures red-team survival but upgrades a broad safety claim.
- The gate measures symbolic coherence but upgrades a psychological or biological outcome claim.
- The gate has no downgrade rule.
- The gate has no residual-risk statement.
- The gate outcome cannot be independently repeated from the written artifact.

## Implementation note

This run does not validate MC. It adds a constraint on what future MC validation must look like. Existing gates should be audited before they are used as confidence-upgrade evidence.

## Next proof needed

Run **MEASURE-VALIDITY-AUDIT-01** on the last 10 Evidence Engine gates.

Audit question: which gates define a measurable construct well enough to justify any confidence update?

Required output:

- gate name
- construct measured
- claim supposedly supported
- mismatch, if any
- pass/fail threshold quality
- reliability evidence
- allowed inference
- overclaim risk
- downgrade required

Upgrade rule: no MC claim may move above "implementation unvalidated" from a gate unless the gate passes MEASURE-VALIDITY-GATE-01.
