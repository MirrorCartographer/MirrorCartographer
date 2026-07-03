# ERS Measurement Validity Boundary — Run 89

Date: 2026-07-03  
Lane: evidence-quality / evaluation  
Status: supported as governance architecture; not validated as an accuracy predictor  
Claim tested: The Evidence Reliability Score can measure likely truth or accuracy of Mirror Cartographer claims.

## Bottom line

The claim must be narrowed.

An Evidence Reliability Score can be used as a structured evidence-governance heuristic for source quality, directness, independence, freshness, provenance, and contradiction handling. It should not yet be presented as a validated measure of truth or factual accuracy.

The correct current wording is:

> ERS is a claim-audit and evidence-triage instrument. It estimates evidential support quality, not truth itself. It becomes a validated accuracy predictor only if ERS scores correlate with independent expert/reviewer judgments or later empirical outcomes.

## Evidence found

### 1. NIST supports measurement humility for AI risk and trustworthiness

NIST AI RMF 1.0 states that AI risks or failures that are not well defined or adequately understood are difficult to measure quantitatively or qualitatively. It also warns that inability to measure risk does not imply either high or low risk.

NIST identifies lack of consensus on robust and verifiable measurement methods for AI risk and trustworthiness as a risk-measurement challenge. It also warns that metrics can become oversimplified, gamed, lose nuance, be relied upon unexpectedly, or fail to account for group/context differences.

Source: NIST AI RMF 1.0, January 2023.  
URL: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

### 2. GRADE supports explicit certainty domains rather than raw source count

The GRADE Working Group describes GRADE as a transparent approach to grading quality/certainty of evidence and strength of recommendations. Its minimum requirements include explicit consideration of domains such as risk of bias, imprecision, inconsistency, indirectness, publication bias, large effects, dose-response gradients, and residual plausible opposing bias.

This supports ERS using component dimensions instead of citation count.

Source: GRADE Working Group.  
URL: https://www.gradeworkinggroup.org/

### 3. ISO/IEC 42001 supports management-system framing, not one-time proof

ISO describes ISO/IEC 42001:2023 as specifying requirements for establishing, implementing, maintaining, and continually improving an AI Management System. ISO frames the standard around responsible AI development/use, risk and opportunity management, traceability, transparency, and reliability.

This supports ERS as an ongoing management-system control, not a one-time certificate of truth.

Source: ISO/IEC 42001:2023 page.  
URL: https://www.iso.org/standard/42001

### 4. Recent agentic-AI assurance literature supports continuous evidence binding, but remains secondary

A 2026 arXiv paper on Trustworthy AI Posture argues that point-in-time document audits cannot keep pace with high-velocity agentic systems, and proposes continuous, evidence-gated assurance objects that bind claims to evidence. This is aligned with the ERS architecture, but it is not a primary standard and should be treated as secondary conceptual support.

Source: Lupo, Vo, Locke. Trustworthy AI Posture, 2026.  
URL: https://arxiv.org/abs/2603.03340

## Fact vs inference

### Facts

- NIST AI RMF identifies risk-measurement difficulty, lack of robust/verifiable methods, real-world context dependence, and metric-gaming/oversimplification as AI risk-management challenges.
- GRADE requires explicit evidence-certainty domains instead of treating all evidence as equal.
- ISO/IEC 42001 frames AI governance as an ongoing management system with continual improvement, traceability, transparency, and reliability.
- Continuous/evidence-bound assurance is an active direction in agentic-AI governance literature.

### Inferences

- MC should treat ERS as a governance heuristic until validated.
- ERS component scores should not be converted into a percentage likelihood of truth yet.
- ERS should produce status labels such as unsupported, weakly supported, governance-supported, externally supported, MC-tested, or validated rather than raw truth probabilities.
- A high ERS should mean “better source-to-claim support,” not “certainly true.”

## Claim-status update

C-EVIDENCE-QUALITY-SCORING-01R remains supported, but with narrowed scope.

Previous risk: ERS could be interpreted as a probability-of-truth graph.

Updated status:

> ERS is supported as an evidence-quality, source-reliability, and claim-audit framework. It is not yet validated as a truth-probability or accuracy-prediction system.

## Evaluation criterion: ERS-VALIDITY-01

ERS may be described as predictive only if it passes at least one validation route:

1. Independent reviewer agreement route  
   - Select at least 30 MC claims.
   - Blind at least 2 independent reviewers to ERS scores.
   - Have reviewers rate claim support quality using a prespecified rubric.
   - Test whether ERS scores correlate with reviewer ratings.

2. Outcome validation route  
   - Select claims with future-verifiable outcomes.
   - Record ERS before the outcome is known.
   - Compare ERS strata against later correctness/adjudication.

3. Adjudicated expert route  
   - For domain-specific claims, obtain expert review.
   - Compare ERS against expert judgment.
   - Record disagreements and revise component weights.

Minimum pass threshold for pilot:

- At least moderate positive correlation between ERS and independent support-quality judgment.
- No systematic inflation of medical, legal, clinical, safety, or financial claims.
- Contradiction flags must lower status even when source authority is high.

## Falsification checklist

ERS fails or must be downgraded if:

- high ERS claims are frequently judged weak by independent reviewers;
- source prestige raises scores despite poor direct support;
- multiple derivative sources are treated as independent;
- Wikipedia/news/blogs drive high scores in high-stakes domains;
- contradiction flags do not reduce status;
- freshness decay is ignored in fast-changing domains;
- ERS labels are presented as truth percentages before validation;
- MC-specific claims are upgraded without MC-specific tests.

## Implementation change

Add a hard label distinction:

- Evidence Quality Score: how strong the source-to-claim support is.
- Accuracy Prediction Score: reserved until validation shows ERS predicts correctness or independent adjudication.
- Truth Probability: prohibited unless mathematically justified and empirically calibrated.

## Next proof needed

Run `ERS-VALIDITY-PILOT-01`.

Inputs:

- 30 claims from recent evidence maps.
- Source tables from each map.
- Blind reviewer support-quality ratings.
- ERS component scores.

Outputs:

- correlation between ERS and reviewer rating;
- false-high-confidence cases;
- source-prestige inflation cases;
- contradiction-handling failures;
- revised ERS weighting rules;
- claim-status changes.
