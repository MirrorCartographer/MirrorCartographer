# Artistic Intelligence Co-Creation Spine

Status: design pattern
Date: 2026-06-27
Public-safety level: public-safe; no private user material; no medical, veterinary, diagnostic, or therapeutic claims

## Architecture question

How can Mirror Cartographer become an artistic-intelligence interface that is testable and fundable without collapsing into either:

1. a decorative symbolic journal, or
2. a generic AI chatbot with prettier language?

## Short answer

MC needs a co-creation spine: a structured interaction path where user input, AI interpretation, memory influence, uncertainty, and creative transformation remain visible, adjustable, and testable.

The product claim should not be: “MC understands the user.”

The stronger public-safe claim is: “MC helps a user externalize, reshape, and evaluate symbolic experience through a governed co-creative interface.”

## Research basis

### 1. Human-AI co-creativity needs deliberate structure

A 2025 systematic review of human-AI co-creativity found key design dimensions including creative phase, task, proactive AI behavior, user control, embodiment, and model type. It also found that high user control is associated with greater satisfaction, trust, and ownership, and that adaptive/context-sensitive proactive systems can help collaboration when designed carefully.

Source: https://arxiv.org/abs/2506.21333

### 2. Current co-creative systems under-support early problem clarification

The same review identifies a gap in support for early creative phases such as problem clarification. This is directly relevant to MC because symbolic entries are often pre-solution, ambiguous, embodied, contradictory, or only partially verbal.

Source: https://arxiv.org/abs/2506.21333

### 3. Reflective memory should preserve context and rationale, not just facts

Contextual Memory Intelligence frames memory as adaptive infrastructure for longitudinal coherence, explainability, and responsible decision-making. It emphasizes structured capture, reflection, drift detection, and rationale preservation. For MC, this supports memory-as-influence-ledger rather than memory-as-storage.

Source: https://arxiv.org/abs/2506.05370

### 4. Co-creation needs trajectory-level evaluation

A 2026 reliability-aware LLM-as-judge framework for human-AI co-creation emphasizes schema-constrained evaluation, validation/repair, trajectory-level signals, turn-wise confidence, success-at-turn, time-to-success, and revision churn. Although the paper focuses on coding, its evaluation principle generalizes: assess the path of co-creation, not only the final artifact.

Source: https://arxiv.org/abs/2604.27727

### 5. Funding language is moving toward creativity-driven AI innovation

Horizon Europe’s “Leveraging artificial intelligence for creativity-driven innovation” call frames AI as part of culture- and creativity-driven innovation ecosystems, emphasizing the intersection of technology, arts, culture, and society.

Source: https://cordis.europa.eu/programme/id/HORIZON_HORIZON-CL2-2025-01-HERITAGE-04

## Fact vs inference

### Facts supported by sources

- Human-AI co-creative system design literature identifies user control, proactivity, context sensitivity, embodiment, and transparency as important design dimensions.
- High user control is reported as associated with satisfaction, trust, and ownership in reviewed co-creative systems.
- Early problem clarification is an under-supported phase in co-creative systems.
- Context-preserving memory architectures are being proposed for reflective and auditable generative systems.
- Trajectory-level evaluation can make co-creation more auditable than final-output-only evaluation.
- Public innovation funding language recognizes AI at the intersection of technology, arts, culture, and society.

### Inferences for MC

- MC’s strongest product wedge is not symbolic output alone; it is governed symbolic co-creation.
- MC should treat ambiguity as the starting material, not an error state.
- MC should make the interaction path visible enough that a user can contest, revise, or reject AI influence.
- MC’s demos should be evaluated by map movement, user control, and traceability, not by whether the AI sounds profound.

## Design pattern: Co-Creation Spine

Every MC session should expose five layers:

1. Entry
   - What the user gave: phrase, symbol, sensation word, image description, contradiction, mood, scene, or question.

2. Interpretation candidates
   - Multiple possible readings.
   - Must be labeled as hypotheses, not truths.
   - Must include a “none of these” path.

3. Influence sources
   - Current input.
   - User-approved memory, if enabled.
   - Session context.
   - Selected mode: symbolic, neutral, scientific, practical, mythopoetic, or adaptive.
   - Any external source used.

4. User control surface
   - Amplify.
   - Dim.
   - Reject.
   - Freeze.
   - Revise.
   - Ask a narrower question.

5. Traceable transformation
   - What changed in the map.
   - Why it changed.
   - Confidence level.
   - What remains unresolved.

## Interface metaphor

MC is not a mirror that gives a single reflection.

MC is a prism room.

The user places one signal in the room. The system shows several refractions. The user chooses which beams are allowed to become structure.

## Requirements update

### R1 — Interpretations must be plural
MC must not present one symbolic interpretation as authoritative.

### R2 — Influence must be visible
Any use of memory, mode, prior session structure, or external source must be visible at the moment it affects the output.

### R3 — User control must be local
The user must be able to reject or revise a specific interpretation without deleting the whole session.

### R4 — The system must support problem clarification
Before offering a conclusion, MC should be able to ask one uncertainty-reducing question when ambiguity is high.

### R5 — Evaluation must track trajectory
MC demos should record interaction path metrics, not just final artifact quality.

## Evaluation criteria

A session passes if:

- The user can identify what the AI inferred vs what the user directly said.
- The user can alter the map without fighting the system.
- The system shows unresolved ambiguity instead of pretending certainty.
- At least one interaction visibly changes the map.
- No private memory crosses into public/export mode unless explicitly allowed.
- The final artifact includes source/influence trace when relevant.

A session fails if:

- The AI states symbolic interpretations as facts.
- The interface hides why a memory shaped the response.
- The system feels like a personality profiling tool rather than a co-creation environment.
- The output is emotionally intense but structurally untraceable.
- The user cannot contest or edit the system’s reading.

## Prototype plan

Name: The Prism Room

Minimal version:

1. User enters one symbolic phrase.
2. MC generates three interpretation candidates:
   - embodied reading
   - relational/contextual reading
   - creative/material reading
3. Each candidate shows:
   - confidence
   - influence sources
   - what evidence would change it
4. User chooses amplify, dim, reject, or ask narrower question.
5. The visible map changes once.
6. Export produces a public-safe artifact with private details abstracted.

## Next experiment

Run 12 symbolic seed phrases through The Prism Room prototype.

For each seed, measure:

- Did the system ask a useful clarification question when needed?
- Did the user retain control over interpretations?
- Did the output visibly change after user action?
- Was every memory influence visible?
- Could the final artifact be shared publicly without private leakage?

## Next research question

How can MC evaluate “map movement” in a way that is concrete enough for product testing but flexible enough for symbolic, embodied, and creative material?
