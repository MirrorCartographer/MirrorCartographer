# Memory State Theater: Auditable Memory Metaphor Control Plane

Date: 2026-06-27
Status: Architecture pattern / prototype plan
Public-safety level: public-safe; no personal memory examples; no medical or veterinary claims

## Architecture question

How can Mirror Cartographer show admitted, withheld, uncertain, and quarantined memories in a way that feels alive, symbolic, and usable while remaining auditable, reversible, and safe?

## Why this question matters

Recent MC research has converged on memory metaphors: terrain, gates, fog, footprints, fences, bridges, strata. The weak point is that metaphor can become decoration unless each visual object corresponds to a real control state.

The architecture needs a concrete mapping from memory retrieval states to interface states, user controls, and audit records.

## Research basis

1. Trustworthy memory search for personal AI agents
   - Source: Beyond Similarity: Trustworthy Memory Search for Personal AI Agents, arXiv, 2026.
   - Useful concept: memory retrieval is a trust boundary, not a passive utility layer.
   - Relevant risks: cross-domain leakage, sycophancy, tool-call drift, and memory-induced jailbreaks.
   - Architectural implication: memory should pass through an admission gate before influencing interpretation.

2. Spatial metaphors for LLM memory
   - Source: Spatial Metaphors for LLM Memory: A Critical Analysis of the MemPalace Architecture, arXiv, 2026.
   - Useful concept: spatial metaphor can help organize memory, but performance claims should not be attributed to metaphor alone.
   - Architectural implication: MC should use metaphor as an inspectable interface/control layer, not as evidence that retrieval is better.

3. Dynamic memory recall and consolidation in LLM agents
   - Source: “My agent understands me better”: Integrating Dynamic Human-like Memory Recall and Consolidation in LLM-Based Agents, arXiv, 2024.
   - Useful concept: memory salience can be shaped by contextual relevance, elapsed time, and recall frequency.
   - Architectural implication: MC needs visible salience and age indicators so the user can see why a memory is being proposed.

4. Object-action interface design
   - Source: object-action interface model in HCI literature.
   - Useful concept: users gain control when interface objects are visible first and actions are then performed on those objects.
   - Architectural implication: MC should show memory objects before allowing memory influence actions.

5. Enactive interface design
   - Source: enactive interface literature.
   - Useful concept: knowledge is organized through action-feedback loops.
   - Architectural implication: MC memory safety should be enacted through user moves: admit, dim, contest, quarantine, bridge, expire.

## Fact vs inference

### Supported facts from the research

- Long-term memory can reshape agent behavior and should be treated as a trust boundary.
- Similarity alone is insufficient for safe memory retrieval.
- Spatial memory metaphors can organize long-term memory, but claims about retrieval quality require independent evidence.
- Human-facing interfaces are more controllable when objects, actions, and effects are visible.

### MC-specific inferences

- MC should model every recalled memory as a visible interface object with a current state.
- MC should separate memory retrieval from memory admission.
- MC should make withheld memory visible as a category without exposing its private content.
- MC should use symbolic metaphor only when each metaphor has a corresponding control and audit meaning.

## Pattern summary

Memory State Theater is a design pattern where memory is shown as a stage of influence objects.

The user does not see a hidden memory blob silently shaping the answer. The user sees a public-safe visual layer showing which memory influences are:

- proposed
- admitted
- dimmed
- withheld
- quarantined
- expired
- bridged
- contested

Each state has a visible metaphor, allowed actions, and an audit entry.

## Memory state model

### 1. Proposed

Metaphor: a lantern at the edge of the terrain.

Meaning: retrieved as potentially relevant but not yet allowed to shape interpretation.

Allowed actions:
- admit
- dim
- reject
- inspect source summary
- quarantine

Audit record:
- retrieval reason
- source type
- confidence
- age
- scope

### 2. Admitted

Metaphor: a lit path on the terrain.

Meaning: allowed to influence the current map.

Allowed actions:
- dim influence
- remove from current map
- contest
- expire after session
- bridge to another context

