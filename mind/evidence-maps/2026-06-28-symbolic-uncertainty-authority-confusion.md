# Evidence Map: Symbolic Uncertainty Markers May Create Authority Confusion

Date: 2026-06-28
Status: Evidence-supported risk; MC benefit unproven
Public-safety note: This artifact abstracts all personal/private material. It treats Mirror Cartographer (MC) as a reflective AI interface pattern, not as a medical, therapeutic, legal, or diagnostic authority.

## Claim tested

MC assumption under test:

> A visually rich symbolic uncertainty/status layer can help users distinguish user-confirmed meaning, AI-inferred meaning, uncertainty, blocked influence, conflict, and rollback without making the uncertain symbol feel deeper, truer, more identity-defining, or more authoritative.

## Bottom line

The risk is supported by human-AI interaction evidence. The proposed MC design is not yet proven.

High-quality evidence supports these narrower points:

1. Users can overrely on AI recommendations, especially when verification is costly.
2. Explanations and confidence/uncertainty indicators do not automatically calibrate trust.
3. Cognitive forcing can reduce overreliance, but may reduce subjective experience or benefit some users more than others.
4. Uncalibrated AI confidence can produce both misuse and disuse.
5. Continuous or saturated uncertainty encodings may help users recognize limitations better than binary uncertainty flags in some contexts, but effects are task- and expertise-dependent.

MC inference:

Symbolic uncertainty visuals should be treated as a risk-bearing interface element, not as an obviously safer alternative to text disclosure or dashboards.

## Evidence reviewed

### Source 1: Buçinca, Malaya, and Gajos — cognitive forcing and overreliance

Reference: Zana Buçinca, Maja Barbara Malaya, Krzysztof Z. Gajos. “To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-assisted Decision-making.” 2021. https://arxiv.org/abs/2102.09692

Fact:
- In an experiment with 199 participants, cognitive forcing interventions reduced overreliance compared with simple explainable-AI approaches.
- The strongest overreliance-reducing designs received less favorable subjective ratings.
- Benefits varied with users’ Need for Cognition.

Inference for MC:
- If MC adds friction to make users verify symbolic uncertainty, it may reduce false certainty but could also damage reflective flow or feel annoying.
- The design cannot assume one visual/control style works equally well for all users.

### Source 2: Vasconcelos et al. — verification cost determines explanation usefulness

Reference: Helena Vasconcelos, Matthew Jörke, Madeleine Grunde-McLaughlin, Tobias Gerstenberg, Michael Bernstein, Ranjay Krishna. “Explanations Can Reduce Overreliance on AI Systems During Decision-Making.” 2022. https://arxiv.org/abs/2212.06823

Fact:
- Across five studies with 731 participants, explanations reduced overreliance only when users had sufficient reason and ability to engage with the explanation.
- Task difficulty, explanation difficulty, and incentives affected reliance behavior.

Inference for MC:
- A symbolic marker that is beautiful but hard to verify may not reduce overreliance.
- MC should make uncertainty cheap to inspect and easy to challenge.

### Source 3: Li et al. — uncalibrated confidence harms collaboration

Reference: Jingshu Li, Yitian Yang, Renwen Zhang, Yi-chieh Lee. “Overconfident and Unconfident AI Hinder Human-AI Collaboration.” 2024. https://arxiv.org/abs/2402.07632

Fact:
- Uncalibrated AI confidence can cause misuse of overconfident AI and disuse of underconfident AI.
- Trust calibration support can help users detect uncalibration, but can also increase distrust/disuse.

Inference for MC:
- MC status visuals must avoid both false authority and blanket distrust.
- The correct target is calibrated use: “this may help reflection, but it is not confirmed meaning.”

### Source 4: Reyes et al. — uncertainty encoding tradeoffs

Reference: Jonatan Reyes, Mina Massoumi, Anil Ufuk Batmaz, Marta Kersten-Oertel. “Shades of Uncertainty: How AI Uncertainty Visualizations Affect Trust in Alzheimer’s Predictions.” 2026. https://arxiv.org/abs/2602.01264

Fact:
- In two studies, continuous uncertainty encodings improved perceived reliability and recognition of model limitations compared with binary encodings in a prognostic AI context.
- Binary encodings increased momentary confidence.
- Effects varied by expertise.

Inference for MC:
- A gradient/saturation/status-layer approach may be better than a binary “uncertain/not uncertain” label.
- However, perceived reliability is not the same as correct reliance. MC must test whether richer symbolic visuals calibrate or merely beautify uncertainty.

### Source 5: NIST AI RMF framing

Reference: National Institute of Standards and Technology. AI Risk Management Framework and Playbook. https://www.nist.gov/itl/ai-risk-management-framework

Fact:
- NIST’s AI RMF frames AI risk management as iterative mapping, measuring, managing, and governing of risks across context and lifecycle.
- This supports evidence-gated claims, contextual risk measurement, and continuous review rather than one-time trust labels.

Inference for MC:
- MC should track symbolic status claims as testable interface risks, not as aesthetic preferences.
- “Looks safe” is not enough. The interface needs measured outcomes.

## Fact / inference separation

