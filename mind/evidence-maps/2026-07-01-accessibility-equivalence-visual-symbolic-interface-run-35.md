# Evidence Map — Accessibility Equivalence for Visual/Symbolic Interfaces

Date: 2026-07-01
Run: Evidence Engine 35
Claim ID: C-ACCESSIBILITY-EQUIVALENCE-01
Status: supported accessibility-governance requirement; MC implementation unvalidated

## Claim tested

Weak claim / assumption:

> Mirror Cartographer can rely on rich visual, symbolic, spatial, and aesthetic interfaces as long as the experience feels meaningful to sighted users.

## Result

Not supported as stated.

The stronger evidence-based claim is:

> Mirror Cartographer may use rich visual-symbolic interfaces, but any core meaning, navigation path, decision, safety boundary, reflection output, evidence status, or user action must remain available through non-visual, keyboard-operable, screen-reader-compatible, structurally meaningful alternatives. Visual beauty may enhance the interface, but it cannot be the only carrier of meaning.

## Evidence found

### Source 1 — W3C WCAG 2.2

W3C WCAG 2.2 is a W3C Recommendation dated 2024-12-12. It defines web accessibility through testable success criteria and the four accessibility principles: perceivable, operable, understandable, and robust.

Relevant facts:

- WCAG covers recommendations for making web content accessible to people with disabilities, including blindness and low vision, deafness and hearing loss, limited movement, speech disabilities, photosensitivity, cognitive limitations, and combinations of disabilities.
- WCAG 2.2 success criteria are written as testable statements.
- WCAG specifically includes text alternatives, info and relationships, meaningful sequence, use of color, contrast, keyboard accessibility, no keyboard trap, focus order, headings and labels, focus visible, target size, readable/understandable content, accessible authentication, name/role/value, and status messages.
- WCAG warns that even high conformance may not meet every user need, especially for cognitive, language, and learning disabilities.

Implication for MC:

MC cannot treat alt text, read-aloud support, keyboard navigation, or semantic structure as optional polish. If MC uses maps, glyphs, color, body diagrams, symbolic dashboards, or proof-film views, those artifacts require equivalent text/semantic paths and testable accessibility criteria.

Source URL: https://www.w3.org/TR/WCAG22/

### Source 2 — W3C WAI Accessibility Principles

Relevant facts:

- WAI frames accessibility around content being perceivable, operable, understandable, and robust.
- Interfaces should support people using different modalities, including assistive technologies.

Implication for MC:

A symbolic-spatial interface is not accessible merely because it is emotionally resonant. The architecture must preserve meaning across sensory channels.

Source URL: https://www.w3.org/WAI/fundamentals/accessibility-principles/

### Source 3 — W3C ARIA Authoring Practices Guide

Relevant facts:

- ARIA patterns support accessible interaction design for custom widgets and dynamic interfaces.
- Rich UI components require correct roles, states, properties, keyboard interaction, and assistive-technology semantics.

Implication for MC:

If MC uses custom symbolic components, cards, collapsible maps, dashboards, body maps, node graphs, or ritual interfaces, native semantic HTML should be preferred; when custom widgets are necessary, ARIA behavior and keyboard expectations must be tested, not assumed.

Source URL: https://www.w3.org/WAI/ARIA/apg/

### Source 4 — U.S. DOJ ADA web/mobile accessibility rule, 2024

Relevant facts:

- The DOJ issued a 2024 rule on accessibility of web content and mobile apps for state and local governments.
- The rule points to WCAG technical requirements as a regulatory accessibility benchmark for covered entities.

Implication for MC:

Even if MC is not currently a covered public entity service, accessibility is not merely aesthetic ethics. WCAG-style criteria are becoming a legally and operationally important baseline for serious web systems.

Source URL: https://www.ada.gov/resources/2024-03-08-web-rule/

## Fact vs inference

### Supported by evidence

- Web accessibility requires perceivable, operable, understandable, and robust content.
- WCAG 2.2 provides testable success criteria for accessibility.
- Non-text content, visual structure, interaction controls, status messages, focus order, keyboard operation, labels, color use, contrast, and semantic roles are accessibility-relevant.
- Rich custom interface elements require explicit semantic and keyboard support.
- Conformance claims should be testable; feeling accessible is not the same as being accessible.

### Inference for Mirror Cartographer

- MC's current visual-symbolic interface may exclude users if symbolic meaning is carried mainly by color, spatial layout, animation, image, gesture, or visual metaphor.
- MC's proof-film/dashboard concept may increase persuasion while reducing auditability for screen-reader users unless it has an equivalent evidence ledger.
- MC outputs may fail read-aloud workflows if essential structure is placed in code fences, image-only diagrams, unlabeled visual layouts, or non-semantic components.
- Accessibility equivalence is likely a product-quality requirement, not merely a compliance add-on.

