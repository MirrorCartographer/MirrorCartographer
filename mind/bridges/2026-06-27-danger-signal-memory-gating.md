# Bridge: Danger-Signal Memory Gating

Date: 2026-06-27
Status: synthesis note + demo hypothesis
Public-safety level: public-safe; no medical, psychological, or veterinary claims

## One-line bridge

Borrow the immune-system "danger signal" idea as an interface pattern for Mirror Cartographer: do not treat every memory, symbol, or interpretation as simply allowed/blocked. Treat influence as contextual, proportionate, inspectable, and reversible.

## Why this bridge matters

Many AI memory interfaces collapse into a binary model:

- save / do not save
- remember / forget
- use memory / do not use memory
- trusted / untrusted

That is too crude for reflective symbolic systems. Mirror Cartographer needs a richer rule:

> A memory or interpretation should influence the map only when the current context provides enough safe, relevant, user-visible reason for that influence.

The immune-system analogy is useful because modern immunology moved beyond a simple self/non-self frame. The danger model argues that immune response is shaped by context and alarm signals from damaged or stressed tissue, not only by whether something is foreign. This does not prove anything about AI interfaces. It gives MC a design metaphor for context-gated influence.

## Research basis

### Biology / immunology

- Polly Matzinger's danger model challenged simple self/non-self immune framing by proposing that immune activation depends on danger/alarm signals from stressed or injured tissue.
- Later DAMP framing describes endogenous signals associated with damage or stress as part of immune activation.
- The useful abstraction for MC is not biological mechanism transfer. It is the pattern: response should be proportional to contextual evidence, not triggered by identity alone.

### Human-AI interaction

- Recent HCI work argues that the interface is the place where human agency, uncertainty, and AI mediation must be managed.
- Human-AI decision-support studies show that confidence displays, explanations, and cognitive forcing functions can change trust and engagement, but poorly tuned friction can increase cognitive effort or degrade task performance.
- Explainable interface surveys argue that explanations must be designed around user needs and practical usability, not merely attached as text after model output.

## Fact vs inference

### Better-supported facts

- The immune danger model exists and is used to explain immune activation as context- and signal-dependent rather than purely self/non-self.
- AI interfaces can change human trust, effort, and decision behavior.
- Explanation alone is not sufficient for good human-AI collaboration; interface design matters.

### MC-specific inference

- MC may benefit from a danger-signal-inspired influence gate for memory, symbols, and interpretations.
- This pattern may reduce overreach by making influence conditional, inspectable, and reversible.
- This pattern has not yet been validated for MC. It needs prototype testing.

## Design pattern: Danger-Signal Memory Gate

Every candidate influence must pass through four visible checks before affecting the map.

### 1. Source identity

What is trying to influence the map?

Examples:
- current user input
- prior user-authored memory
- AI-generated interpretation
- symbol glossary entry
- body/felt-state observation
- external research note

### 2. Context fit

Why is this influence relevant here?

Possible states:
- direct match
- partial match
- metaphorical match
- weak match
- stale match
- blocked context

### 3. Alarm / sensitivity signal

What makes this influence require extra care?

Possible signals:
- private memory involved
- identity-level interpretation
- health, animal health, or safety-adjacent content
- strong emotional language
- high uncertainty
- contradiction with user correction
- public/private boundary risk
- diagnostic or authority-risk language

### 4. Response level

What is the safest proportionate action?

Possible actions:
- ignore for this turn
- show as optional influence
- ask one clarifying question
- use only as weak context
- use with visible uncertainty label
- require user confirmation before saving or applying
- block and explain why

## Product wedge

Build a visible "Influence Gate" panel beside MC's interpretation output.

The panel should answer:

1. What influenced this reading?
2. Why was each influence allowed?
3. What was withheld or downweighted?
4. What would change the map if the user rejects one influence?

This converts memory safety from a hidden policy into a visible part of the reflective interface.

## Visual metaphor spec

Name: **The Lantern Gate**

Visual logic:
- Lantern = influence source currently casting light on the map
- Fog = uncertainty / weak context fit
- Red thread = high-sensitivity influence requiring care
- Gate = permission boundary
- Footprint = trace of influence used in the current output
- Covered lantern = available memory intentionally not used

The user should be able to click any lantern and choose:

- dim this
- hide this for now
- block in this context
- correct this
- allow this once
- allow this pattern in future

## Demo idea

Prototype: **The Lantern Gate Demo**

Input phrase:

> "There is pressure behind the door again."

The demo should produce three interpretation candidates:

1. literal/environmental reading
2. symbolic/creative reading
3. memory-influenced reading

Beside each candidate, show:

- influence sources
- confidence / uncertainty
- sensitivity flags
- blocked memories, if any, without revealing private content
- user controls to dim, reject, or permit influence

Pass condition:

- The interface never states that the user "is" anything.
- It separates observation, interpretation, memory influence, and user correction.
- It shows at least one candidate influence that is intentionally withheld.

Fail condition:

- It uses private memory invisibly.
- It treats metaphor as diagnosis.
- It makes identity-level claims.
- It cannot explain why a memory influenced the map.

## Next concrete experiment

Create a 12-card paper or Figma prototype for **The Lantern Gate**.

Test set:
- 4 symbolic phrases
- 4 body/felt-state phrases
- 4 practical decision phrases

For each phrase, test whether the interface can visibly sort influences into:

- used
- optional
- withheld
- blocked
- corrected

Measure only visible behavior:

- Was each influence source visible?
- Was the permission state visible?
- Could the user reject an influence?
- Did rejection change the next map state?
- Did the system avoid diagnostic or authority claims?

## Claim status

Current status: promising design metaphor, not validated.

MC may use this bridge as an interface design pattern. It should not claim biological equivalence, therapeutic effect, or immune-system accuracy beyond the cited conceptual inspiration.
