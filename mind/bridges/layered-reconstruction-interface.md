# Layered Reconstruction Interface

## Public-safe bridge

A surprising bridge across tangible interaction, generative AI reminiscence, embodied AI, animal-computer interaction, and human-AI co-creation:

**Mirror Cartographer should treat meaning, memory, animal observations, and creative output as layered reconstructions, not instant conclusions.**

The useful metaphor is not a chatbot answer. It is a **screen-printing / lantern / scraper interface**: a signal is revealed in layers, with the user controlling pace, exposure, correction, and whether the result becomes durable memory.

## Why this matters for MC

MC already has patterns for uncertainty, context rings, privacy-safe memory, and signal-without-meaning. The missing interface move is **tangible reconstruction**:

1. Start with a raw signal.
2. Reveal one layer at a time.
3. Keep observation separate from interpretation.
4. Let the user slow down, revise, or stop.
5. Require claim/privacy/memory labels before durability.
6. Print/export only the public-safe reconstruction, not the raw private material.

This shifts MC from “AI explains you” to **AI helps you reconstruct a map with agency**.

## Research basis

### 1. Slow, tangible AI can restore agency in sensitive memory work

The 2026 CHI paper **“Memory Printer”** argues that generative AI reminiscence tools can reduce agency when outputs appear instantly and unpredictably. Its tangible prototype uses a screen-printing metaphor, a physical scraper, layered redrawing, and built-in printing. The study reported opportunities such as stronger sense of control and creative exploration, while also identifying boundaries: false memory formation, algorithmic bias, and privacy/security risks.

Source: Fang & Huang, *Memory Printer: Exploring Everyday Reminiscing by Combining Slow Design with Generative AI-based Image Creation*, CHI 2026.  
URL: https://arxiv.org/html/2603.13116v1

### 2. Animal-computer interaction treats animals as stakeholders, not merely objects

The ACI field frames animal-centered computing as the study and design of technologies that support animals’ well-being, activities, and interspecies relations. It also emphasizes animal participation where appropriate and treats interaction broadly: direct/indirect, passive/active, cognitive/physical, co-located/remote, synchronous/asynchronous.

Source: ACI International Conference overview.  
URL: https://www.aciconf.org/

### 3. Human-AI co-creation is moving beyond prompt/response into participatory sense-making

Recent human-AI co-creation work frames interaction as turn-taking, improvisation, collaboration, and enaction: meaning emerges through interaction rather than being delivered as a finished output.

Source: Davis et al., *Human-AI Co-Creation: A New Interaction Paradigm for Human-AI Interaction*, first online 2025.  
URL: https://link.springer.com/rwe/10.1007/978-981-97-8440-0_76-1

### 4. Embodied AI research emphasizes shared autonomy, affect, trust, recoverability, and constrained deployment

Embodied AI work argues for adaptive, trustworthy, physically grounded interaction where systems negotiate roles, learn user-specific conventions, and keep humans in meaningful control. Reliability, transparency, and recoverability are described as foundational for trust-aware deployment.

Source: Li, *Embodied artificial intelligence as a paradigm shift for human–robot collaboration*, 2026.  
URL: https://www.oaepublish.com/articles/ir.2026.05

## Fact / inference boundary

### Supported by sources

- Slow and tangible interaction can make AI generation feel more controllable in emotionally sensitive contexts.
- Layered reconstruction can expose intermediate steps and support revision.
- AI-supported reminiscence raises false-memory, bias, privacy, and data-security concerns.
- Animal-centered computing is a legitimate research field focused on animal welfare, activities, and interspecies relations.
- Human-AI co-creation can be framed as participatory sense-making rather than simple input/output.
- Embodied AI systems need transparency, recoverability, and meaningful human control.

### MC inference

- MC should use layered reconstruction cards for symbolic mapping, body signals, animal observations, and creative synthesis.
- A visual/tangible metaphor may reduce overclaiming by forcing observation, inference, uncertainty, privacy, and memory decisions into separate layers.
- Animal-health-adjacent observations should remain descriptive and non-diagnostic unless handled by qualified veterinary care.

### Not claimed

- This does not diagnose, treat, or predict any medical or veterinary condition.
- This does not prove that an animal intends a specific meaning by interacting with technology.
- This does not prove that MC improves health outcomes.
- This does not prove the layered card design is effective until tested.

## Product pattern: Layered Reconstruction Card

Each MC card should have visible layers:

1. **Raw Signal Layer**  
   What was actually noticed? Example: body sensation, pet behavior, image, phrase, dream fragment, repeated symbol, interface action.

2. **Context Ring Layer**  
   Time, place, environment, body state, animal context, source, privacy level.

3. **Affordance Layer**  
   What safe actions does the signal afford? Observe, compare, log, rest, ask a professional, sketch, research, ignore, wait.

4. **Blocked Claim Layer**  
   What must not be concluded yet? Diagnosis, intention, causal claim, public claim, identity claim, external action.

5. **Interpretation Layer**  
   Symbolic, practical, scientific, or creative readings, each labeled as inference.

6. **Uncertainty Layer**  
   Confidence, missing evidence, contradiction, alternate explanations.

7. **Memory / Export Layer**  
   No-save, private save, abstract save, project save, public-safe artifact, or delete/forget.

8. **Next Move Layer**  
   One concrete action that is safe, reversible, and proportional to evidence.

## Visual metaphor spec

Name: **The Scraper Lantern**

Visual behavior:

- A fogged card appears first with only the Raw Signal visible.
- A horizontal “scraper” or lantern beam reveals one layer at a time.
- The user can stop before interpretation.
- The card cannot export or save publicly until the Blocked Claim and Memory / Export layers are completed.
- Private details are shown as warm internal glow; public-safe abstraction is shown as clean outer contour.
- Uncertainty appears as blur radius or broken-edge boundary, not as tiny text.

Interaction rule:

> No layer may pretend to be a later layer. Observation cannot masquerade as diagnosis. Symbol cannot masquerade as fact. Memory cannot masquerade as consent. Export cannot masquerade as privacy.

## Demo idea

Build five static cards:

1. Human body signal card.
2. Animal observation card.
3. Symbol/dream/creative image card.
4. AI opportunity/work card.
5. GitHub artifact card.

Each card must show:

- raw signal
- context ring
- safe affordance
- blocked claim
- interpretation options
- uncertainty visual
- memory/export decision
- next move

## Evaluation criterion

A nontechnical viewer should be able to answer these within 30 seconds:

1. What was observed?
2. What is interpretation rather than fact?
3. What claim is blocked?
4. What is private vs public-safe?
5. What is the next safe move?

Pass condition: 4/5 answers correct on each card.  
Fail condition: viewer treats interpretation as fact, misses the privacy boundary, or cannot identify the safe next move.

## Next concrete experiment

Create a clickable low-fidelity prototype called **Scraper Lantern Cards** using five public-safe examples. Test it against a plain text version of the same content. Measure:

- comprehension speed
- claim/source separation
- privacy-boundary recognition
- perceived agency/control
- whether the design feels alive or bureaucratic

## Status

Artifact type: bridge synthesis + product pattern + demo plan  
Claim status: plausible design hypothesis, not validated  
Privacy status: public-safe  
Medical/veterinary status: observation-only; no treatment claims
