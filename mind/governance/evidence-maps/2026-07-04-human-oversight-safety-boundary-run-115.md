# Evidence Map: Human Oversight Safety Boundary

Date: 2026-07-04
Status: claim narrowed / certainty limited
Area: Mirror Cartographer governance, AI opportunity work, GitHub mind evidence quality

## Claim tested

Human review / human-in-the-loop oversight makes Mirror Cartographer, AI opportunity workflows, or agentic GitHub work safe enough to proceed.

## Claim-status update

Previous implicit claim:
- Adding human review meaningfully solves safety, truthfulness, autonomy, and accountability risk.

Updated claim:
- Human oversight is a necessary governance control for higher-risk AI workflows, but it is not itself proof of safety. It only becomes meaningful when the reviewer has defined authority, sufficient competence, system-limit awareness, intervention power, logging, and a way to verify that oversight changes outcomes.

Certainty:
- Moderate for the governance boundary.
- Low for any claim that MC's current human-review process already works, because that has not yet been tested.

## Evidence found

### Facts from primary / high-quality sources

1. NIST AI RMF frames trustworthy AI as lifecycle risk management across design, development, use, and evaluation, not as a single control. The AI RMF Core is operationalized through Govern, Map, Measure, and Manage functions.
Source: NIST AI RMF overview, https://www.nist.gov/itl/ai-risk-management-framework and AIRC AI RMF page, https://airc.nist.gov/airmf-resources/airmf/

2. NIST's AI RMF Appendix C says human roles and responsibilities in AI decision-making and oversight need to be clearly defined and differentiated. It also says Human-AI configurations can range from fully autonomous to fully manual, and that some systems require oversight while others may not.
Source: NIST AIRC Appendix C, https://airc.nist.gov/airmf-resources/airmf/appendices/app-c-ai-risk-management-and-human-ai-interaction/

3. NIST Appendix C says cognitive and systemic biases enter AI design, deployment, evaluation, and use. It warns that Human-AI interaction can vary: in some conditions, AI can amplify human bias; in other conditions, well-organized Human-AI teams can improve performance.
Source: NIST AIRC Appendix C, https://airc.nist.gov/airmf-resources/airmf/appendices/app-c-ai-risk-management-and-human-ai-interaction/

4. NIST Appendix C says presenting AI information to humans is complex, because people perceive and interpret AI outputs and explanations differently. It also says more research is needed on whether humans are empowered and incentivized to challenge AI outputs, and that override frequency and rationale may be useful to collect.
Source: NIST AIRC Appendix C, https://airc.nist.gov/airmf-resources/airmf/appendices/app-c-ai-risk-management-and-human-ai-interaction/

5. The EU AI Act requires high-risk AI systems to be designed so they can be effectively overseen by natural persons. It says oversight should prevent or minimize health, safety, or fundamental-rights risks, and should be proportionate to risk, autonomy, and context of use.
Source: Regulation (EU) 2024/1689, Article 14, https://data.europa.eu/eli/reg/2024/1689/oj

6. The EU AI Act specifies that people assigned oversight should be enabled to understand system capacities and limits, monitor operation, detect anomalies, remain aware of automation bias, correctly interpret outputs, disregard/override/reverse outputs, and interrupt operation.
Source: Regulation (EU) 2024/1689, Article 14, https://data.europa.eu/eli/reg/2024/1689/oj

7. NIST SP 1270 says bias can cause harmful impacts regardless of intent, creating challenges for public trust in AI.
Source: NIST SP 1270, https://www.nist.gov/publications/towards-standard-identifying-and-managing-bias-artificial-intelligence

8. OECD AI Principles identify human rights, democratic values, transparency/explainability, robustness/security/safety, and accountability as values-based principles for trustworthy AI. They do not reduce trustworthiness to human review alone.
Source: OECD AI Principles overview, https://oecd.ai/en/ai-principles

## Inference

Human oversight should be treated as an evaluated capability, not a checkbox. MC should not say that a workflow is safe because a person reviewed it. It should say the workflow has a human-review layer, then state whether that layer has been tested for competence, authority, override use, detection of errors, and reduction of harm.

## Boundary for MC / GitHub mind

Human review is stronger when it includes:

1. Defined reviewer role.
2. Defined decision authority.
3. System limitations visible before review.
4. Claim/evidence separation visible during review.
5. Known failure classes listed.
6. Stop/override path available.
7. Reviewer rationale logged.
8. Post-review error rate measured.
9. Evidence that review changes downstream outcomes.

Human review is weak when it is only:

- a person looking at output,
- a final approval click,
- an implied safety layer,
- unlogged intuition,
- or review by someone without enough context, time, literacy, or authority to challenge the output.

## Evaluation criterion added

### MC-HUMAN-OVERSIGHT-01

Any MC, AI opportunity, health-boundary, job-application, or GitHub-agent workflow that claims human review must specify:

1. Who reviews the output or artifact.
2. What they are reviewing for.
3. What information they see about uncertainty, limits, and evidence quality.
4. What they are empowered to change, stop, reject, or escalate.
5. Whether automation bias is explicitly checked.
6. Whether override / rejection decisions are logged.
7. How review effectiveness is measured.
8. What failure would falsify the oversight claim.

If those fields are missing, classify the workflow as "human-visible" rather than "human-overseen."

## Falsification checklist

A claim that human oversight is working should be downgraded if any of these occur:

- Reviewers cannot identify unsupported claims.
- Reviewers cannot distinguish fact, inference, metaphor, and recommendation.
- Reviewers rarely or never override outputs even when seeded errors exist.
- Reviewers lack access to source evidence.
- Reviewers lack authority to stop or reverse a system action.
- Review speed is too fast to allow meaningful evaluation.
- Review rationale is not logged.
- Post-review artifacts still contain the same failure classes as unreviewed artifacts.
- Users interpret "reviewed" as "safe," "true," or "clinically/job-legally approved."

## Test plan

### MC-HUMAN-OVERSIGHT-PILOT-01

Purpose:
- Test whether human review actually improves MC artifact quality and risk control.

Sample:
- 20 MC/GitHub artifacts: evidence maps, body-map reflections, job-opportunity outputs, symbolic interpretations, and health-boundary outputs.

Method:
1. Create baseline outputs with seeded issues: unsupported claims, weak source use, metaphor/fact blur, overgeneralization, missing uncertainty, and unsafe action implication.
2. Give reviewers a structured checklist based on MC-HUMAN-OVERSIGHT-01.
3. Measure detection rate, correction rate, override rate, and remaining failure rate.
4. Compare reviewed artifacts against unreviewed artifacts.
5. Log whether review changed claim status, source quality, boundaries, or next-proof requirements.

Pass condition:
- Human review detects and corrects most seeded high-impact errors, improves fact/inference separation, and produces logged rationale.

Fail condition:
- Review mostly approves outputs without detecting seeded failures, or reviewed artifacts retain the same high-impact errors as baseline.

## Current conclusion

Human oversight is not evidence of safety by itself. It is a control that must be designed, tested, logged, and measured. For MC, the correct claim is: "human review may reduce risk when structured and evaluated," not "human review makes the system safe."

## Next proof needed

MC-HUMAN-OVERSIGHT-PILOT-01: run a seeded-error review test on 20 MC/GitHub artifacts and measure whether structured human review reduces unsupported claims, metaphor/fact blur, unsafe implications, and missing uncertainty.
