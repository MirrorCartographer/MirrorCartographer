# Memory Metaphor Control Plane

Date: 2026-06-27
Status: durable architecture note / public-safe

## Architecture question

How should Mirror Cartographer turn memory metaphors into enforceable interface rules rather than decorative language?

The latest research signal was that AI memory is not only a storage/retrieval problem. It is an interface, trust, and context-governance problem. The deeper question is whether MC's symbolic language can become a usable control plane: a way for users to see, contest, narrow, and redirect memory influence.

## Research basis

### Fact: memory retrieval is a trust boundary

Recent agentic-memory work argues that long-term memory can become a durable control channel. Similarity-based memory retrieval can pull in contextually inappropriate memories, producing cross-domain leakage, sycophancy, jailbreak susceptibility, and tool-call drift. The useful concept for MC is that memory must pass admission criteria before it influences interpretation or action.

Implication: MC cannot treat recalled memories as neutral context. Each memory influence needs visible admission logic.

### Fact: memory can silently steer tool/action behavior

Research on memory-induced tool drift shows that stored preferences or traits can alter downstream tool parameters when the memory is not relevant to the current task. The useful concept is drift: memory can bend action without the user seeing the bend.

Implication: MC should distinguish reflective interpretation from action-bearing use. Symbolic memory can be used to generate candidates, but any memory that affects saving, routing, recommendations, contact, scheduling, publishing, or tool calls needs stricter gating.

### Fact: spatial metaphors are useful but not automatically causal

Analysis of spatial memory systems such as memory-palace-style LLM memory suggests that the metaphor can organize interaction, but retrieval gains may come from ordinary storage and filtering methods rather than the metaphor itself. The useful concept is metaphor accountability: a metaphor earns its place only if it gives the user better control, comprehension, or auditability.

Implication: MC's terrain/gate/fog/footprint language should map to functional states, not just visual mood.

## What changed in understanding

Before: MC memory metaphors were treated as a visual and symbolic layer for making memory feel intuitive.

After: memory metaphors should become a control plane with specific safety functions.

The metaphor must answer five operational questions:

1. What is being allowed to influence the interpretation?
2. Why is that influence relevant right now?
3. How certain is the system about the fit?
4. What boundary or permission does the influence cross?
5. How can the user inspect, dim, reject, revise, expire, or quarantine it?

## Design pattern: Memory Metaphor Control Plane

### Core metaphor-to-function mapping

- Terrain = domain/context area where a memory belongs.
- Gate = permission boundary controlling whether memory may enter the current interpretation.
- Fog = uncertainty, low confidence, incomplete context, or disputed relevance.
- Footprint = provenance trace showing where the memory came from and when it last influenced output.
- Fence = blocked, private, expired, or out-of-domain memory boundary.
- Bridge = explicitly user-approved transfer of memory influence across contexts.
- Lantern = active inspection state; the user can see why the memory appeared.
- Quarantine = memory withheld because it may be sensitive, stale, overbroad, or contextually risky.
- Strata = revision history showing how a memory changed over time.

### Required UI behavior

Every memory object that influences an MC response should expose:

- source/provenance
- permission state
- context/domain fit
- confidence or uncertainty state
- last-used trace
- sensitivity level
- user controls: allow, dim, reject, revise, expire, quarantine

### Required architecture behavior

Memory retrieval should pass through four stages:

1. Candidate retrieval: pull possible memories without admitting them.
2. Relevance gating: evaluate whether each candidate belongs in the current context.
3. Influence rendering: show admitted and withheld influence in a user-readable metaphor view.
4. User correction loop: user can alter influence before the map state updates.

## Non-claims

MC should not claim that metaphor makes memory objectively safe.

MC should not claim that a spatial metaphor improves retrieval accuracy by itself.

MC should not infer identity, diagnosis, emotion, or intent from memory alone.

MC should not silently use personal memory to make action-bearing decisions.

## Product wedge

Prototype name: Memory Terrain View

One screen where a symbolic input is interpreted with visible memory influence objects. The user sees:

- active memories as terrain markers
- blocked memories behind fences
- uncertain memories in fog
- provenance footprints
- gates showing permission status
- bridges only where the user explicitly approves context transfer

The screen should make memory influence inspectable before it becomes map movement.

## Evaluation criteria

A prototype passes if a tester can answer these without reading documentation:

1. Which memories influenced the interpretation?
2. Which memories were withheld?
3. Why was each admitted or withheld?
4. What can the user change?
5. Did the final map change because of user correction or hidden system inference?

## Next concrete experiment

Build a low-fidelity Memory Terrain View using 10 synthetic prompts and 20 synthetic memory cards.

Score each run for:

- visible provenance
- correct permission boundary
- uncertainty display
- no hidden identity inference
- user ability to dim/reject/revise memory influence
- traceable before/after map movement

## Next research question

How can MC visually encode admitted, withheld, uncertain, and quarantined memories in a way that feels alive and symbolic while still being legally, ethically, and technically auditable?
