# Evidence Map — Accessibility Alt Mode Conformance Boundary

Date: 2026-07-02
Run: Evidence Engine run 53
Area: Mirror Cartographer / UI accessibility / readable mode

## Claim tested

C-ACCESSIBILITY-ALT-MODE-01: Mirror Cartographer is accessible if it provides an alternate readable mode, avoids code blocks, and includes simpler text for screen-reader users.

## Bottom line

Status: RETIRED / REPLACED.

Replacement claim: C-ACCESSIBILITY-ALT-MODE-CONFORMANCE-01R — An alternate readable mode can reduce friction for some users, but it does not establish accessibility. Accessibility requires flow-level conformance testing against WCAG success criteria, assistive-technology behavior checks, keyboard/focus testing, semantic structure review, and user validation where possible. MC implementation unvalidated.

## Why this claim needed stronger evidence

The GitHub mind and MC planning history contain repeated commitments to screen-reader compatibility, alt mode, readable mode, and avoiding code fences because the user's read-aloud tooling does not reliably read code blocks. That is a valid design requirement, but it is not enough evidence to claim that MC is accessible.

The weak point is conflating a local accommodation with accessibility conformance.

## Primary / high-quality sources reviewed

1. W3C WCAG 2.2 Recommendation, 2024-12-12
   - URL: https://www.w3.org/TR/WCAG22/
   - Key points used:
     - WCAG 2.2 covers recommendations for making web content more accessible across disability categories, but does not address every user need.
     - WCAG uses testable success criteria for conformance testing.
     - Conformance applies to complete processes, not isolated pieces.
     - Even AAA conformance will not meet all needs, particularly for cognitive, language, and learning disabilities.

2. W3C WAI ARIA Authoring Practices Guide — Read Me First
   - URL: https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/
   - Key points used:
     - ARIA affects the non-visual experience of screen-reader users.
     - Incorrect ARIA can misrepresent the visual experience and harm the non-visual experience.
     - Semantic implementation must be tested, not assumed.

3. W3C WAI Evaluating Web Accessibility Overview
   - URL: https://www.w3.org/WAI/test-evaluate/
   - Key point used:
     - Evaluation requires checking accessibility; automated tools are useful but incomplete, and manual review / user involvement may be needed depending on the goal.

4. U.S. Access Board Revised 508 Standards and 255 Guidelines
   - URL: https://www.access-board.gov/ict/
   - Key points used:
     - Revised 508 incorporates WCAG as a consensus accessibility standard for ICT.
     - WCAG conformance is a structured standard, not a general claim of good intent.
     - Web applications may still present compatibility issues with assistive technology; conformance and platform behavior need review.

## Fact vs inference

### Supported by sources

- WCAG 2.2 is a formal W3C Recommendation and provides testable accessibility success criteria.
- WCAG conformance cannot be claimed from one feature alone; complete processes matter.
- WCAG helps accessibility but does not guarantee every individual user's needs are met.
- ARIA and custom UI semantics can improve accessibility when correct, but incorrect ARIA can worsen screen-reader experience.
- Accessibility evaluation should combine criteria-based checks with manual/assistive-technology review where necessary.

### Inference for Mirror Cartographer

- MC's readable/alt mode likely reduces friction for users whose read-aloud tools fail on code blocks.
- MC cannot claim accessibility until the actual UI and interaction flows are tested.
- A symbolic/visual/emotional interface has elevated accessibility risk because meaning may be carried by layout, color, image, position, animation, metaphor, or hidden state.
- MC needs a specific accessibility test plan for symbolic maps, body maps, ritual cards, tone modes, saved memory views, consent screens, and crisis/handoff flows.

### Not established

- That MC currently conforms to WCAG 2.2 A, AA, or AAA.
- That MC's alt mode works reliably with VoiceOver, NVDA, JAWS, TalkBack, browser read-aloud, or ChatGPT read-aloud.
- That MC's visual-symbolic content has equivalent nonvisual meaning.
- That simplified language preserves the same meaning as symbolic/visual mode.
- That screen-reader users can complete full MC flows independently.

## Evidence boundary

Accessible intent is not accessibility evidence.

Readable copy is not screen-reader compatibility.

