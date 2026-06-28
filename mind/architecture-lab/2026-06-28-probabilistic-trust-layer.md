# Probabilistic Trust Layer

Date: 2026-06-28
Status: architecture research artifact
Public-safety status: abstracted; no private user material included

## Architecture question

How should Mirror Cartographer encode trust as provisional, multi-signal verification instead of presenting symbolic interpretations as certain meaning?

## Why this question matters

Recent MC architecture work added Memory State Theater, Repairable Memory Objects, Map Delta Objects, Delta Comprehension Gates, and Belief Terrain direction. The next weak point is trust language itself.

If MC says or visually implies "this symbol means X," the interface may convert a tentative interpretation into felt certainty. That is especially risky in reflective systems because symbolic, emotional, and memory-adjacent material can feel personally authoritative even when the evidence is thin.

The system therefore needs a Probabilistic Trust Layer: an interface and data pattern that treats every interpretation as a provisional reading with visible evidence, uncertainty, context gaps, alternative readings, and future-use limits.

## Sources reviewed

1. Sun et al., "Trust Stack for Mental Health AI: A Survey of Calibration across Human, Interaction, and AI Layers," arXiv, 2026.
   - Useful concept: trust should not be maximized; it should be calibrated to demonstrated human-, interaction-, and AI-level trustworthiness.
   - Relevant quote-level idea, paraphrased: empathetic AI can generate strong user trust without equivalent safety, while safer systems can be under-trusted when boundaries are opaque.
   - URL: https://arxiv.org/html/2604.20166v2

2. NIST AI Risk Management Framework / AI Resource Center.
   - Useful concept: trustworthiness is not one property. It includes validity/reliability, safety, security/resilience, accountability/transparency, explainability/interpretability, privacy enhancement, and fairness, and these qualities involve tradeoffs in context.
   - URL: https://www.nist.gov/itl/ai-risk-management-framework
   - URL: https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/

3. ACM CHI 2026 accepted workshop: "The Pitfalls and Potentials of Cognitive Biases in Trust Calibration for Human-AI Interaction."
   - Useful concept: cognitive biases can make AI appear more or less trustworthy than it is, especially as generative AI becomes more natural-language persuasive.
   - URL: https://chi2026.acm.org/workshops/accepted/

4. Liebherr et al., "Dynamic calibration of trust and trustworthiness in AI-enabled systems," International Journal on Software Tools for Technology Transfer, 2026.
   - Useful concept: trust, trustworthiness, and calibrated trust are dynamic; they evolve through user beliefs, system behavior, and interaction history.
   - URL: https://link.springer.com/article/10.1007/s10009-026-00840-6

5. Nandi and Eliott, "Cooperation as a Black Box: Conceptual Fluctuation and Diagnostic Tools for Misalignment in MAS," arXiv, 2025.
   - Useful concept: meaning-level misalignment can arise from semantic ambiguity, interpretive ambiguity, concept-to-code decay, and overloaded terms.
   - URL: https://arxiv.org/abs/2506.22876

## Fact / inference boundary

### Supported by sources

- Trust and trustworthiness are distinct. A user may trust an AI more or less than the system warrants.
- Trust calibration is a recognized HCI and AI safety problem.
- Interface design can affect trust calibration by exposing uncertainty, boundaries, safeguards, and control.
- Trustworthiness is multi-dimensional and context-dependent; no single visual or label can prove it.
- Interpretive ambiguity and semantic drift can create misalignment before any technical failure occurs.

### MC-specific inference

- A symbolic map is a high-risk trust surface because visual coherence can be mistaken for evidential strength.
- MC should not render interpretations as fixed meanings. It should render them as provisional belief objects with evidence, uncertainty, missing context, alternate readings, and repair paths.
- Trust should be encoded as a changing relationship among the user, the interpretation, the evidence, the interface, and future-use rules.

## Design pattern: Probabilistic Trust Layer

A Probabilistic Trust Layer wraps every MC interpretation in a visible state object.

### Required fields

