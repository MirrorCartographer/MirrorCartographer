# Evidence Map — Symbolic Relevance Masks Need Validation

Date: 2026-06-28
Status: claim narrowed; promising inference, not proven MC feature
Public-safe scope: no private user material; architecture-only language

## Claim tested

Mirror Cartographer should use a **Symbolic Relevance Mask** layer: for each symbolic scene or interpretation, the system should separate:

- signal / potentially relevant elements
- likely irrelevant noise
- missing context
- uncertain elements
- storage limits
- action or memory effects

The stronger version of the claim was:

> Relevance masks will make reflective symbolic AI more robust, safer, and more agency-preserving.

## Evidence found

### 1. Robotics evidence supports the mechanism, not the reflective conclusion

Masked IRL shows that demonstrations alone can be ambiguous because they show *how* a task was performed but not always *what mattered*. The paper uses language plus demonstrations to infer state-relevance masks and enforce invariance to irrelevant state components. It reports improved generalization, robustness to ambiguous language, and up to 4.7x fewer demonstrations than prior language-conditioned approaches.

Evidence strength for MC: medium for the mechanism, low-to-medium for direct transfer.

Reason: the source validates relevance masking in robot reward learning, not symbolic self-reflection.

### 2. Human-AI evidence warns that explanations and feature signals do not automatically improve judgment

Current HAI/XAI evidence is mixed. Explanation-based decision support can improve performance in some cases, but explanation type alone is not consistently decisive. Some studies show explanations can reduce overreliance when they lower the cost of verification; others show feature-based explanations can increase overreliance when users reconcile them poorly with their own intuition.

Evidence strength for MC: medium.

Reason: MC should not assume that exposing “relevant features” automatically preserves agency. The mask must support verification and contestability, not just look explanatory.

### 3. Governance evidence supports claim decomposition and evidence binding

Recent assurance/control-plane work frames trustworthy AI as continuous, evidence-bound posture rather than static labels. This supports treating each MC interpretation as a claim-bearing object with evidence, uncertainty, controls, and review state.

Evidence strength for MC: medium for process architecture, low for user outcome claims.

Reason: governance frameworks support evidence binding and continuous verification, but do not prove reflective benefits.

## Fact vs inference

### Facts supported by sources

- Demonstrations and language can be individually ambiguous.
- A relevance-mask mechanism can reduce attention to irrelevant state components in a robot reward-learning setting.
- Masked IRL reported better performance and lower data requirements in its tested settings.
- XAI effects on human performance and reliance are inconsistent across studies.
- Explanations can reduce overreliance when they make verification more worthwhile or easier.
- Feature-based explanations can also increase overreliance in some contexts.
- Continuous assurance approaches favor decomposing claims and binding them to evidence.

### MC-specific inferences

- Symbolic interpretations may overfit to salient but irrelevant details, similar to reward models overfitting to spurious state features.
- A Symbolic Relevance Mask may help users distinguish what the system is using, ignoring, unsure about, or refusing to store.
- The mask should be soft and contestable rather than a hard deletion mechanism.
- The mask should be evaluated as an agency-preserving interface, not assumed beneficial because it is transparent.

## Updated claim status

Previous working claim:

> MC should add relevance masks to make symbolic interpretation more accurate.

Updated claim:

> MC should test a soft, contestable Symbolic Relevance Mask because evidence from robot reward learning supports relevance filtering under ambiguity, while human-AI evidence warns that feature explanations can either improve or harm user judgment depending on verification cost, context, and user agency.

Confidence: moderate for prototyping; low for outcome claims until tested with MC users.

## Design requirement added

### Symbolic Relevance Mask Requirement

For every medium/high-impact interpretation, MC must expose a user-visible mask with six fields:

1. **Used signals** — what the interpretation relied on.
2. **Ignored elements** — what was present but intentionally not used.
3. **Uncertain elements** — what may matter but lacks enough context.
4. **Missing context** — what would change the reading.
5. **Memory rule** — store, do not store, ask first, or temporary only.
6. **Contest action** — keep, weaken, split, rename, ignore, or reject.

The mask must be editable. User correction must override the AI mask unless the system is applying a safety boundary.

## Falsification checklist

This pattern should be weakened or rejected if testing shows that users:

- treat masked elements as objective truth rather than system interpretation
- over-trust the AI because the mask looks technical
- feel interrupted without understanding why the mask appeared
- cannot identify what the system used vs ignored
- cannot correct the mask easily
- remember the AI mask as their own conclusion
- find the mask more burdensome than helpful for low-impact reflections
- lose symbolic flow because every scene becomes database work

## Evaluation criterion

### Relevance Mask Comprehension Score

A user passes the mask comprehension check if, after one MC interaction, they can correctly answer:

- What did MC use to generate the interpretation?
- What did MC ignore?
- What did MC mark as uncertain?
- What would change the interpretation?
- What will be stored or not stored?
- How can the user correct the interpretation?
- Which parts came from the user vs the AI?

Target for prototype v0.1: at least 80% correct answers on medium-impact examples without reducing reported agency below baseline.

## Prototype test plan

Create `symbolic-relevance-mask-testset-v0.1` with 40 scenes:

- 10 low-impact symbolic scenes
- 10 medium-impact self-reflection scenes
- 10 ambiguous identity-adjacent scenes
- 10 noisy scenes with irrelevant vivid details

Compare two UI variants:

- Variant A: normal MC interpretation
- Variant B: MC interpretation plus Symbolic Relevance Mask

Measure:

- source attribution accuracy
- overreliance on AI interpretation
- confidence calibration
- correction rate
- comprehension of memory effects
- perceived flow cost
- perceived agency

## Next proof needed

Build the testset and run a small human study or structured self-test with blinded examples.

Core question:

> Can users understand and contest what MC considered relevant without over-trusting the mask or losing symbolic flow?

If yes, move Symbolic Relevance Mask into core MC requirements for medium/high-impact interpretations.

If no, restrict it to optional advanced mode or use a lighter display such as “Used / Unsure / Not saving.”
