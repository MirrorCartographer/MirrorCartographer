# Evidence Map: Screen-reader mode vs accessibility boundary

Date: 2026-07-03
Claim ID: C-MC-SCREEN-READER-ACCESSIBILITY-01R
Run ID: Evidence Engine run 79
Status: PARTIALLY SUPPORTED DESIGN INTENT; ACCESSIBILITY UNVALIDATED

## Claim tested

Mirror Cartographer is accessible because it avoids code fences, supports screen-reader/read-aloud use, and offers a simplified/alt mode.

## Why this claim needs stronger evidence

This claim is attractive because it turns a known user constraint into a product promise. The weak point is that accessibility is not established by one accommodation, one preferred output style, or an internal design intention. Accessibility requires testable criteria, assistive-technology compatibility, cognitive-load review, and direct evaluation with affected users.

## Evidence found

### Source 1: W3C WCAG 2.2

W3C WCAG 2.2 is a W3C Recommendation. It defines accessibility through broad, testable success criteria across perceivable, operable, understandable, and robust content. WCAG explicitly says its guidance covers many disabilities and offers some accommodation for cognitive and learning disabilities, but does not address every user need. WCAG also states that its success criteria are written as testable statements and that conformance depends on more than content alone, including user agents and authoring tools.

Citation: https://www.w3.org/TR/WCAG22/

Relevant boundary:
- Avoiding code fences may improve read-aloud compatibility for some outputs.
- It does not establish WCAG conformance.
- It does not test keyboard access, focus order, labels, status messages, reflow, contrast, headings, semantic structure, or assistive-technology behavior.

### Source 2: W3C Making Content Usable for People with Cognitive and Learning Disabilities

W3C COGA guidance is supplemental to WCAG and focuses on cognitive and learning disabilities. It recommends clear purpose, clear operation, clear navigation, understandable content, mistake prevention, focus support, reduced reliance on memory, help/support, adaptation, and personalization. It also includes usability testing, focus groups, feedback, and specific test objectives such as whether users can understand what things are, find what they need, maintain focus, and complete processes without relying on memory.

Citation: https://www.w3.org/TR/coga-usable/

Relevant boundary:
- MC's symbolic and adaptive interface may support cognitive orientation for some users.
- Symbolic/metaphoric interfaces can also increase cognitive burden if purpose, controls, hierarchy, or outcomes are unclear.
- A cognitive-accessibility claim needs user testing, not only design rationale.

### Source 3: Accessible visualization description research

Research on accessible visualization via natural-language descriptions found that access to meaningful information is reader-specific, and blind and sighted readers can differ in which semantic content they find useful. This supports a boundary for MC's visual/symbolic maps: text alternatives and summaries need to communicate relevant structure, not merely restate visual decoration.

Citation: Lundgard & Satyanarayan, "Accessible Visualization via Natural Language Descriptions: A Four-Level Model of Semantic Content," IEEE VIS 2021 / arXiv: https://arxiv.org/abs/2110.04406

Relevant boundary:
- A text description of an MC glyph/map is not automatically useful.
- Useful accessibility descriptions should expose construction, relationships, patterns, and domain meaning where relevant.
- MC needs a semantic alt-text rubric for symbolic maps.

## Fact vs inference

### Supported facts

1. WCAG 2.2 frames accessibility as a set of testable success criteria rather than a general intention.
2. WCAG 2.2 does not cover every user need, especially across all cognitive/language/learning disability combinations.
3. W3C COGA guidance recommends clear purpose, clear operation, clear navigation, understandable content, mistake prevention, focus support, memory-load reduction, help/support, adaptation, and personalization.
4. W3C COGA guidance includes user testing and feedback as part of making content usable for people with cognitive and learning disabilities.
5. Accessible descriptions of visual content are reader-specific and need to communicate meaningful structure, not just visual presence.

### Inferences for Mirror Cartographer

1. MC's no-code-fence rule likely improves read-aloud usability for at least some users, but this is not enough to claim accessibility.
2. MC's symbolic maps may require stronger semantic alt text than ordinary image captions because the map's meaning is relational and metaphorical.
3. MC's alt/simplified mode should be treated as an accessibility hypothesis until evaluated with screen readers, keyboard-only interaction, mobile reflow, and cognitive walkthroughs.
4. MC's aesthetic interface may conflict with accessibility if symbolic density, motion, contrast, or unfamiliar controls reduce comprehension.

## Claim-status update

