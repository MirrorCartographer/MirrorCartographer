# Evidence Map: Read-Aloud Accessibility Boundary

Date: 2026-07-04
Status: claim narrowed / test required
Area: Mirror Cartographer accessibility, output format, screen-reader/read-aloud compatibility

## Claim tested

Mirror Cartographer outputs become accessible to read-aloud and screen-reader users if the system avoids code fences.

## Updated claim status

Downgraded / narrowed.

Avoiding code fences is a useful local formatting constraint for this user and may reduce read-aloud friction, but it is not sufficient evidence that MC is accessible. Accessibility must be tested against semantic structure, reading order, keyboard operation, labels, relationships, focus behavior, alternatives for visual information, and cognitive/language usability.

## Evidence found

### Facts

1. WCAG 2.2 is a W3C Recommendation covering accessibility across blindness, low vision, deafness/hearing loss, limited movement, speech disabilities, photosensitivity, cognitive limitations, learning disabilities, and combinations of disabilities. It explicitly states that WCAG does not address every user need.
   Source: W3C WCAG 2.2 Recommendation, https://www.w3.org/TR/WCAG22/

2. WCAG 2.2 success criteria are written as testable statements. Accessibility conformance therefore depends on tested criteria, not on intention or a single house-style rule.
   Source: W3C WCAG 2.2 Recommendation, https://www.w3.org/TR/WCAG22/

3. WCAG 2.2 includes requirements relevant to read-aloud and screen-reader behavior, including Info and Relationships (1.3.1), Meaningful Sequence (1.3.2), Sensory Characteristics (1.3.3), Keyboard (2.1.1), Focus Order (2.4.3), Headings and Labels (2.4.6), Language of Page/Parts (3.1.1/3.1.2), and Name/Role/Value (4.1.2).
   Source: W3C WCAG 2.2 Recommendation, https://www.w3.org/TR/WCAG22/

4. W3C notes that cognitive, language, and learning accessibility remain incompletely addressed by WCAG 2.2 and points authors toward supplemental guidance such as Making Content Usable for People with Cognitive and Learning Disabilities.
   Source: W3C WCAG 2.2 Recommendation, https://www.w3.org/TR/WCAG22/

5. W3C Understanding guidance for Info and Relationships explains that information and relationships conveyed visually or through layout need to be programmatically determinable or available in text.
   Source: W3C Understanding SC 1.3.1, https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html

6. W3C Understanding guidance for Meaningful Sequence requires that when content order affects meaning, a correct reading sequence can be programmatically determined.
   Source: W3C Understanding SC 1.3.2, https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html

### Inference

For MC, the problem is not only whether code fences are read aloud poorly. The deeper accessibility requirement is that symbolic, emotional, spatial, and body-map outputs remain understandable when rendered as linear speech or assistive-technology text. A visual-symbolic interface can be strong aesthetically while still failing accessibility if relationships, sequence, labels, and alternatives are not explicitly represented.

## Boundary update

Previous assumption:

- "Stop using code boxes" is the accessibility fix.

Updated assumption:

- "Avoid code fences for user-facing prose" is one formatting rule inside a larger accessibility architecture. MC must support semantic text, structured headings, meaningful reading order, labels, keyboard access, non-color alternatives, image/body-map text alternatives, and cognitive comprehension testing.

## Evaluation criterion added

### MC-READALOUD-ACCESSIBILITY-01

Any MC output or interface component intended for general use must pass a read-aloud accessibility check before it is treated as accessible.

Minimum checks:

1. No essential user-facing explanation appears only inside code fences, images, diagrams, color, position, motion, or iconography.
2. Headings describe the actual structure of the output.
3. Lists, tables, maps, body regions, symbolic nodes, and relationship graphs have a linear text equivalent.
4. The reading order preserves meaning when spoken from top to bottom.
5. Every image, symbol, glyph, body-map region, or visual state has an equivalent label or description.
6. Interactive controls can be reached and operated without drag-only, mouse-only, color-only, or gesture-only interaction.
7. Tone-mode labels do not replace explanation; symbolic, neutral, and scientific modes each state what is fact, inference, metaphor, uncertainty, and next action.
8. At least one assistive-technology/read-aloud trial is performed before claiming accessibility.

## Falsification checklist

The claim "this MC component is read-aloud accessible" should be rejected if any of the following are true:

- The spoken output skips essential content.
- The spoken output reads structural noise that obscures meaning.
- A user cannot tell what is a heading, option, warning, fact, inference, metaphor, or action.
- A visual map or symbolic layout cannot be reconstructed from text.
- The interface requires color, shape, location, drag, hover, or visual comparison without text alternatives.
- Keyboard-only operation fails for any required path.
- The output is technically readable but cognitively confusing when spoken aloud.

## Test plan

### MC-READALOUD-PILOT-01

Test 12 representative MC artifacts:

- 3 symbolic reflections
- 3 scientific/neutral reflections
- 2 body-map outputs
- 2 evidence maps
- 1 onboarding page
- 1 crisis/safety boundary page

For each artifact, test:

1. Browser read-aloud or screen-reader pass.
2. Keyboard-only navigation pass.
3. Linear text reconstruction: can a reviewer describe the structure after hearing it?
4. Fact/inference/metaphor classification: can a reviewer correctly label sentence types?
5. Visual-equivalent check: can a reviewer understand the visual/symbolic content without seeing it?
6. Cognitive load note: where did the output become too dense, noisy, or ambiguous?

Pass condition:

- 10/12 artifacts pass all structural checks, and no safety-critical artifact fails.

## Next proof needed

Run MC-READALOUD-PILOT-01 against current GitHub/site artifacts and record failures as concrete interface defects, not style preferences.
