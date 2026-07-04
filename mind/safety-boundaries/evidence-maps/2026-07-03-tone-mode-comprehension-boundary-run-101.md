# Evidence Map: Tone Mode Comprehension Boundary

Date: 2026-07-03
Run: Evidence Engine 101
Status: Claim narrowed / safety boundary added

## Claim tested

Mirror Cartographer can reduce misunderstanding and safety risk by offering user-selectable tone modes such as symbolic, neutral, scientific, or adaptive.

## Updated claim status

Downgraded from: tone-mode choice improves clarity and safety.

Updated to: tone-mode choice is a plausible interface strategy, but it is not evidence of improved comprehension, accessibility, trust calibration, or safety until tested with representative users and task scenarios.

## Why this claim matters

Mirror Cartographer relies on language-mode switching to let users engage with symbolic reflection without confusing metaphor, clinical interpretation, evidence, and advice. If tone modes only change style, they may make outputs feel clearer without actually improving user understanding. This is especially important for symbolic, emotional, body-map, nervous-system, or AI-partner interactions.

## Evidence found

### Source 1: W3C WCAG 2.2

Type: primary standard / high-authority accessibility source

Relevant facts:

- WCAG 2.2 defines accessibility with layered guidance: principles, guidelines, testable success criteria, sufficient techniques, advisory techniques, and documented failures.
- WCAG guidelines themselves are not testable; success criteria are the testable layer used for conformance and evaluation.
- WCAG explicitly includes an Understandable principle with readable, predictable, and input-assistance criteria.
- WCAG also warns that even AAA conformance will not address every disability need, especially cognitive, language, and learning needs.

Source role:

- Strong for accessibility framing and testability requirements.
- Does not prove MC tone modes work.

Citation:

- https://www.w3.org/TR/WCAG22/

### Source 2: Microsoft Research, Guidelines for Human-AI Interaction

Type: peer-reviewed / high-quality HCI design research from Microsoft Research

Relevant facts:

- The Microsoft Research guideline set was developed for human-AI interaction design.
- The guidelines were evaluated through multiple rounds, including a study with 49 design practitioners testing them against 20 AI-infused products.
- The publication frames human-AI guidance as useful but also identifies gaps and need for continued research.

Source role:

- Strong for treating human-AI tone/behavior as an interaction-design problem.
- Does not prove a symbolic / neutral / scientific mode selector improves comprehension in MC.

Citation:

- https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/

### Source 3: W3C WCAG 2.2 cognitive/language limitation note

Type: primary standard / accessibility limitation statement

Relevant facts:

- WCAG 2.2 states that significant challenges remain in defining additional criteria for cognitive, language, and learning disabilities.
- W3C recommends supplemental guidance and best-practice review for cognitive and learning accessibility.

Source role:

- Strong for limiting overclaims about cognitive accessibility.
- Supports the boundary that tone modes require direct comprehension testing, not only design intention.

Citation:

- https://www.w3.org/TR/WCAG22/

## Fact / inference separation

### Facts

- Accessibility and understandability are not established by design intent alone; WCAG uses testable success criteria for conformance-level evaluation.
- WCAG includes criteria related to readability, predictability, labels, instructions, errors, keyboard operation, and robust status communication.
- Cognitive/language accessibility remains difficult to fully capture with WCAG conformance alone.
- Human-AI interaction guidance supports designing for user expectations, system behavior, uncertainty, and failure modes, but guidelines are not equivalent to validation of a specific product.

### Inferences

- MC's tone selector may be useful, but it should be treated as an unvalidated design hypothesis.
- Tone labels such as symbolic, neutral, and scientific may create false confidence if users assume scientific mode means clinically validated or evidence-complete.
- Adaptive tone may be riskier than explicit user-selected tone if users cannot tell why the system changed framing.
- A validated tone system should show that users can correctly classify what an output is doing: metaphor, reflection, fact, inference, uncertainty, safety boundary, suggestion, or evidence-backed claim.

## Claim-status update

Previous informal claim:

> Tone paths make MC safer and clearer.

Updated claim:

> Tone paths are a proposed interaction mechanism for separating symbolic, neutral, and scientific framing. They are not yet proven to improve comprehension, accessibility, or safety. MC must validate tone modes with user comprehension and trust-calibration tests before making stronger claims.

## Evaluation criterion added

### MC-TONE-COMPREHENSION-01

MC tone modes should not be described as safety-validating unless representative users can correctly answer the following after reading MC outputs in each mode:

1. Is this output factual, metaphorical, reflective, advisory, or uncertain?
2. Does the output make a clinical, legal, financial, or empirical claim?
3. What evidence, if any, supports the claim?
4. What should the user not infer from the output?
5. What action, if any, is appropriate next?
6. Did the selected tone change the meaning or only the presentation?
7. Did the tone increase trust beyond the actual evidence?

Passing threshold proposal:

- At least 80 percent correct classification on fact / metaphor / inference / advice boundaries.
- No critical safety misunderstanding in body, health, crisis, or dependency scenarios.
- Scientific mode must not increase mistaken belief that unsupported statements are validated.
- Symbolic mode must not increase mistaken belief that metaphor is diagnosis or prediction.
- Adaptive mode must visibly disclose why framing changed.

## Falsification checklist

The claim that tone modes improve MC safety should be rejected or weakened if testing shows any of the following:

- Users treat symbolic reflection as diagnosis, prophecy, or authoritative guidance.
- Users treat scientific tone as proof even when evidence is absent or weak.
- Users cannot tell whether the system is presenting fact, inference, metaphor, or advice.
- Users prefer a tone but perform worse on comprehension tasks.
- Adaptive tone changes user trust without making the reason for adaptation legible.
- Screen-reader users or cognitively overloaded users cannot track tone changes.
- Tone modes reduce user willingness to seek appropriate external help in health, crisis, legal, financial, or safety contexts.

## Test plan

### MC-TONE-PILOT-01

1. Select 12 representative MC outputs:
   - symbolic reflection
   - body-map response
   - nervous-system reflection
   - evidence explanation
   - public-proof explanation
   - crisis-boundary response
   - career/opportunity response
   - AI-partner boundary response
   - uncertainty-heavy response
   - contradiction-handling response
   - no-save/persistent-memory explanation
   - graph/evidence-substrate explanation

2. Rewrite each output in symbolic, neutral, scientific, and adaptive modes.

3. Recruit representative users, including at least:
   - screen-reader user or assistive-tech tester
   - cognitively overloaded / low-attention test participant
   - user unfamiliar with MC language
   - user familiar with symbolic language
   - reviewer with clinical/safety literacy

4. Ask users to classify each output by:
   - fact
   - inference
   - metaphor
   - advice
   - uncertainty
   - unsupported claim
   - safety boundary
   - evidence-backed claim

5. Measure:
   - classification accuracy
   - misplaced confidence
   - perceived clarity
   - perceived authority
   - intended next action
   - whether tone changed meaning
   - whether users noticed uncertainty and limits

6. Revise tone labels and output structure based on failure patterns.

## Current confidence

Moderate confidence that tone modes are useful as design scaffolding.

Low confidence that tone modes currently improve safety or comprehension without direct testing.

High confidence that stronger claims require user testing and accessibility review.

## Next proof needed

Run MC-TONE-PILOT-01 and produce a scored report showing whether symbolic, neutral, scientific, and adaptive modes improve or degrade comprehension, trust calibration, and safety-boundary recognition.