- `interpretation_id`: stable identifier for the interpretation object.
- `claim_text`: the current provisional reading.
- `claim_type`: observation, inference, metaphor, memory-link, pattern-link, recommendation, safety-boundary, or unknown.
- `evidence_signals`: sources or signals supporting the interpretation.
- `counter_signals`: sources or signals that weaken or complicate the interpretation.
- `missing_context`: what the system does not know but would need to know before stronger confidence.
- `confidence_band`: low, medium-low, medium, medium-high, or high. Avoid numerical precision unless measurement is real.
- `impact_tier`: low, medium, high, or protected. Higher tiers require stronger friction.
- `alternative_readings`: plausible non-identical interpretations.
- `user_contest_state`: unreviewed, accepted-for-now, narrowed, corrected, dimmed, quarantined, deleted, or contested.
- `future_use_rule`: never reuse, reuse only in this session, reuse as tentative context, reuse only after confirmation, or persistent allowed.
- `last_used_in_output`: where the interpretation last shaped an output.
- `delta_history`: links to Map Delta Objects created by changes to this interpretation.

### Interface behavior

1. Never display symbolic interpretation as singular truth.
   - Replace "this means X" with "current strongest reading: X, confidence: medium, because of signals A/B, with alternate reading C."

2. Bind beauty to auditability.
   - If the map visually strengthens a symbol, the user must be able to inspect why the system strengthened it.

3. Use proportional friction.
   - Low-impact interpretations can use light labels.
   - Medium-impact interpretations need alternatives and context gaps.
   - High-impact interpretations need explicit contest controls.
   - Protected interpretations cannot become persistent memory without explicit confirmation.

4. Keep uncertainty visible but not oppressive.
   - The user should not have to manage a database. The visual layer should show simple trust glyphs, while the detail layer exposes the evidence object.

5. Treat trust as dynamic.
   - Confidence must change when evidence changes, when the user contests the interpretation, when a source becomes stale, or when the interpretation influences future outputs.

## Trust glyph grammar

Use a small visual grammar rather than paragraphs everywhere.

- Solid edge: stronger support.
- Dashed edge: tentative support.
- Fogged edge: missing context.
- Split edge: competing interpretations.
- Lock mark: future-use restriction.
- Heat mark: high-impact interpretation.
- Thread mark: provenance available.
- Crack mark: contested or repaired.

The glyphs are not decorative. Each one must map to a real field in the Probabilistic Trust Object.

## Requirements update

MC interpretations must pass the Probabilistic Trust Check before being shown as map structure.

### Probabilistic Trust Check

For each interpretation, verify:

1. The system can distinguish observation from inference.
2. Evidence signals are visible or explicitly absent.
3. Confidence is bounded and not over-precise.
4. Missing context is shown when confidence is not high.
5. At least one alternative is shown for medium/high-impact interpretations.
6. Future-use rule is visible before persistence.
7. User can contest, narrow, quarantine, delete, or correct the interpretation.
8. The map delta caused by any change is auditable.

Failing any required item downgrades the interpretation to draft/fog state.

## Prototype plan

### v0.1

Add a `TrustBadge` component to interpretation cards and map nodes.

Fields shown by default:

- confidence band
- impact tier
- source count
- missing-context indicator
- future-use rule
- contest state

### v0.2

Add an expandable `Why This Reading?` panel.

Panel sections:

- What was observed
- What was inferred
- What evidence supports it
- What could make it wrong
- Alternate readings
- What happens if saved
- Repair actions

### v0.3

Connect the layer to Map Delta Objects.

Every time confidence, future-use, contest state, or claim text changes, create a delta entry.

## Evaluation criterion

A user should be able to answer these questions after seeing a map interpretation:

1. What exactly did MC infer?
2. What did MC observe versus infer?
3. How sure is MC?
4. What evidence or signals caused that confidence?
5. What is missing?
6. What else could it mean?
7. Will this affect future sessions?
8. How can I repair or restrict it?

If users cannot answer these, the trust layer is not working.

## Claim-status update

Previous weak assumption:

> If MC is transparent and user-controlled, users will understand how much to trust the map.

Updated claim:

> Transparency and control are necessary but insufficient. MC needs calibrated trust objects that bind each interpretation to evidence, uncertainty, missing context, alternative readings, impact tier, future-use limits, and repair paths.

Confidence: medium. The supporting research strongly justifies the architecture direction, but MC-specific validation still requires user testing.

## Next research question

How should MC assign impact tiers to symbolic interpretations so it knows when to use light-touch labeling versus stronger agency-preserving friction?