C-MC-SCREEN-READER-ACCESSIBILITY-01R: MC has accessibility-supporting design intentions, including avoidance of code fences and interest in screen-reader/alt modes. These support a narrower claim: MC is attempting to reduce specific accessibility barriers. They do not validate that MC is accessible, WCAG-conformant, cognitively usable, or safe for users relying on assistive technologies.

Confidence: Medium for the boundary; low for any MC-specific accessibility benefit until tested.

## Evaluation criterion added

### MC-ACCESSIBILITY-GATE-01: Accessibility claims require evidence beyond output style

A Mirror Cartographer interface, page, artifact, or prompt flow may not be described as "accessible" unless it passes all relevant gates below.

#### Gate A: Structural accessibility

- Page has meaningful title and headings.
- Reading order matches visual/logical order.
- Interactive controls have accessible names, roles, and states.
- Focus order is logical.
- Keyboard-only use can complete the core task.
- Status updates are available to assistive technologies.
- Text can reflow and resize without loss of function.
- Color is not the only channel of meaning.
- Contrast meets the chosen WCAG target.

#### Gate B: Read-aloud and screen-reader usability

- No essential content is trapped in code blocks, images, canvas, unlabelled controls, or decorative-only glyphs.
- Symbolic maps include semantic alternatives: what the parts are, how they relate, what changed, and what action or reflection the map supports.
- Long outputs include summary first, then deeper layers.
- Tables/lists/sections remain meaningful when read linearly.

#### Gate C: Cognitive accessibility

- User can identify the purpose of the page or flow within 10 seconds.
- User can identify the next action without relying on memory from earlier screens.
- Instructions are separated step-by-step.
- Nonliteral metaphors are optional or explained.
- The user can switch to plain/neutral mode without losing core function.
- The system avoids unnecessary interruptions, motion, or symbolic overload.

#### Gate D: Evidence requirement

- Automated checks are run and logged.
- Manual keyboard/screen-reader checks are run and logged.
- At least five representative usability sessions or structured walkthroughs are recorded before claiming validated accessibility.
- Any failure affecting task completion blocks external accessibility claims until fixed or explicitly scoped out.

## Falsification checklist

The claim "MC is accessible" is falsified or must be narrowed if any of the following are true:

- A screen-reader user cannot complete the core reflection flow without sighted assistance.
- A keyboard-only user cannot complete the core reflection flow.
- Symbolic maps lose essential meaning when images are unavailable.
- Read-aloud mode skips, garbles, or misorders essential content.
- Mobile layout causes hidden controls, overlapping text, or impossible navigation.
- A user cannot tell what the page is for or what to do next.
- Accessibility depends on the user already understanding MC's symbolism.
- The project has no logged assistive-technology test evidence.

## Test plan

Test ID: MC-ACCESSIBILITY-VALIDATION-PILOT-01

### Objective

Determine whether the current MC interface and evidence artifacts are usable through screen reader/read-aloud, keyboard-only, mobile, and simplified cognitive-accessibility paths.

### Sample

- 3 screen-reader/read-aloud users or proxy audits using NVDA/VoiceOver plus manual review.
- 3 keyboard-only sessions.
- 3 mobile sessions.
- 5 cognitive walkthroughs focused on purpose, next action, memory load, metaphor clarity, and recovery from mistakes.

### Core tasks

1. Start a reflection session.
2. Choose a tone/path.
3. Enter a symbolic or plain-language state.
4. Receive a map/response.
5. Understand what the system says happened.
6. Find the next action.
7. Switch to plain/alt mode.
8. Export or save the result.
9. Recover from one intentional error.

### Metrics

- Task completion rate.
- Completion without assistance.
- Number of blocking accessibility defects.
- Number of serious cognitive-load defects.
- Screen-reader/read-aloud comprehension score.
- Keyboard-only completion score.
- User confidence after task.
- User-reported confusion points.

### Promotion rule

The claim may be upgraded only if:

- 90%+ of core tasks are completed without blocking failures.
- No critical screen-reader or keyboard traps remain.
- Symbolic map alternatives preserve essential meaning.
- Cognitive walkthroughs show users can identify purpose, next action, and recovery path.
- Remaining defects are logged with severity and fix owner.

### Retirement / narrowing rule

If MC cannot pass core flow testing, the claim must be narrowed to: "MC includes accessibility-oriented design intentions, but accessibility has not been validated."

## Next proof needed

Run MC-ACCESSIBILITY-VALIDATION-PILOT-01 against the live MC UI and at least three recent evidence artifacts. Publish an accessibility ledger containing test environment, assistive technology used, pass/fail results, blocking defects, screenshots or transcripts where possible, fixes made, and retest status.
