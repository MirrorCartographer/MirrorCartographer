# Accessibility Claim Boundary — Run 90

Date: 2026-07-03  
Status: evidence map + test plan added; implementation unverified  
Claim tested: Mirror Cartographer can claim it is accessibility-ready because accessibility has been included as a design principle.

## Result

The claim is rejected as stated.

Mirror Cartographer can accurately claim that accessibility is a design requirement and governance priority. It should not claim that the product is accessibility-ready, WCAG-conformant, screen-reader-ready, or broadly accessible until implementation-level testing is completed.

## High-quality sources reviewed

1. W3C, Web Content Accessibility Guidelines (WCAG) 2.2, W3C Recommendation, 2024-12-12.  
   https://www.w3.org/TR/WCAG22/

2. W3C WAI, WCAG 2 Overview.  
   https://www.w3.org/WAI/standards-guidelines/wcag/

3. U.S. Department of Justice, Fact Sheet: New Rule on the Accessibility of Web Content and Mobile Apps Provided by State and Local Governments, 2024-03-08.  
   https://www.ada.gov/resources/2024-03-08-web-rule/

## Facts

- WCAG 2.2 is a W3C Recommendation and provides a technical standard for web accessibility.
- WCAG 2.2 success criteria are written as testable statements, not merely design intentions.
- WCAG 2.2 is organized around perceivable, operable, understandable, and robust content.
- W3C states that even conformance at the highest level does not guarantee accessibility for every person with every type, degree, or combination of disability.
- WCAG 2.2 includes requirements relevant to MC’s current risks, including text alternatives, contrast, reflow, keyboard access, no keyboard trap, focus order, focus visible, target size, dragging movements, input assistance, accessible authentication, name/role/value, and status messages.
- Accessibility depends on content, browsers, user agents, and authoring tools, not only the website’s intention or visual design.
- The DOJ’s 2024 rule for state and local government web content and mobile apps uses WCAG 2.1 Level AA as the technical standard in that legal context. This does not directly regulate MC as a private product, but it confirms that WCAG conformance is treated as an implementation-level requirement, not a symbolic commitment.

## Inferences

- MC’s accessibility promise is currently best classified as a design commitment, not a validated product capability.
- A symbolic, visual, body-map, or emotionally rich interface creates elevated accessibility risk because it can depend heavily on color, spatial layout, gesture, hover/focus behavior, animation, and non-text meaning.
- MC needs accessibility testing at the component, flow, and full-session levels before public-facing claims are upgraded.
- Screen-reader support is not equivalent to adding alt text. MC must preserve meaning, sequence, state, controls, errors, and status changes in assistive technologies.

## Claim-status update

C-ACCESSIBILITY-READY-01R: Mirror Cartographer is not yet accessibility-ready. It has an accessibility requirement and should target WCAG 2.2 AA plus additional cognitive/accessibility usability checks, but no conformance or readiness claim should be made until testing is complete.

Status: downgraded from implied readiness to design requirement / unvalidated implementation.

## Evaluation criterion: MC-A11Y-GATE-01

Mirror Cartographer may claim “accessibility-tested” only after passing all of the following:

1. Automated scan
   - Run axe-core, Lighthouse, or equivalent on all public routes.
   - Record violations, severity, affected nodes, and fixes.

2. Keyboard-only path
   - Complete the full user path without a mouse or touch gesture.
   - No keyboard trap.
   - Visible focus throughout.
   - Logical focus order.

3. Screen-reader path
   - Test with at least one major screen reader/browser combination.
   - All controls expose correct name, role, value, state, and instructions.
   - Status changes are announced where needed.
   - Symbolic/body-map content has meaningful nonvisual equivalents.

4. Visual accessibility
   - Text contrast meets WCAG AA where applicable.
   - Non-text UI indicators do not rely on color alone.
   - Layout reflows without loss of meaning.
   - Text can resize without breaking critical flows.

5. Motion and interaction
   - No unsafe flashing.
   - Animations triggered by interaction can be reduced or disabled.
   - Dragging or gesture-only interactions have alternatives.
   - Targets meet minimum usable size requirements.

6. Cognitive and symbolic clarity
   - Symbolic language has a plain-language equivalent.
   - The user can choose neutral/scientific language instead of mythopoetic language.
   - Warnings, choices, privacy states, and save/no-save boundaries are explicit.
   - The system does not require symbolic interpretation to access core function.

7. Human usability check
   - At least 5 task-based accessibility sessions, including screen-reader or keyboard users if possible.
   - Record completion, confusion points, errors, assistive-tech problems, and repair actions.

## Falsification checklist

The accessibility-ready claim fails if any of the following are true:

- A user cannot complete the main session flow with keyboard only.
- A screen reader cannot identify controls, states, or session progress.
- Symbolic maps convey core meaning only visually.
- Color or spatial position is required to understand a result.
- Dragging is required without an alternate input path.
- Focus disappears, becomes obscured, or moves unpredictably.
- Error states are visual-only.
- Save/no-save privacy state is not programmatically and textually clear.
- Automated accessibility tools report serious violations that remain unresolved.
- Human assistive-technology testers cannot complete core tasks.

## Product implication

MC should use this public wording until tests are complete:

“Accessibility is a core design requirement. The current interface is not yet certified or validated as WCAG-conformant. We are building toward testable accessibility, including keyboard navigation, screen-reader compatibility, reduced-motion support, plain-language alternatives, and nonvisual equivalents for symbolic content.”

Avoid:

- “fully accessible”
- “screen-reader-ready”
- “WCAG-compliant”
- “usable by everyone”
- “accessible because we considered accessibility”

## Next proof needed

Run MC-A11Y-AUDIT-01 on the live site.

Minimum output:

- URL list tested;
- tool versions;
- automated scan results;
- keyboard-only transcript;
- screen-reader transcript;
- contrast/reflow findings;
- gesture/motion findings;
- cognitive/plain-language findings;
- defects opened;
- fixes committed;
- retest result;
- final claim status.

Confidence should not be upgraded until implementation-level evidence exists.
