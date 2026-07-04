# Evidence Map: Artifact-Centered Sensemaking Is Not Proof of Better Reasoning

Date: 2026-07-04
Run: Evidence Engine 117
Status: Claim narrowed

## Claim tested

Mirror Cartographer's evidence maps, symbolic maps, and structured artifacts improve reasoning because they externalize thinking into inspectable objects.

## Updated claim status

NARROWED.

Structured artifacts can plausibly support reflection, metacognition, critique, and deliberative sensemaking, but they do not by themselves prove better reasoning, better decisions, or durable cognitive improvement. The artifact becomes evidence of improved reasoning only when it can be compared against a baseline and shown to improve defined reasoning outcomes.

## Why this weak point matters

Mirror Cartographer has many artifacts: evidence maps, claim-status updates, symbolic records, decision logs, body maps, and project demonstrations. The current weak point is that producing a well-structured artifact can feel like progress even when it has not yet changed belief accuracy, action quality, error detection, user agency, or falsifiability.

This update prevents a category error:

- Artifact existence = documentation signal.
- Artifact structure = plausibility signal.
- Measured improvement in reasoning or action = evaluation signal.

## Evidence found

### Fact: AI tools for thought are an active research target, not a solved capability

A 2025 CHI Tools for Thought workshop synthesis frames generative AI as both an opportunity and a risk for human cognition, including metacognition, critical thinking, memory, and creativity. It calls for theories, metrics, and design practices that can determine whether AI tools protect or augment thought rather than merely automate it.

Source: Tankelevitch et al., "Understanding, Protecting, and Augmenting Human Cognition with Generative AI," 2025.

### Fact: Metacognitive prompts may increase active engagement, but effects depend on context and user traits

A 2025 study of metacognitive prompts in generative-AI search found that prompts led students to broader exploration, deeper inquiry, and more evaluation of AI responses. The study also reports that effectiveness varied with metacognitive flexibility.

Source: Singh, Guan, and Rieh, "Enhancing Critical Thinking in Generative AI Search with Metacognitive Prompts," 2025.

### Fact: Critical thinking in AI use can be operationalized as verification, motivation, and reflection

A 2025/2026 scale-development paper conceptualizes critical thinking in AI use around verifying AI-generated information, understanding model limitations, and reflecting on broader implications of relying on AI. The work reports validation across multiple studies and connects higher critical-thinking scores with more diverse verification strategies and better veracity judgment in a ChatGPT-powered fact-checking task.

Source: Lau et al., "Understanding Critical Thinking in Generative Artificial Intelligence Use," 2025.

### Fact: Explanations and structured AI support can increase overreliance when the AI is wrong

Human-AI decision-making research has found inconsistent benefits from AI explanations and warns that explanations can increase overreliance on incorrect AI outputs. This matters because Mirror Cartographer artifacts may appear coherent and therefore become over-trusted unless they are explicitly falsifiable and uncertainty-labeled.

Source: Chen, Liao, Vaughan, and Bansal, "Understanding the Role of Human Intuition on Reliance in Human-AI Decision-Making with Explanations," 2023.

## Inference

Mirror Cartographer should treat artifact-centered sensemaking as a candidate mechanism, not a validated result.

The stronger version of the claim is:

MC artifacts may improve reasoning when they cause observable gains in at least one bounded outcome: error detection, claim calibration, source verification, alternative-hypothesis generation, decision clarity, action follow-through, or successful falsification.

The weaker unsupported claim is:

MC artifacts improve reasoning because they are detailed, structured, emotionally resonant, or visually/symbolically coherent.

## Evaluation criterion added

### MC-COGNITION-ARTIFACT-01: Artifact-centered reasoning test

A Mirror Cartographer artifact can be classified as reasoning-support evidence only if it records at least one measurable reasoning outcome.

Required fields:

1. Baseline state: what the user/system believed, planned, or failed to distinguish before the artifact.
2. Artifact intervention: what structure was introduced, such as evidence map, symbol map, test plan, contradiction table, body map, or decision map.
3. Target reasoning outcome: error detection, uncertainty calibration, alternative generation, source verification, decision clarity, boundary recognition, or action quality.
4. Comparison condition: no artifact, freeform note, unstructured chat, earlier artifact, or blinded reviewer judgment.
5. Measurement method: rubric, task score, reviewer agreement, pre/post comparison, prediction accuracy, or follow-through check.
6. Failure condition: a concrete result that would show the artifact did not help.
7. Overreliance check: whether artifact coherence caused unsupported confidence.
8. Claim-status effect: maintain, narrow, downgrade, or falsify.

## Claim-status update

Previous implicit claim:

Structured MC artifacts improve reasoning by preserving relationships between fragments.

Updated claim:

Structured MC artifacts preserve relationships between fragments and may support reasoning, but improved reasoning is only established when bounded reasoning outcomes improve against a baseline or comparison condition.

## Falsification checklist

The claim should be downgraded further if pilot testing shows any of the following:

- Users trust artifact conclusions more despite no improvement in evidence quality.
- Users become less likely to check sources after receiving a polished artifact.
- Symbolic coherence increases confidence while reducing factual accuracy.
- Reviewers cannot reconstruct what changed because of the artifact.
- The artifact does not improve alternative-hypothesis generation.
- The artifact does not improve claim calibration.
- The artifact produces more action paralysis or confusion than the baseline.

## Test plan

### MC-ARTIFACT-SENSEMAKING-PILOT-01

Run a 24-item pilot using existing Mirror Cartographer material.

Conditions:

1. Raw chat excerpt only.
2. Freeform summary.
3. Structured evidence map.
4. Structured evidence map with explicit falsification checklist.

Tasks:

- Identify the central claim.
- Separate fact, inference, metaphor, and action.
- Identify unsupported certainty.
- Generate at least two alternative explanations.
- Name the next proof needed.
- Decide whether to maintain, narrow, downgrade, or falsify the claim.

Measures:

- Claim-boundary accuracy.
- Source-verification behavior.
- Unsupported-certainty detection.
- Alternative-hypothesis count and quality.
- Reviewer agreement.
- Time-to-actionable-next-proof.
- Overconfidence delta after reading the artifact.

Pass threshold:

The structured artifact condition must outperform raw chat and freeform summary on at least four of the seven measures without increasing overconfidence.

## Next proof needed

MC-ARTIFACT-SENSEMAKING-PILOT-01.

Until that pilot is run, the repository should classify artifact-centered sensemaking as a plausible design hypothesis, not a demonstrated cognitive improvement.
