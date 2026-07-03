# Evidence Map: Self-Audit vs Independent Assurance Boundary

Run ID: Evidence Engine Run 85  
Date: 2026-07-03  
Claim ID: C-MC-SELF-AUDIT-INDEPENDENT-ASSURANCE-01R  
Status: Partially supported as internal governance practice; unvalidated as independent assurance

## Claim tested

Mirror Cartographer / the GitHub mind can remain trustworthy if it continuously self-audits its own claims, evidence maps, tests, and evaluation rubrics.

## Why this claim matters

The current GitHub mind is becoming a governance substrate: evidence maps, claim status updates, falsification checklists, and test plans are being added over time. That improves traceability, but it creates a weak point: the same system that generates claims may also evaluate, score, and certify them. This can produce a false sense of rigor if independent challenge, external review, or adversarial testing is missing.

## Sources reviewed

1. NIST AI Risk Management Framework 1.0, especially lifecycle risk management, measurement, governance, and ongoing evaluation.
   - https://www.nist.gov/itl/ai-risk-management-framework
   - https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

2. NIST Generative AI Profile / AI RMF profile material, especially the need for risk identification, measurement, monitoring, and controls for generative AI-specific risks.
   - https://www.nist.gov/itl/ai-risk-management-framework
   - https://airc.nist.gov/airmf-resources/playbook/

3. OECD AI Principles, especially accountability, transparency, robustness, safety, and human-centered values.
   - https://oecd.ai/en/ai-principles

4. ISO/IEC 42001:2023 public description, especially performance evaluation, internal audit, management review, corrective action, and continual improvement as management-system requirements.
   - https://www.iso.org/standard/42001

5. McIntosh et al. (2024), "From COBIT to ISO 42001: Evaluating Cybersecurity Frameworks for Opportunities, Risks, and Regulatory Compliance in Commercializing Large Language Models."
   - https://arxiv.org/abs/2402.15770

## Evidence found

### Supported by higher-quality sources

- AI assurance is not a single document, score, or evidence map. NIST frames AI risk management as a lifecycle practice involving governance, mapping context, measuring risk, and managing risk over time.
- NIST and OECD both support accountability and transparency, but neither treats internal documentation alone as proof that a system is safe, effective, fair, or trustworthy.
- ISO/IEC 42001 is a management-system standard. Public descriptions emphasize monitoring, measurement, internal audit, management review, corrective action, and continual improvement. This supports the idea that internal audit is useful, but it is only one part of a broader assurance process.
- Governance frameworks for LLM commercialization are still incomplete and evolving. McIntosh et al. argue that human-expert-in-the-loop validation and continuous evolution are important for secure and compliant LLM integration.

### Boundaries and limitations

- The available evidence does not prove that Mirror Cartographer needs formal third-party certification right now.
- The evidence does support a weaker requirement: MC should not promote self-audited claims to "validated" status unless the claim has survived at least one independent or adversarial review step appropriate to its risk level.
- Internal evidence maps can improve organization and traceability, but they cannot by themselves prove that the system is correct, safe, or externally credible.

## Fact / inference separation

### Facts supported by reviewed sources

- NIST AI RMF describes AI risk management as an ongoing lifecycle activity.
- OECD AI Principles include accountability, transparency/explainability, robustness, security, and safety.
- ISO/IEC 42001:2023 is an AI management-system standard that includes performance evaluation and improvement requirements.
- Current AI governance and LLM commercialization literature emphasizes continuous risk management and human-expert validation.

### Inferences for Mirror Cartographer

- MC self-audits are useful for internal discipline, but they are not enough to establish external trustworthiness.
- Claims generated, scored, and revised entirely inside the same AI-mediated workflow carry correlated-error risk.
- The GitHub mind needs an independent-challenge layer before any claim is marked validated, especially claims about user benefit, safety, therapeutic effect, accessibility, hiring usefulness, or market value.

## Claim-status update

C-MC-SELF-AUDIT-INDEPENDENT-ASSURANCE-01R:

Self-audit is a useful governance practice for Mirror Cartographer, but it is not independent assurance. The GitHub mind may mark a claim as "internally reviewed" after evidence mapping and falsification checks, but it should not mark a claim as "validated" unless the claim has passed a risk-appropriate external or adversarial review step.

Confidence: Medium. The boundary is strongly supported by governance logic and high-quality AI risk-management sources, but the exact level of independence needed for each MC claim class still needs operational testing.

## New evaluation criterion added

### Independent Assurance Gate: IA-GATE-01

Before a persistent MC claim can be promoted to "validated," it must include:

1. Claim ID and exact claim text.
2. Risk tier: low, moderate, high, or health/safety-adjacent.
3. Evidence map with primary or high-quality sources.
4. Internal falsification checklist.
5. At least one independent challenge step, selected by risk tier:
   - Low risk: separate model pass using source-blind critique or adversarial prompt set.
   - Moderate risk: human review by at least one independent reviewer or structured comparison against an external benchmark.
   - High risk: multiple reviewers, failure-case testing, and documented acceptance thresholds.
   - Health/safety-adjacent: no benefit or safety claim may be promoted without domain-appropriate expert review or validated empirical evidence.
6. Logged disagreements and unresolved objections.
7. Status decision: unsupported, plausible, internally reviewed, externally challenged, validated, revised, or retired.
8. Review date and next review trigger.

## Falsification checklist

This claim should be revised if:

- MC shows that internal self-audit outcomes reliably match independent human or expert review across a representative claim sample.
- External reviewers find no meaningful unsupported-claim drift after repeated audits.
- A validated benchmark demonstrates that the internal claim-evidence scoring process can detect unsupported, overstated, stale, and contradicted claims at high reliability.

This claim should be strengthened if:

- Independent reviewers repeatedly find overclaiming, citation mismatch, stale evidence, or hidden assumptions in self-audited MC evidence maps.
- LLM-only audit passes fail to detect unsupported therapeutic, safety, accessibility, or market claims.
- Internal evaluation scores correlate weakly with external reviewer judgments.

## Test plan

Test ID: MC-INDEPENDENT-ASSURANCE-CALIBRATION-PILOT-01

Goal: Determine whether the GitHub mind's internal evidence audits agree with independent review.

Sample:
- 30 existing MC / AI opportunity claims.
- Include at least 5 claims each from: user benefit, safety, accessibility, opportunity/market value, evaluation metrics, and GitHub governance.

Procedure:
1. Extract claim text, current status, evidence sources, and confidence level.
2. Run internal self-audit using the existing evidence-engine checklist.
3. Obtain independent review using at least two reviewers or one domain reviewer plus one adversarial model pass.
4. Score each claim for:
   - direct source support,
   - citation accuracy,
   - fact/inference separation,
   - overstatement,
   - missing counterevidence,
   - freshness risk,
   - validation status accuracy.
5. Compare internal and independent ratings.
6. Publish disagreement matrix and update claim statuses.

Metrics:
- Agreement rate between internal and independent status labels.
- Percentage of claims downgraded by independent review.
- Percentage of citations judged indirect or mismatched.
- Percentage of claims missing falsification conditions.
- Percentage of health/safety-adjacent claims requiring stricter boundary language.

Acceptance threshold for promoting the self-audit process:
- At least 85% agreement on support level.
- No high-risk claim falsely promoted to validated.
- Less than 5% citation-support mismatch on direct factual claims.
- All health/safety-adjacent claims correctly bounded.

## Next proof needed

Run MC-INDEPENDENT-ASSURANCE-CALIBRATION-PILOT-01 and publish the disagreement matrix. The next proof is not another evidence map; it is evidence that the evidence-engine process itself can survive independent challenge.