Audit record:
- admitted by user or system rule
- what part of output it influenced
- confidence and scope

### 3. Dimmed

Metaphor: low light / translucent object.

Meaning: allowed as weak context only; cannot anchor interpretation.

Allowed actions:
- brighten
- reject
- quarantine

Audit record:
- reason for low influence
- user/system source of dimming

### 4. Withheld

Metaphor: fenced silhouette or sealed envelope.

Meaning: a relevant memory category exists but content is not shown or used because scope, privacy, or context does not permit it.

Allowed actions:
- request summary
- unlock for this session
- keep sealed
- delete/forget if user owns it

Audit record:
- category only, no private content
- withholding reason
- permission boundary

### 5. Quarantined

Metaphor: red-thread knot outside the main map.

Meaning: memory may be stale, sensitive, contradictory, adversarial, or context-inappropriate.

Allowed actions:
- inspect public-safe reason
- keep quarantined
- delete
- rewrite
- restore with explicit permission

Audit record:
- quarantine reason
- trigger condition
- last safe use

### 6. Expired

Metaphor: fossil layer / faded footprint.

Meaning: memory is no longer active by default because its time, scope, or confidence has lapsed.

Allowed actions:
- restore
- archive
- delete

Audit record:
- expiration rule
- last use
- restore history

### 7. Bridged

Metaphor: bridge between terrain regions.

Meaning: memory from one context is allowed to inform another context with explicit scope.

Allowed actions:
- narrow bridge
- break bridge
- inspect bridge rule

Audit record:
- source context
- destination context
- bridge scope
- bridge expiration

### 8. Contested

Metaphor: split path / question marker.

Meaning: the user disputes the memory, interpretation, or influence level.

Allowed actions:
- correct
- attach counter-note
- suppress
- replace
- mark unresolved

Audit record:
- contested field
- correction text or structured correction
- whether future retrieval is blocked or modified

## Required UI elements

1. Memory Influence Strip
   - A horizontal strip above or beside the generated map.
   - Shows all active memory objects as icons with state labels.

2. Influence Receipt
   - A collapsible receipt after each MC response.
   - Answers: what influenced this, what was withheld, what was uncertain, what changed.

3. Contest Drawer
   - A focused correction panel.
   - Lets the user say: wrong, stale, too strong, too private, wrong context, keep but dim, forget.

4. Public-Safe Withholding Marker
   - Shows that a memory category was blocked without revealing sensitive content.
   - Example: “1 memory withheld: outside current context.”

5. State Change Log
   - Durable audit trail for memory influence transitions.
   - Records state transitions, not private prose.

## Evaluation criteria

A memory interface implementation passes this pattern only if:

- No memory influences output without an inspectable state.
- Withheld memories can be indicated without revealing private content.
- The user can contest, dim, reject, or quarantine memory influence.
- Cross-context memory transfer requires a bridge state with explicit scope.
- Each admitted memory can be traced to at least one output influence claim.
- The metaphor never substitutes for evidence; it only makes control states visible.

## Prototype plan: Memory State Theater v0.1

Input: one user phrase and five synthetic memory candidates.

Synthetic candidate types:
1. clearly relevant and safe
2. semantically similar but wrong context
3. stale preference
4. sensitive/private category requiring withholding
5. adversarial or over-directive memory

The demo must show:
- which candidates were proposed
- which were admitted
- which were dimmed
- which were withheld
- which were quarantined
- why each state was chosen
- what user action is possible next

## Falsification checklist

This pattern fails if:

- MC uses a memory that is not visible in the influence strip.
- MC reveals withheld private content in order to explain withholding.
- MC treats a spatial metaphor as proof of retrieval quality.
- MC cannot show why one memory was admitted and another was quarantined.
- MC lets cross-context memory flow without a bridge rule.
- MC makes identity-level claims from memory instead of bounded influence claims.

## Next research question

How can MC visually encode contested memory correction without making the user feel like they are editing a database instead of moving through a living map?