### Supported facts

- Overreliance is a demonstrated risk in AI-assisted decision-making.
- Explanations alone do not reliably solve overreliance.
- Cognitive forcing can reduce overreliance, but may impose experience costs.
- Confidence and uncertainty displays can help or harm depending on calibration, format, task, and user expertise.
- Human-AI trust calibration is contextual and must be measured.

### MC-specific inferences

- Symbolic visuals may carry extra authority because beauty, mystery, coherence, or narrative fit can feel like truth.
- A symbolic uncertainty layer may preserve reflective flow better than plain disclosure, but this is unproven.
- MC needs a falsification test specifically for “symbolic authority confusion,” not just general usability.

### Unsupported / not yet claimed

- It is not proven that symbolic UI is safer than text labels.
- It is not proven that symbolic UI preserves flow better than dashboard controls.
- It is not proven that users can reliably distinguish AI-inferred meaning from user-confirmed meaning using symbolic markers alone.

## Claim-status update

Claim: “MC’s symbolic uncertainty visuals safely communicate uncertainty and reduce overreliance.”

Updated status: Needs evidence before product claim.

Allowed wording:
- “MC is designed to make uncertainty visible and contestable.”
- “MC will test whether symbolic status markers improve calibration without increasing false certainty.”
- “Current evidence supports the risk model, not the effectiveness of MC’s solution.”

Disallowed wording until tested:
- “MC prevents overreliance.”
- “MC’s symbolic layer makes uncertainty safe.”
- “Symbolic visuals are better than dashboards for memory/meaning calibration.”

## Evaluation criterion: Symbolic Authority Confusion Criterion

A symbolic uncertainty/status marker passes only if users can:

1. Identify whether a displayed meaning is user-confirmed, AI-inferred, uncertain, conflicted, memory-influenced, or blocked.
2. Explain what evidence supports the status.
3. Correct or roll back the status without losing the session thread.
4. Avoid treating uncertain or AI-inferred material as a stronger identity truth than the interface claims.
5. Preserve reflective flow enough that the safety layer is not abandoned.

Pass threshold for a small internal study:

- At least 80% correct status identification across test cards.
- No more than 10% false upgrade rate, where users treat “AI-inferred” or “uncertain” as “confirmed.”
- At least 70% successful rollback/correction task completion.
- Subjective flow score no worse than plain disclosure by more than one point on a 7-point scale.
- Qualitative interviews show users describe the symbols as “checkable signals,” not “hidden truth,” “diagnosis,” “identity proof,” or “authority.”

## Falsification checklist

The symbolic uncertainty layer fails if any of these appear consistently:

- Users say the visual marker feels more true because it is beautiful, coherent, mysterious, or emotionally resonant.
- Users cannot tell AI inference from user confirmation.
- Users assume a memory-influenced interpretation is more authoritative than a non-memory interpretation.
- Users do not inspect uncertainty details because the symbol already feels explanatory.
- Users over-trust low-confidence outputs when presented with richer visuals.
- Users ignore the controls because they interrupt reflective flow.
- Users cannot reverse or correct a symbolic status after noticing an error.
- Users mistake blocked influence for deleted memory or privacy guarantee.

## Test plan: symbolic-authority-confusion-testset-v0.1

Compare four interface conditions:

1. Plain text disclosure
   - Example: “This is AI-inferred and uncertain.”

2. Dashboard disclosure
   - Table with status, confidence, source, memory influence, allowed effect, blocked effect, rollback.

3. Symbolic status layer
   - Visual marker/chip/glyph system showing confirmed, inferred, uncertain, blocked, conflicted, rollback.

4. Hybrid layer
   - Compact symbol by default, expandable audit details on demand.

Task cards:

A. User-confirmed meaning with no memory influence.
B. AI-inferred meaning with low evidence.
C. Memory-influenced interpretation where memory is relevant but limited in scope.
D. Memory retrieved by semantic similarity but blocked by domain/sensitivity mismatch.
E. Conflicting signals where two possible meanings remain unresolved.
F. High-emotional-resonance symbol with weak evidence.
G. Correctable mistake requiring rollback.
H. Session summary requiring separation of fact, inference, and symbolic language.

Measures:

- Status identification accuracy.
- False upgrade rate.
- Correction/rollback success.
- Time to inspect evidence.
- Overreliance/adoption of intentionally weak AI inference.
- Flow disruption rating.
- User language in interview: calibration language vs authority language.

## Design requirement added

MC symbolic status markers must never stand alone as the only explanation of uncertainty.

Every symbolic uncertainty/status marker must have:

- A plain-language status label.
- Evidence source or absence-of-evidence note.
- Influence scope: what this may affect.
- Blocked scope: what this must not affect.
- Confidence/uncertainty statement.
- Rollback or correction affordance.
- A visual treatment that distinguishes “beautiful/reflection-worthy” from “confirmed/true.”

## Next proof needed

Run a controlled comparison of plain disclosure vs dashboard vs symbolic layer vs hybrid layer using the test cards above.

The decisive question:

Do symbolic markers improve comprehension and flow without increasing false authority, identity certainty, or overreliance?
