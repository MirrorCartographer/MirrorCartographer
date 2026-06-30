# Evidence Map: Human Oversight / Automation-Bias Boundary

Date: 2026-06-30
Run: Evidence Engine run 21
Claim ID: C-HUMAN-OVERSIGHT-BIAS-01
Status: supported evaluation-design requirement; MC implementation unvalidated

## Claim tested

Mirror Cartographer and the GitHub mind often rely on reviewer checks, human approval, and human-in-the-loop gates as safety and audit controls.

This run tests the weaker assumption underneath that pattern:

> Adding human review is enough to make AI-assisted claims, opportunity packets, symbolic interpretations, or GitHub-mind updates reliable.

## Updated claim

> Human review is necessary for many MC workflows, but it is not sufficient evidence of reliability unless the review process is designed to counter automation bias, anchoring, effort avoidance, unclear authority, and reviewer overreliance on AI-generated framing.

## Why this weak point matters

MC increasingly asks humans or future reviewers to judge AI-assisted artifacts: evidence maps, proof packets, symbolic maps, health-boundary outputs, job-fit packets, red-team results, and proof-film artifacts. If reviewers simply approve AI-shaped conclusions, then human review becomes decorative rather than epistemic.

The danger is not only “AI makes a mistake.” The stronger risk is: AI makes a mistake, frames it confidently, and the human reviewer treats the frame as the default reality.

## Source set

Primary / high-quality sources consulted:

1. NIST AI 600-1, *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile* (July 2024), https://doi.org/10.6028/NIST.AI.600-1
2. Regulation (EU) 2024/1689, Artificial Intelligence Act, Article 14 human oversight, https://data.europa.eu/eli/reg/2024/1689/oj
3. Beck, Eckman, Kern & Kreuter (2025), *Bias in the Loop: How Humans Evaluate AI-Generated Suggestions*, randomized experiment with 2,784 participants, https://arxiv.org/abs/2509.08514
4. Buçinca, Malaya & Gajos (2021), *To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-assisted Decision-making*, https://arxiv.org/abs/2102.09692
5. Laux & Ruschemeier (2025), *Automation Bias in the AI Act: On the Legal Implications of Attempting to De-Bias Human Oversight of AI*, https://arxiv.org/abs/2502.10036

## Evidence found

### Finding 1 — NIST treats Human-AI Configuration as a distinct generative-AI risk

Fact: NIST AI 600-1 identifies “Human-AI Configuration” as a risk category involving arrangements or interactions between humans and AI systems that can result in anthropomorphizing, algorithmic aversion, automation bias, over-reliance, or emotional entanglement.

Inference for MC: MC cannot treat “a human reviewed it” as a clean safety boundary. The human-AI interaction itself is a risk surface.

Boundary: NIST does not provide MC-specific evidence. It supports the need for risk controls, not the claim that MC’s current controls work.

### Finding 2 — The EU AI Act requires more than nominal human oversight

Fact: Article 14 of Regulation (EU) 2024/1689 says high-risk AI systems must be designed so they can be effectively overseen by natural persons. It also requires that assigned humans be able to understand capacities and limitations, monitor operation, remain aware of automation bias, correctly interpret outputs, override or disregard outputs, and intervene or stop the system when needed.

Inference for MC: Oversight must include competence, authority, interpretability, override capacity, and awareness of overreliance. A checkbox saying “reviewed by human” is not enough.

Boundary: The AI Act applies legally to defined regulated contexts. MC should use it as a governance analogy unless MC is in a legally covered high-risk deployment.

### Finding 3 — Experimental evidence shows AI suggestions can degrade human review quality

Fact: Beck et al. report that in a randomized experiment with 2,784 participants, task design and individual attitudes shaped whether humans accepted or corrected AI-generated suggestions. Requiring corrections for flagged AI errors reduced engagement and increased acceptance of incorrect suggestions. Participants more favorable toward automation showed dangerous overreliance; skeptical participants detected errors more reliably.

Inference for MC: Reviewers of MC artifacts may inherit the AI’s framing, especially when correction is costly, the artifact is long, or the reviewer likes the system.

Boundary: The study used a controlled annotation task. It does not prove the same effect size in MC evidence maps, but the mechanism is directly relevant to AI-assisted review.

### Finding 4 — Cognitive forcing can reduce overreliance, but may reduce subjective preference

Fact: Buçinca et al. found that cognitive forcing interventions reduced overreliance compared with simple explainable-AI approaches, but the interventions that reduced overreliance most were rated less favorably by users.

Inference for MC: The best review gates may feel slower, less magical, or less aesthetically satisfying. If MC optimizes only for flow, resonance, or beautiful explanation, it may weaken epistemic resistance.

Boundary: Cognitive forcing is a design family, not a guaranteed fix. MC must test whether its forcing steps improve accuracy without making the system unusable.

