# Evidence Map — Red-Teaming Safety Boundary

Date: 2026-07-04
Run: Evidence Engine 111
Status: Claim narrowed / downgraded

## Claim tested

Mirror Cartographer / AI opportunity work can treat red-teaming, adversarial prompting, or challenge-style testing as proof that an AI system or AI-assisted workflow is safe enough to deploy.

## Updated claim status

Previous implicit claim:

> Red-teaming finds the major failures, so passing red-team tests can be treated as evidence of safety.

Updated bounded claim:

> Red-teaming is useful evidence for discovering failure modes and stress-testing safeguards, but it is not proof of safety. Red-team results must be interpreted as one input inside a broader lifecycle risk process that includes context mapping, measurement validity, diverse expertise, field/participatory testing where appropriate, incident monitoring, corrective actions, and post-deployment verification.

Certainty: moderate. The evidence strongly supports the boundary that red-teaming is insufficient by itself. It does not prove exactly which evaluation bundle is sufficient for any given MC component; that requires a component-specific pilot.

## Sources reviewed

1. NIST AI 600-1, *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*, July 2024.
   - URL: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
   - Source type: primary / government technical profile.

2. NIST AI 100-1, *Artificial Intelligence Risk Management Framework (AI RMF 1.0)*, January 2023.
   - URL: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf
   - Source type: primary / government framework.

3. Mazeika et al., *HarmBench: A Standardized Evaluation Framework for Automated Red Teaming and Robust Refusal*, 2024.
   - URL: https://arxiv.org/abs/2402.04249
   - Source type: peer-reviewed/preprint evaluation framework; useful for red-team benchmarking context, not a safety certification.

4. Charnock et al., *Expanding External Access To Frontier AI Models For Dangerous Capability Evaluations*, 2026.
   - URL: https://arxiv.org/abs/2601.11916
   - Source type: recent research on external evaluator access; useful because it identifies access/time/information limits that can reduce evaluation confidence.

## Evidence found

### Facts

- NIST AI 600-1 frames generative AI risk management across governance, content provenance, pre-deployment testing, and incident disclosure. It states that current pre-deployment test approaches can be inadequate, non-systematically applied, or mismatched to deployment contexts.

- NIST AI 600-1 says current testing often remains laboratory-bound or benchmark-bound and may not extrapolate to real-world impacts; gaps can be exacerbated by prompt sensitivity and heterogeneous contexts of use.

- NIST AI 600-1 describes AI red-teaming as an evolving practice used to identify potential adverse behavior and stress-test safeguards, but also states that red-team output quality depends on the background and expertise of the red team and that results require additional analysis before being incorporated into governance and risk management.

- NIST AI RMF 1.0 structures AI risk management through GOVERN, MAP, MEASURE, and MANAGE. It states that risk management should be continuous, timely, lifecycle-wide, and informed by diverse/multidisciplinary perspectives.

- HarmBench shows that automated red-teaming can be benchmarked and can uncover attack/defense behavior, but it does not establish that benchmark success equals real-world safety.

- Recent external-evaluation research argues that limited access, limited information, and short evaluation timeframes can reduce evaluation rigor and confidence.

### Inferences

- MC should treat red-team findings as discovery evidence, not deployment clearance.

- A red-team pass can only support a narrow claim: "No tested actor, within the tested access conditions, using the tested attack classes, produced the specified failure." It does not support the stronger claim: "The system is safe."

- For MC specifically, the highest-risk red-team areas are likely not only jailbreak-style failures. They include health-adjacent interpretation, emotional over-reliance, symbolic over-certainty, privacy leakage, false personalization, accessibility failure, and misleading career/application claims.

## Evaluation criterion added

### MC-REDTEAM-BOUNDARY-01

Any MC or AI-opportunity artifact that cites red-teaming, adversarial testing, prompt attack testing, or challenge results as evidence must state:

1. Tested system/component.
2. Tested deployment context.
3. Tester type: expert, general public, affected user, automated agent, or mixed.
4. Access level available to testers.
5. Time available for testing.
6. Threat / failure classes tested.
7. Threat / failure classes not tested.
8. Whether results were independently reproduced.
9. Whether findings produced a corrective action.
10. Whether corrective action was re-tested.
11. Remaining failure modes and uncertainty.

If these fields are missing, classify the red-team evidence as **exploratory**, not **safety-validating**.

## Falsification checklist

The claim "red-teaming is sufficient evidence of safety" should be treated as false if any of the following occur:

- A failure appears in deployment that was outside the red-team test scope.
- A non-expert user produces a failure experts missed.
- A tested mitigation fixes the demonstration prompt but not the underlying failure class.
- The red-team used insufficient time, access, or domain context.
- Testers did not include affected-user or domain perspectives relevant to the component.
- The evaluation did not document untested failure classes.
- Findings were recorded but no corrective action was implemented.
- Corrective action was not re-tested.
- The same failure class recurs in later artifacts.

## Test plan

### MC-REDTEAM-CLOSURE-PILOT-01

Select 5 high-risk MC components:

1. Body map / nervous-system reflection.
2. Persistent memory / symbolic profile.
3. Scientific-vs-symbolic tone mode.
4. Career opportunity / resume automation.
5. Evidence Engine / GitHub mind updates.

For each component:

1. Define the intended use and misuse cases.
2. Define at least 10 failure classes.
3. Run three tester modes: internal adversarial prompts, domain-informed review, and general-user confusion testing.
4. Record failures using MC-REDTEAM-BOUNDARY-01.
5. Patch or narrow the component.
6. Re-test the same failure class plus near-neighbor cases.
7. Classify the result as Open, Mitigated, Verified, or Accepted Residual Risk.

## Next proof needed

MC-REDTEAM-CLOSURE-PILOT-01 should be executed on the Evidence Engine and body-map reflection path first, because those areas carry the highest risk of overclaiming safety or meaning from incomplete evidence.
