# Uncertainty Holding Pattern

Status: architecture pattern / prototype plan  
Created: 2026-06-27  
Public-safety level: abstracted; no private user details; no medical or veterinary claims.

## Architecture question

How should Mirror Cartographer hold uncertain body, animal, creative, environmental, or project signals without prematurely converting them into meaning, memory, advice, or action?

## Short answer

MC needs an **Uncertainty Holding Pattern**: a visible interface state between raw signal and interpretation. The system should preserve the signal, label confidence, expose context, delay memory writes, and prevent external action until the user or evidence moves the signal into a stronger status.

This is not hesitation. It is architectural containment.

## Research basis

### 1. Uncertainty needs to be shown, not hidden

A 2025 Frontiers user study found that uncertainty visualization affected trust and decision confidence in AI-supported decisions. The study reports that uncertainty visualization improved trust particularly for some users with negative attitudes toward AI, and that visual form mattered: size, saturation, and transparency produced different effects. This supports MC making uncertainty visible rather than burying it inside prose.

Source: https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2025.1464348/full

### 2. Explanations should unfold through interaction

A 2025 paper on Explanation Stream Patterns argues against static, one-size-fits-all explanations. It proposes progressive disclosure and cognitive forcing functions as reusable interaction patterns for human-AI decision support. This supports MC using staged explanation cards rather than one confident paragraph.

Source: https://journals.sagepub.com/doi/10.3233/FAIA250644

### 3. Memory requires visibility and control

New America’s 2025 analysis of agent memory argues that meaningful visibility and control must come before portability or long-term memory usefulness. It specifically points toward plain-language authorization, memory dashboards, retention limits, and memory-free modes for sensitive contexts. This supports MC delaying memory until the user can see what is being stored and why.

Source: https://www.newamerica.org/insights/ai-agents-and-memory/

### 4. Multispecies / animal-adjacent interfaces require extra caution

ACI 2026 frames Animal-Computer Interaction as a multidisciplinary field involving computer science, interaction design, animal behavior, welfare science, veterinary science, ecology, and philosophy. It emphasizes ethical animal-centered research and broad forms of interaction. This supports MC treating animal-related observations as observations, not translations, diagnoses, or proof of intent.

Source: https://www.aciconf.org/aci2026

## Fact vs inference

| Item | Status | Meaning for MC |
|---|---|---|
| Uncertainty visualization can affect trust and decision confidence. | Supported by empirical study. | MC should show uncertainty as a first-class UI element. |
| Interactive explanation patterns can reduce static explanation overload. | Supported by design research. | MC should stage explanations through cards and gates. |
| Agent memory needs visibility and user control. | Supported by policy / governance analysis. | MC should not write uncertain signals directly to durable memory. |
| Animal-technology design is multidisciplinary and ethically constrained. | Supported by ACI conference framing. | MC should avoid animal-intention or animal-health claims unless source-grounded and clearly qualified. |
| A visible uncertainty lane will improve MC usability. | Inference. | Needs prototype testing. |
| The same pattern can support body signals, pet observations, creative fragments, and opportunity research. | Inference. | Needs cross-lane demo testing. |

## Design pattern: Uncertainty Holding Card

Every uncertain signal enters a card with these fields:

1. **Raw signal**  
   What was noticed before explanation.

2. **Signal lane**  
   One of: body, animal, creative, environmental, source, opportunity, interface, memory, external action.

3. **Context ring**  
   Time, place, source, body/environment modifiers, nearby events, and whether the signal is first-time or repeated.

4. **Claim status**  
   Observation, user interpretation, AI inference, sourced fact, hypothesis, design metaphor, action proposal.

5. **Confidence shape**  
   Unknown, faint, plausible, repeated, source-supported, tested, contradicted.

6. **Risk/effect level**  
   Private reflection, project note, public artifact, external action, health/veterinary/legal/financial caution.

7. **Memory decision**  
   Do not save, temporary session only, abstracted memory, project memory, durable memory, delete/forget.

8. **Next safe move**  
   Observe again, ask for source, compare alternatives, create prototype, seek qualified professional, or hold without action.

## UI metaphor

**Fog Lantern**

The signal is not erased because it is foggy. It is placed under a lantern with a visible radius:

- small glow = faint / unknown;
- wider glow = repeated or source-supported;
- broken edge = contradiction present;
- covered lantern = private / not for public artifact;
- lantern on hook = ready for review;
- lantern in hand = ready for action gate.

The metaphor should make uncertainty feel held, not failed.

## Requirement update

MC should treat uncertainty as a separate state, not as a weakness in the answer.

Required states:

- `raw_signal`
- `held_signal`
- `interpreted_signal`
- `memory_candidate`
- `action_candidate`
- `public_safe_artifact`
- `rejected_or_forgotten`

No card may skip from `raw_signal` to `memory_candidate`, `action_candidate`, or `public_safe_artifact` without a visible claim-status label.

## Falsification checklist

This pattern fails if:

- users cannot tell whether a card is fact, hypothesis, metaphor, or action proposal;
- private or sensitive signals appear in a public artifact without abstraction;
- animal observations are phrased as diagnosis, translation, or confirmed intention without evidence;
- uncertainty labels make the interface feel like bureaucratic sludge;
- the AI overuses hedging prose instead of giving clear next moves;
- the same memory appears after deletion, scope reduction, or privacy downgrade;
- the interface hides the source of an inference.

## Prototype plan

Build five static **Fog Lantern Cards**:

1. Body signal card: harmless posture/fatigue-style observation, no medical claim.
2. Animal signal card: behavior observation, no veterinary claim.
3. Creative signal card: symbol/metaphor fragment.
4. Research signal card: paper/source-based claim.
5. Action signal card: GitHub update or email draft requiring review.

For each card, test whether a non-technical viewer can identify within 30 seconds:

- what was observed;
- what is fact vs inference;
- what is private vs public-safe;
- whether memory is being written;
- whether the card can affect the outside world;
- what the next safe move is.

## Next implementation step

Add a `SignalStatusBadge` component to the MC UI with values:

- Raw
- Held
- Interpreted
- Source-supported
- Memory candidate
- Action candidate
- Public-safe
- Forgotten

Then render the five static Fog Lantern Cards as a prototype page.