### Not demonstrated yet

- MC currently passes WCAG 2.2 AA.
- MC's symbolic maps can be fully understood through screen reader output.
- MC's body maps, glyphs, dashboards, or proof-film views preserve equal meaning in non-visual mode.
- MC's current GitHub mind has accessibility evidence for each interface feature.

## Claim-status update

Retire weak claim:

C-VISUAL-SYMBOLIC-ACCESSIBLE-BY-DESIGN-01

Reason retired:

Visual-symbolic expressiveness does not establish accessibility.

Replace with:

C-ACCESSIBILITY-EQUIVALENCE-01R

Status:

Supported accessibility-governance requirement; MC implementation unvalidated.

Canonical wording:

> Every MC interface that carries core meaning through visual, symbolic, spatial, color, motion, or image-based structure must provide a tested equivalent non-visual and keyboard-operable path that preserves the same information, choices, safety boundaries, and evidence status.

## Evaluation criterion

ACCESSIBILITY-EQUIVALENCE-CRITERION-01

An MC artifact, page, or component cannot be marked audit-ready unless it passes all applicable checks below:

1. Core meaning survives without color.
2. Core meaning survives without image viewing.
3. Core meaning survives linear read-aloud.
4. All actions are keyboard operable.
5. Focus order matches conceptual order.
6. Headings and labels describe actual function.
7. Status changes are exposed to assistive technology.
8. Custom widgets use native semantics where possible; otherwise ARIA roles/states/properties and keyboard patterns are tested.
9. Symbolic diagrams have concise summary plus structured long description.
10. Evidence dashboards include a text ledger with claim, status, source, inference boundary, contradiction, and next proof.
11. Motion/animation is non-essential or has reduced-motion support.
12. Authentication, persistence, and deletion flows do not depend on cognitive puzzles or inaccessible interactions.
13. No essential content is trapped in code fences when intended for read-aloud users.

## Falsification checklist

ACCESSIBILITY-EQUIVALENCE-FALSIFICATION-01

A component fails the claim if any item is true:

- Removing color changes the user's ability to identify status, risk, category, or next action.
- A screen-reader transcript loses the relationship between symbol, user input, output, and evidence status.
- A user cannot complete the core flow using keyboard only.
- Focus order jumps in a way that changes the conceptual reading of the map.
- A custom visual component has no accessible name, role, value, state, or keyboard pattern.
- An image, glyph, dashboard, or proof-film carries claim evidence that is absent from the text ledger.
- Motion, animation, or visual atmosphere is necessary to understand the output.
- Read-aloud output becomes unusable because essential content is formatted as code or visually arranged fragments.
- The component says it is accessible but lacks a test transcript or audit note.

## Test plan

ACCESSIBILITY-EQUIVALENCE-GATE-01

Scope:

Audit 10 MC artifacts:

- 2 symbolic maps
- 2 body-map or somatic-map components
- 2 evidence maps
- 2 dashboard/proof-film concepts
- 1 onboarding flow
- 1 memory/persistence flow

Procedure:

1. Generate a plain-text read-aloud transcript for each artifact.
2. Run a keyboard-only walkthrough.
3. Remove color and inspect whether meaning changes.
4. Replace every image/glyph/map with its alt/long description and check whether the claim, relationship, and next action remain understandable.
5. Check headings, labels, focus order, links, buttons, status messages, and form instructions.
6. Log every lost meaning as an accessibility-equivalence failure.
7. Separate failures into: perception failure, operation failure, structure failure, cognitive-load failure, provenance/evidence failure, and safety-boundary failure.
8. Do not increase confidence in the artifact until failures are fixed and retested.

Minimum pass condition:

- 0 critical failures in core flow.
- 0 evidence-status losses.
- 0 safety-boundary losses.
- At least 90% of symbolic relationships recoverable from non-visual text structure.
- All core actions keyboard operable.

## Confidence update

Before this map:

MC accessibility was treated as a desirable design feature.

After this map:

Accessibility equivalence is a required evidence gate for MC artifacts that depend on visual-symbolic meaning.

Confidence in broad claim:

Low: MC implementation accessibility is unvalidated.

Confidence in governance requirement:

High: the requirement is well supported by WCAG/WAI/ARIA and DOJ accessibility direction.

## Next proof needed

Run ACCESSIBILITY-EQUIVALENCE-GATE-01 against the live MC UI and the latest GitHub mind artifacts.

Publish:

- screen-reader transcript ledger
- keyboard walkthrough ledger
- color-removal status ledger
- diagram-to-text equivalence ledger
- failed component list
- fixes required before any artifact is called audit-ready