Alt mode is not conformance unless it is equivalent, complete, reachable, operable, understandable, and robust across the relevant process.

## Evaluation criterion added

Criterion ID: ACCESSIBILITY-ALT-MODE-CONFORMANCE-GATE-01

A Mirror Cartographer UI flow cannot be labeled accessible unless all of the following are recorded:

1. Flow identity
   - Entry / reflection / body map / saved memory / symbol glossary / consent / crisis handoff / export / account settings.

2. Standard target
   - WCAG 2.2 A, AA, or AAA.
   - If using Section 508 language, record whether WCAG 2.0 AA or newer internal WCAG 2.2 target is being used.

3. Complete-process coverage
   - Every required screen and step in the flow is included.
   - No inaccessible screen is hidden behind an accessible entry page.

4. Screen-reader and read-aloud test matrix
   - At minimum: browser read-aloud plus one real screen reader when possible.
   - Record tool, browser, OS, date, tester, and failure notes.

5. Keyboard-only operability
   - Focus order, visible focus, no keyboard trap, escape behavior, modal behavior, target size, and recovery path.

6. Semantic equivalence
   - For images, glyphs, maps, colors, body-map marks, spatial relations, and animations: record the nonvisual equivalent meaning.
   - Mark whether the equivalent is exact, approximate, interpretive, or unavailable.

7. Cognitive load / language review
   - Plain-language path available.
   - Symbolic-language path preserved without forcing interpretation.
   - Terms with unusual meanings are explainable and reversible.

8. Failure handling
   - Error messages are readable.
   - Crisis/handoff messages are reachable without relying on color, animation, hidden hover states, or visual-only cues.

9. Evidence artifacts
   - Screenshots where useful.
   - Accessibility checker output.
   - Manual test notes.
   - Known failures.
   - Remediation status.

10. Claim discipline
   - If only partial tests exist, label as partial support.
   - Do not use accessible, WCAG-conformant, screen-reader-ready, or disability-safe without evidence.

## Test plan

Test ID: MC-ACCESSIBILITY-ALT-MODE-PILOT-01

Sample:
- 5 core MC flows:
  1. Start reflection session.
  2. Add a symbol/body sensation.
  3. Read generated symbolic reflection.
  4. Save/edit symbol glossary item.
  5. Reach crisis/handoff or support boundary text.

Method:
- Run automated accessibility scan.
- Run keyboard-only pass.
- Run screen-reader/read-aloud pass.
- Compare visual-symbolic output to alt/readable output.
- Create a failure ledger.

Pass threshold:
- No blocker failures in entry, consent, crisis/handoff, or save/edit flows.
- Every visual-symbolic artifact has a nonvisual equivalent or is explicitly marked decorative.
- No required action depends on mouse-only, color-only, image-only, hover-only, animation-only, or unexplained spatial position.

## Falsification checklist

The accessibility claim fails if any of the following are found:

- A user cannot complete a core flow using keyboard only.
- A screen reader cannot identify control names, roles, or values.
- MC output carries meaning through color, glyph, map position, animation, or layout without equivalent text.
- Alt mode omits warnings, uncertainty labels, consent information, or crisis/handoff content.
- The simplified version changes the meaning of symbolic content without disclosure.
- The page passes automated checks but fails manual screen-reader or keyboard testing.
- The system claims accessibility based only on design intent, not evidence.

## Claim-status update

Retire:
- C-ACCESSIBILITY-ALT-MODE-01: alt/readable mode means MC is accessible.

Replace with:
- C-ACCESSIBILITY-ALT-MODE-CONFORMANCE-01R: alt/readable mode is a useful accommodation candidate, but accessibility remains unvalidated until complete-process WCAG/assistive-technology testing is performed and failures are logged.

Confidence:
- High confidence in the boundary requirement.
- Low confidence in current MC implementation accessibility until tested.

## Next proof needed

Run MC-ACCESSIBILITY-ALT-MODE-PILOT-01 against the live MC UI and publish:

- automated scan results,
- keyboard-only notes,
- screen-reader/read-aloud notes,
- visual-to-nonvisual equivalence ledger,
- blocker failure list,
- remediation checklist,
- and final claim status: untested / partially supported / supported for tested flows only / failed.
