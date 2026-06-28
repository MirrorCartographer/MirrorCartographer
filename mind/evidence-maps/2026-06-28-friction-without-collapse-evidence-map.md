# Evidence Map: Friction Without Collapse

Date: 2026-06-28
Status: public-safe / no personal material

## Claim tested

Mirror Cartographer can use lightweight friction controls — challenge prompts, assumption checks, rollback, and influence-scope review — to reduce false acceptance of AI interpretations without collapsing the experience into paperwork or killing generative flow.

## Claim status

**Partially supported as a design hypothesis. Not proven for MC.**

The literature supports the underlying risk: users can over-rely on AI outputs, especially when the AI appears fluent, useful, or explanatory. There is also evidence that cognitive forcing functions can reduce overreliance in some AI-assisted decision settings. However, this does **not** prove that MC's specific symbolic-reflective interface will improve agency, truth-tracking, or user learning. MC still needs direct prototype testing.

## Evidence found

### 1. Overreliance is a real human-AI interaction risk

**Fact:** A 2025/2026 living review chapter, *Addressing Overreliance on AI*, defines overreliance as users accepting incorrect AI outputs and describes it as a major risk because users often struggle to identify AI mistakes. The review spans 120+ papers and identifies antecedents, mechanisms, measurements, and mitigation strategies including cognitive forcing and uncertainty expressions.

**Use for MC:** The architecture should treat false acceptance as a first-class safety failure, not a rare edge case.

**Source:** https://link.springer.com/rwe/10.1007/978-981-97-8440-0_98-1

### 2. Explanations alone are not enough

**Fact:** Buçinca, Malaya, and Gajos found that people supported by AI decision tools can over-rely on AI suggestions and that explanations alone do not reliably reduce overreliance. Their cognitive forcing interventions reduced overreliance compared with simple explainable-AI designs, but the most effective designs received less favorable subjective ratings and did not benefit all users equally.

**Use for MC:** MC should not assume that showing provenance, uncertainty, or explanation automatically preserves agency. Explanation must be paired with interaction that makes the user actively inspect, revise, or constrain the interpretation.

**Source:** https://doi.org/10.1145/3449287 and https://arxiv.org/abs/2102.09692

### 3. Friction must be designed for cognitive diversity

**Fact:** A 2025 study of developers' trust and adoption of generative AI found that system/output quality, functional value, goal maintenance, contextual transparency, cognitive burden, and cognitive diversity all affect trust and adoption. The authors argue that generative-AI tools must align with users' goals, reduce cognitive burden, and provide equitable interaction support.

**Use for MC:** A friction layer that helps one user may exhaust or exclude another. MC needs adjustable friction rather than one universal “safety checklist.”

**Source:** https://arxiv.org/abs/2505.17418

### 4. Plan-level cognitive forcing is newly relevant for generative AI

**Fact:** A 2026 experimental study on cognitive forcing functions for AI-generated execution plans in AI-assisted writing found that assumption-focused forcing reduced overreliance without increasing cognitive load in their setting, while what-if forcing was perceived as helpful. The authors frame AI-generated plans themselves as objects of possible overreliance.

**Use for MC:** MC should treat not only final interpretations, but also AI-generated plans, maps, rituals, schemas, and roadmaps as inspectable objects.

**Source:** https://arxiv.org/abs/2601.18033

### 5. Continuous assurance is better than static trust labels

**Fact:** 2026 assurance work argues that point-in-time, document-based audits struggle with nondeterministic, rapidly changing AI systems, and proposes evidence-gated assurance objects and ongoing posture signals.

**Use for MC:** A one-time “safe / unsafe” label is too weak. MC should track claim status, evidence links, usage boundaries, and revision state over time.

**Source:** https://arxiv.org/abs/2603.03340

## Fact vs inference

### Facts supported by external sources

