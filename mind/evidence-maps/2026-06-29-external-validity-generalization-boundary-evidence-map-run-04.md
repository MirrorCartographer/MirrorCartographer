# Evidence Map — External Validity / Generalization Boundary

Date: 2026-06-29  
Run: Evidence Engine 04  
Claim tested: C-EXTERNAL-01 / MC methods that work in one domain may generalize to other domains.  
Status before: active concern; insufficiently evidenced.  
Status after: externally supported as a governance requirement; MC implementation remains unvalidated.

## Bottom line

The evidence supports a boundary, not a success claim:

> MC must not treat one-domain success as proof of cross-domain validity.

A symbolic-reflection artifact, an AI-governance artifact, a health-information organizer, and a career-proof packet may share structure, but each domain has different harms, users, evidence standards, and failure modes.

## Fact / Inference Separation

### Facts from high-quality sources

1. NIST AI RMF 1.0 is intended to improve the ability to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI systems. Source: NIST AI Risk Management Framework overview, accessed 2026-06-29.  
   URL: https://www.nist.gov/itl/ai-risk-management-framework

2. OECD AI Principles identify transparency/explainability, robustness/security/safety, and accountability as principles for trustworthy AI, and define AI systems as outputs that can influence physical or virtual environments. Source: OECD AI Principles overview, accessed 2026-06-29.  
   URL: https://oecd.ai/en/ai-principles

3. FDA / Health Canada / MHRA Good Machine Learning Practice principles for medical-device ML emphasize independent training and test sets, representative data, human-AI team performance, clinically relevant testing, and monitoring deployed models. Source: FDA GMLP guiding principles, accessed 2026-06-29.  
   URL: https://www.fda.gov/medical-devices/software-medical-device-samd/good-machine-learning-practice-medical-device-development-guiding-principles

4. Model Cards propose documentation of intended use, performance characteristics, evaluation conditions, and relevant limitations so users can avoid applying models outside contexts for which they are not well suited. Source: Mitchell et al., “Model Cards for Model Reporting,” arXiv / FAT* 2019.  
   URL: https://arxiv.org/abs/1810.03993

5. A generalizability study in machine learning shows that internal evaluation can miss methodological pitfalls; misleading internal gains may not transfer to new data or contexts. Source: Maleki et al., “Generalizability of Machine Learning Models,” arXiv 2022.  
   URL: https://arxiv.org/abs/2202.01337

### Inferences for MC

1. If MC claims a pattern works because it worked in symbolic reflection, that does not establish usefulness in job proof, health-information organization, governance audit, or product design.

2. MC should treat each domain transfer as a new validation question, not as inherited proof.

3. The strongest current claim is not “MC generalizes.” The stronger and safer claim is: “MC can document when generalization is unproven and require domain-specific tests before confidence upgrades.”

4. External validity should be a gate in the claim registry and pruning audit.

## Claim-status update

Claim ID: C-EXTERNAL-01  
Old status: design concern / unresolved  
New status: supported governance requirement; implementation unvalidated  
Confidence change: slight increase for the need for the boundary; no increase for MC successfully satisfying the boundary.

Reason: multiple external sources converge on intended use, evaluation context, lifecycle risk management, representative testing, and monitoring. None of the sources test Mirror Cartographer directly.

## Evaluation Criterion: EXT-GATE-01

A Mirror Cartographer artifact may not borrow evidence from another domain unless it passes all five checks:

1. Domain Match: the source evidence and target use share the same user population, decision type, harm profile, and context of use.
2. Evidence Match: the evidence type is appropriate for the target claim, not merely adjacent or aesthetically similar.
3. Failure-Mode Match: likely failure modes have been re-identified in the target domain.
4. Outcome Match: success metrics measure the target domain’s real outcome, not only interface clarity or user resonance.
5. Reviewer Match: at least one reviewer can identify what does not transfer from the source domain to the target domain.

Pass threshold: all five checks pass.  
Partial pass: 3–4 checks pass, but claim remains “domain-limited.”  
Fail: fewer than 3 checks pass, or any safety-critical mismatch is found.

## Falsification checklist

Downgrade or block any MC generalization claim if:

- a symbolic result is used as evidence for clinical, medical, legal, or financial effectiveness;
- a governance artifact is used as proof of user benefit without outcome testing;
- a career proof packet is treated as hiring evidence without external reviewer feedback;
- a single successful artifact is treated as architecture-level validation;
- reviewer agreement drops below the threshold when the artifact is moved to a new domain;
- the target domain introduces new harms not present in the source domain;
- the claim says “works across domains” without naming the tested domains.

## Minimal test plan

Test name: EXT-TRANSFER-01  
Purpose: determine whether one MC evaluation method transfers across three domains.

Procedure:

1. Select one MC structure, such as the provenance block or review card.
2. Apply it to three artifacts:
   - symbolic reflection artifact;
   - AI governance evidence map;
   - health-information organizer with no diagnosis or treatment claims.
3. For each domain, have reviewers label:
   - what the structure clarified;
   - what it failed to capture;
   - what could cause harm if overgeneralized;
   - what evidence would be needed before a stronger claim.
4. Score with EXT-GATE-01.

Pass threshold:

- all three domains pass EXT-GATE-01;
- reviewers identify at least one domain-specific non-transferable element per domain;
- no artifact uses evidence from another domain to upgrade an outcome claim.

Failure outcome:

- If only one domain passes, the method is domain-specific.
- If two domains pass, claim may become “limited transfer under specified constraints.”
- If any safety-critical domain fails, the generalization claim stays blocked.

## Current limitation

This evidence map establishes the need for an external-validity boundary. It does not validate that MC’s current GitHub mind applies the boundary reliably.

## Next proof needed

Run EXT-TRANSFER-01 on three real MC artifacts and record reviewer scores. Update C-EXTERNAL-01 only after domain-specific evidence exists.
