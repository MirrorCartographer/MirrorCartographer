# Evidence Map — LLM Judge Evaluation Validity Boundary

Date: 2026-07-03
Claim ID: C-LLM-JUDGE-EVALUATION-VALIDITY-01R
Status: Partially supported as an efficiency/scaling method; unvalidated as a standalone source of truth for Mirror Cartographer evaluation.

## Claim tested

Mirror Cartographer can use LLM-based judges to score reflection quality, symbolic coherence, insight quality, safety, accessibility, or opportunity quality, and those scores can be treated as meaningful evaluation evidence.

## Why this claim matters

The current GitHub mind contains many proposed pilots and rubrics. If those pilots rely mainly on LLM scoring, the evaluation layer may accidentally validate MC's preferred style rather than measuring user benefit, accuracy, safety, or usability.

## Evidence found

### Supported by high-quality sources

1. NIST AI RMF frames trustworthy AI as requiring risk management across design, development, use, and evaluation. It identifies Govern, Map, Measure, and Manage as core functions, meaning evaluation should be part of a managed lifecycle rather than a one-off score.
   Source: NIST AI Risk Management Framework, https://www.nist.gov/itl/ai-risk-management-framework

2. NIST AIRC states that the AI RMF is intended to improve trustworthiness considerations in the design, development, use, and evaluation of AI systems, and that use-case profiles should reflect the user's setting, risk tolerance, and resources.
   Source: NIST AI Resource Center AI RMF, https://airc.nist.gov/airmf-resources/airmf/

3. Zheng et al. (2023) found that strong LLM judges can approximate human preferences in some open-ended assistant evaluations, with reported agreement comparable to human-human agreement in their setting. The same paper also reports limitations including position bias, verbosity bias, self-enhancement bias, and limited reasoning ability.
   Source: Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena," arXiv:2306.05685, https://arxiv.org/abs/2306.05685

4. Shi et al. (2024) systematically studied position bias in LLM-as-a-Judge across 12 judge models, 22 tasks, and more than 100,000 evaluation instances. They found that capable LLM judges can show non-random position bias and that bias varies by judge and task.
   Source: Shi et al., "Judging the Judges: A Systematic Study of Position Bias in LLM-as-a-Judge," arXiv:2406.07791, https://arxiv.org/abs/2406.07791

5. Wataoka et al. (2024) found evidence of self-preference bias, including GPT-4 showing a significant degree of self-preference bias in their experiments. They argue LLM judges may favor outputs that are more familiar or lower-perplexity, not necessarily more correct or more beneficial.
   Source: Wataoka et al., "Self-Preference Bias in LLM-as-a-Judge," arXiv:2410.21819, https://arxiv.org/abs/2410.21819

6. Yang et al. (2026) proposes a framework for quantifying and mitigating self-preference bias and reports that advanced capabilities are not necessarily correlated with low self-preference bias. This strengthens the need for bias checks even when using frontier or high-performing judge models.
   Source: Yang et al., "Quantifying and Mitigating Self-Preference Bias of LLM Judges," arXiv:2604.22891, https://arxiv.org/abs/2604.22891

## Fact vs inference

### Facts supported by the evidence

- LLM-as-judge can be useful and scalable for some open-ended evaluation tasks.
- LLM judges can agree with human preference judgments in specific benchmark settings.
- LLM judges can exhibit position bias, verbosity bias, self-enhancement/self-preference bias, and task-dependent failure modes.
- NIST-style AI assurance requires lifecycle evaluation, measurement, and risk management rather than isolated scoring artifacts.

### Inferences not yet demonstrated for Mirror Cartographer

- MC's own reflection/symbolic/usability/safety rubrics can be reliably scored by an LLM judge.
- LLM scores of "insight," "symbolic coherence," or "orientation value" predict actual user benefit.
- An LLM judge can safely evaluate crisis-boundary failures or diagnostic-boundary failures without human adjudication.
- A judge model will not favor MC outputs merely because they are longer, more poetic, more internally coherent, or more similar to the judge's preferred style.

## Claim-status update

C-LLM-JUDGE-EVALUATION-VALIDITY-01R:
LLM judges are acceptable as a low-cost triage and consistency tool for Mirror Cartographer, but not as standalone proof of user benefit, safety, accessibility, therapeutic value, career fit, or market validation. Any MC evaluation using LLM judges must be labeled "machine-scored preliminary evidence" until calibrated against human or external outcome evidence.

Confidence: Moderate for the boundary; low for MC-specific validity because no MC judge calibration study has been completed.

## Evaluation criterion added

### LLM Judge Use Gate

An MC evaluation may use LLM judging only if it records:

1. Construct being scored.
2. Judge model/version/date.
3. Full scoring rubric.
4. Whether outputs are single-answer, pairwise, or ranked.
5. Randomized or counterbalanced output order for pairwise comparisons.
6. Length/verbosity control or length sensitivity check.
7. At least one adversarial style-control example.
8. Human calibration sample or explicit statement that none exists.
9. Inter-judge or repeat-run stability check.
10. Bias audit: position, verbosity, self-preference/familiarity, and style preference.
11. Escalation rule for high-stakes categories: crisis, medical, legal, financial, diagnostic, or employment-impact claims.
12. Status label: preliminary, calibrated, replicated, or retired.

## Falsification checklist

A Mirror Cartographer LLM-judge metric must be revised or retired if any of the following occur:

- Human reviewers disagree with the LLM judge on more than 25% of sampled cases after rubric clarification.
- Reversing answer order changes the pairwise winner in more than 10% of cases where quality difference is not intentionally ambiguous.
- Longer outputs receive higher scores despite no added task-relevant information.
- MC-style symbolic outputs beat plain outputs on judge score but lose on human comprehension or actionability.
- The judge misses any S3/S4 safety failure in a crisis, medical, diagnostic, legal, or financial boundary test.
- The judge's explanation cites qualities not present in the evaluated output.

## Test plan

Test ID: MC-LLM-JUDGE-CALIBRATION-PILOT-01

Sample:
- 60 MC outputs across reflection, symbolic mapping, opportunity analysis, evidence maps, accessibility summaries, and safety-boundary responses.
- 20 paired comparisons: MC-style output vs plain structured output.
- 20 adversarial cases: verbose but low-value, poetic but unsupported, confident but false, safe but less satisfying, concise but accurate.
- 20 high-risk boundary cases: crisis, diagnostic, career-impact, market-claim, and privacy-memory scenarios.

Procedure:
1. Score all examples with the LLM judge using the published rubric.
2. Re-score with output order reversed for paired comparisons.
3. Re-score a random 25% sample to measure repeat stability.
4. Collect at least two human ratings per item for usefulness, comprehension, factual support, and safety-boundary correctness.
5. Compare LLM scores against human ratings and safety flags.
6. Publish agreement rates, failure clusters, and decision on whether each metric is preliminary, calibrated, revised, or retired.

Acceptance threshold for promotion from preliminary to calibrated:
- >= 0.70 agreement/correlation with human ratings for low-risk quality metrics.
- 0 known missed high-risk boundary failures in the pilot sample.
- Position-bias reversal rate <= 10% for non-ambiguous pairwise cases.
- Verbosity-only advantage not observed after controlling for task-relevant content.

## Next proof needed

Run MC-LLM-JUDGE-CALIBRATION-PILOT-01 before using LLM judge scores as claim support in the GitHub mind. Until then, LLM-judged scores should be treated as internal triage signals, not validated evidence.