### Finding 5 — Legal scholarship warns that automation-bias awareness alone may be too weak

Fact: Laux & Ruschemeier argue that the AI Act’s automation-bias provisions raise enforcement and behavioral-design challenges, and that awareness requirements may not adequately address design and context causes of automation bias.

Inference for MC: Telling reviewers “watch for overreliance” is weaker than building review procedures that force independent judgment, evidence checking, and downgrade paths.

Boundary: This is legal analysis, not an empirical validation of MC or of any single oversight design.

## Fact vs inference table

| Item | Fact | MC inference | Confidence |
|---|---|---|---|
| Human-AI configuration can create overreliance and automation-bias risks | Supported by NIST AI 600-1 | MC review workflows are themselves risk surfaces | High for risk category; moderate for MC transfer |
| Effective oversight requires understanding limits, monitoring, interpretation, override, and intervention | Stated in EU AI Act Article 14 for high-risk AI | MC should define reviewer competence and authority, not only approval | High as governance analogy; legal applicability depends on use case |
| AI suggestions can cause undercorrection and acceptance of wrong suggestions | Supported by randomized experiment | MC reviewers may accept AI-framed claims too easily | Moderate to high mechanism relevance |
| Cognitive forcing can reduce overreliance | Supported by experimental HCI work | MC should test independent-first review and forced counterclaim steps | Moderate; implementation unvalidated |
| Awareness alone may not de-bias oversight | Supported by legal/behavioral analysis | MC must use structured gates, not warnings alone | Moderate |

## Claim-status update

Previous implied claim:

> Human-reviewed MC artifacts are stronger because a person checked them.

Updated claim:

> Human-reviewed MC artifacts are stronger only when the review is independent, structured, logged, and designed to resist automation bias and AI-framing effects.

New status:

**Supported evaluation-design requirement; implementation unvalidated.**

Do not upgrade any MC claim solely because it has human review, user approval, or reviewer signoff.

## Evaluation criterion added

### HUMAN-OVERSIGHT-BIAS-GATE-01

Purpose: Test whether human review of MC artifacts actually catches AI-framed errors rather than rubber-stamping them.

Artifact set:

- 12 existing MC evidence maps or proof packets.
- 6 intentionally seeded AI-framing errors, including:
  1. unsupported confidence upgrade;
  2. missing source limitation;
  3. inference presented as fact;
  4. cherry-picked positive evidence;
  5. claim-status mismatch;
  6. safety boundary omitted.
- 6 clean control artifacts without seeded errors.

Review conditions:

1. **AI-first review:** reviewer sees AI summary, proposed status, and artifact.
2. **Independent-first review:** reviewer records claim, confidence, limitations, and failure conditions before seeing the AI summary.
3. **Forced-counterclaim review:** reviewer must write one plausible reason the claim could be false before assigning status.

Scoring dimensions:

1. Error detection rate.
2. False alarm rate.
3. Unsupported confidence upgrade rate.
4. Ability to separate fact from inference.
5. Correct downgrade or retirement decision.
6. Reviewer confidence calibration.
7. Time-to-review and friction rating.

Threshold for provisional pass:

- Independent-first or forced-counterclaim review must detect at least 80% of seeded errors.
- Unsupported confidence upgrades must remain below 10%.
- Reviewers must correctly separate fact from inference in at least 80% of artifacts.
- The process must not produce more than 20% false alarms on clean controls.

Downgrade rule:

If human review catches fewer than 60% of seeded errors, downgrade any claim that human-reviewed MC artifacts are audit-ready.

Retirement rule:

If AI-first review performs no better than chance or produces frequent unsupported upgrades, retire any repository language implying that “reviewed” means “validated.” Replace with “reviewed for format only” unless the stronger gate is passed.

## Falsification checklist

This claim weakens if any of the following occur:

- Human reviewers accept AI-generated claim statuses without checking source support.
- Reviewers are more likely to approve claims after reading polished AI summaries.
- Reviewers miss seeded inference/fact substitutions.
- Reviewers detect obvious citation absence but miss source limitation or construct-validity problems.
- Reviewers prefer the most fluent artifact even when it is less accurate.
- Forced counterclaim review improves accuracy but is abandoned because it feels less elegant.

## Implementation notes

MC review interfaces should add:

- independent-first reviewer notes before AI summary exposure;
- explicit “what would falsify this?” field;
- fact/inference split field;
- confidence downgrade option visible before upgrade option;
- reviewer authority field: format review, evidence review, safety review, or empirical validation;
- friction tracking, because low-friction review may be low-resistance review.

## Next proof needed

Run `HUMAN-OVERSIGHT-BIAS-GATE-01` on 12 existing MC artifacts. Compare AI-first review against independent-first and forced-counterclaim review. The next proof must show whether human review actually catches seeded MC evidence errors, or whether it merely makes AI-shaped conclusions feel socially confirmed.