- AI overreliance is a documented risk in human-AI decision-making.
- Explanations alone do not reliably produce calibrated reliance.
- Cognitive forcing functions can reduce overreliance in some controlled settings.
- Stronger friction can reduce user satisfaction or affect users unevenly.
- Generative-AI workflows introduce overreliance risk not only at final-answer level but also at plan/review level.
- Trust/adoption depend on goal alignment, cognitive burden, and cognitive diversity.

### MC-specific inferences

- MC should implement challengeable Interpretation Objects rather than static AI interpretations.
- MC should make friction adjustable by risk tier, user state, and artifact type.
- MC should track “friction cost” as a design metric, not only safety benefit.
- MC should preserve flow for low-risk symbolic play but increase challenge prompts when an interpretation may affect memory, self-description, decisions, or external publication.

These are design inferences, not established facts.

## Evaluation criterion: Friction Without Collapse

A friction control is successful only if it satisfies all four conditions:

1. **False acceptance reduction:** Users accept fewer unsupported or misleading interpretations than in a no-friction baseline.
2. **Agency preservation:** Users can reject, revise, quarantine, or narrow an interpretation without losing the thread.
3. **Flow survival:** The interaction still feels like reflective exploration, not compliance paperwork.
4. **Equity check:** The control does not only help users who already enjoy analytic inspection; it must remain usable for symbolic, emotional, spatial, and low-energy cognitive styles.

## Test plan

### Prototype variants

Test the same symbolic-reflective prompt across five interface conditions:

1. **Plain Interpretation:** AI gives interpretation directly.
2. **Explanation Only:** AI gives interpretation plus rationale/provenance.
3. **Checklist Friction:** AI requires a brief challenge checklist before acceptance.
4. **Interpretation Object:** AI output is an object with evidence, uncertainty, influence scope, rollback, and user revision controls.
5. **Adaptive Friction:** Same as Interpretation Object, but friction increases only when the interpretation affects memory, self-description, decision-making, or publication.

### Minimal task set

Use 12 public-safe synthetic scenarios:

- 4 low-risk symbolic reflection prompts
- 4 medium-risk memory/self-description prompts
- 4 high-risk decision/public-artifact prompts

Each scenario includes one deliberately unsupported leap, one plausible but uncertain inference, and one useful grounded observation.

### Measures

- Unsupported-leap acceptance rate
- User correction rate
- Accurate uncertainty identification
- Successful rollback/quarantine rate
- Time-to-completion
- Self-reported flow
- Self-reported irritation or paperwork feeling
- Whether the user can accurately explain what the interpretation is allowed to influence

## Falsification checklist

The claim should be weakened or rejected if testing shows any of the following:

- Friction does not reduce unsupported-leap acceptance compared with explanation-only.
- Users ignore or rubber-stamp the controls.
- Users feel less agency because the safety layer becomes bossy or bureaucratic.
- Flow drops sharply for low-risk symbolic use.
- The controls disproportionately help analytic users while exhausting symbolic/spatial/emotional users.
- Users cannot explain influence scope after using the interface.
- Rollback/quarantine exists visually but does not change later system behavior.

## Requirements update

Add a requirement to MC architecture:

**R-FRICTION-01: Adaptive Challenge Layer**

MC must not rely on explanation, citation, or uncertainty labels alone. Any interpretation that can affect memory, self-description, decisions, shared artifacts, or future recommendations must pass through an adaptive challenge layer that supports:

- user rejection
- user revision
- confidence weakening
- influence-scope narrowing
- quarantine/no-memory mode
- rollback
- public-safe provenance summary

Low-risk symbolic play should remain low-friction unless the user escalates it or the system detects a move from exploration into durable claim, memory, decision, or publication.

## Next proof needed

Build the five-condition micro-prototype and run the 12-scenario test. The immediate proof target is not “MC improves thinking.” The narrower proof target is:

**Does adaptive friction reduce unsupported acceptance while preserving reflective flow better than explanation-only or checklist-only designs?**
