# Evidence Map — Symbolic Map as Cognitive Orientation Scaffold

Date: 2026-07-02
Run ID: Evidence Engine run 75
Claim ID: C-SYMBOLIC-MAP-COGNITIVE-ORIENTATION-01R
Status: Partially supported as a design hypothesis; unvalidated as a Mirror Cartographer benefit claim.

## Claim tested

Mirror Cartographer's symbolic / spatial mapping interface helps users orient their thoughts because externalized symbolic maps act as cognitive scaffolds.

## Why this weak point matters

This claim is central to MC's value proposition. If symbolic mapping only feels meaningful but does not improve orientation, recall, decision quality, or action selection, then MC may be aesthetically compelling without being functionally useful. The claim needs evidence beyond subjective resonance.

## Evidence found

### Source 1 — NIST AI RMF

Source: NIST AI Risk Management Framework overview.
URL: https://www.nist.gov/itl/ai-risk-management-framework

Relevant fact:
- NIST describes the AI RMF as a framework for incorporating trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems.
- NIST states that AI risk management concerns risks to individuals, organizations, and society.

Implication for MC:
- MC cannot treat symbolic usefulness as self-evident. It needs evaluation tied to specific outcomes: user comprehension, task success, calibrated trust, and risk detection.

### Source 2 — Ho et al., 2021, simplified mental representations for planning

Source: Ho, Abel, Correa, Littman, Cohen, and Griffiths, "People construct simplified mental representations to plan."
URL: https://arxiv.org/abs/2105.06948

Relevant fact:
- The paper argues that useful representations do not mirror every aspect of the world; they select a manageable subset of details relevant to a purpose.
- In preregistered behavioral experiments, value-guided construal predicted participants' awareness and recall of task elements.
- The authors frame useful representations as balancing complexity against utility for planning and acting.

Implication for MC:
- This supports the narrower design principle that a map can aid planning when it simplifies complexity in a goal-relevant way.
- It does not prove that MC's symbolic maps select the right details or improve real user planning.

### Source 3 — Risko and Gilbert, 2016, cognitive offloading

Source: Risko and Gilbert, "Cognitive Offloading," Trends in Cognitive Sciences, 2016.
Reference landing/search support: https://www.sciencedirect.com/science/article/abs/pii/S1364661316301215

Relevant fact:
- Cognitive offloading is the use of physical action or external tools to reduce cognitive demand.
- External tools can change what users need to remember internally, but they may also shift dependence onto the tool.

Implication for MC:
- MC maps may help by externalizing memory, structure, and relationships.
- A tool that reduces internal demand can also create stale dependence, misplaced confidence, or reduced independent recall if not tested.

### Source 4 — Microsoft Guidelines for Human-AI Interaction

Source: Amershi et al., "Guidelines for Human-AI Interaction," CHI 2019 / Microsoft Research.
URL: https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/

Relevant fact:
- The guidelines were validated through multiple evaluation rounds, including a user study with 49 design practitioners testing the guidelines against 20 AI-infused products.
- Microsoft describes the guidelines as a design resource, not proof that any given AI product is usable or safe.

Implication for MC:
- MC needs scenario-based evaluation of user interaction failures, especially where symbolic outputs may be persuasive, confusing, overly personalized, or hard to dismiss.

## Fact / inference separation

### Supported facts

- External or simplified representations can reduce cognitive complexity when they select goal-relevant information rather than mirror everything.
- People appear to control task construals in planning contexts, and those construals can be measured through awareness, recall, and behavior.
- External tools can offload cognitive work.
- Human-AI interaction quality requires evaluation, not only design intent.

### Reasonable but unproven MC-specific inferences

- MC symbolic maps improve user orientation.
- MC's selected symbols preserve the right task-relevant details.
- MC spatialization improves recall, planning, or emotional regulation compared with plain text reflection.
- MC's aesthetic / symbolic form reduces cognitive load rather than adding interpretive load.
- Users can distinguish map usefulness from map beauty or emotional resonance.

### Unsupported or overstated versions to avoid

- "Symbolic maps make MC more accurate."
- "MC externalizes cognition, therefore it is therapeutic."
- "If a user feels seen by a map, the map has improved orientation."
- "More symbolic detail means better understanding."

## Claim-status update

C-SYMBOLIC-MAP-COGNITIVE-ORIENTATION-01R:

Mirror Cartographer's symbolic map interface is supported only as a plausible cognitive-scaffolding design hypothesis. Evidence from planning, external representation, and cognitive offloading supports the general mechanism that external simplified representations can aid cognition under some conditions. MC-specific benefit remains unvalidated until tested against task outcomes, comprehension, recall, action selection, and risk flags.

## Evaluation criterion added

### MC-COGNITIVE-ORIENTATION-GATE-01

A Mirror Cartographer output may claim "orientation aid" only if it passes all of the following:

1. Goal relevance: The map identifies the user's active question, decision, or uncertainty.
2. Compression: The map reduces complexity without deleting safety-critical or decision-critical details.
3. Traceability: Every symbol or node links back to user-provided input, cited evidence, or an explicitly labeled inference.
4. Action bridge: The map produces at least one concrete next action or testable distinction.
5. Calibration: The output names what the map does not prove.
6. Recall test: After a delay, the user or reviewer can reconstruct the central structure better than from plain text alone.
7. Decision test: The map improves choice clarity, error detection, or prioritization compared with a non-symbolic baseline.
8. Risk check: The map does not create false certainty, dependency, therapeutic claims, or unsupported self-diagnosis.

## Test plan

### MC-SYMBOLIC-MAP-ORIENTATION-PILOT-01

Design:
- Collect 30 representative MC prompts involving confusion, planning, emotional-symbolic reflection, or project navigation.
- Produce two outputs for each prompt:
  1. symbolic / spatial MC map,
  2. plain structured reflection without symbolic mapping.
- Blind the reviewer to which output is the MC-preferred design.

Measures:
- comprehension score,
- perceived orientation,
- delayed recall of key relationships,
- number of actionable next steps identified,
- number of unsupported inferences detected,
- false-certainty flags,
- emotional over-identification flags,
- decision usefulness rating,
- reviewer preference with explanation.

Pass condition:
- Symbolic maps outperform plain structured reflection on comprehension, delayed recall, and decision usefulness without increasing false-certainty or over-identification flags.

Fail condition:
- Symbolic maps are preferred aesthetically but do not improve task outcomes.
- Symbolic maps increase unsupported inference, emotional over-identification, or user dependence.
- Plain text performs equal or better on the core outcome metrics.

## Falsification checklist

This claim should be weakened or retired if testing shows that symbolic maps:

- increase perceived insight without improving recall or action quality,
- introduce more unsupported assumptions than plain text,
- make users more confident without better evidence,
- reduce ability to explain the reasoning chain,
- cause reviewers to disagree about what the symbols mean,
- fail accessibility checks,
- or perform worse for stressed, medically anxious, or emotionally vulnerable prompts.

## Next proof needed

Run MC-SYMBOLIC-MAP-ORIENTATION-PILOT-01 on 30 prompt pairs and publish a comparison ledger. The next proof should show whether symbolic mapping adds measurable orientation value beyond aesthetic resonance and ordinary structured reflection.
