# Body Map Clinical Boundary Evidence Map

Date: 2026-07-03

## Artifact type

Safety boundary / evidence map / falsification checklist / evaluation criterion.

## Claim tested

Mirror Cartographer can safely use a body map for nervous-system reflection because the feature is framed as symbolic, reflective, or non-diagnostic.

## Status update

Downgrade from design-assumption to unvalidated safety claim.

Updated claim:

Mirror Cartographer may use body-map interaction as a reflective or journaling interface only if it avoids diagnostic interpretation, preserves user agency, provides non-sensory alternatives, distinguishes metaphor from fact, and passes a safety/usability audit. It is not currently validated as a clinical, diagnostic, or treatment-support feature.

## Evidence found

### Source 1: W3C WCAG 2.2

Source role: direct support for interface accessibility requirements; indirect support for body-map safety.

Facts:

- WCAG 2.2 says accessibility guidance covers a wide range of disabilities, including cognitive, neurological, visual, physical, and learning disabilities, but does not meet every user need.
- WCAG success criteria are testable statements, not broad design intentions.
- WCAG includes Success Criterion 1.3.3 Sensory Characteristics, meaning instructions cannot rely only on sensory characteristics such as shape, color, size, visual location, orientation, or sound.
- WCAG also includes requirements relevant to body-map interfaces, including keyboard accessibility, pointer gestures, dragging movements, target size, non-text contrast, focus order, labels/instructions, and status messages.

Implication for MC:

A body map that requires visual-spatial interpretation, dragging, color meaning, or shape/location-only instructions is not accessibility-ready unless equivalent non-sensory and keyboard/screen-reader paths exist.

### Source 2: FDA Clinical Decision Support guidance / software boundary logic

Source role: indirect but high-quality regulatory boundary context.

Facts:

- FDA clinical-decision-support logic distinguishes lower-risk informational support from software that drives diagnosis or treatment decisions.
- A key boundary is whether the user can independently review the basis for recommendations and does not rely primarily on the software output.
- Patient-facing health interpretation is more sensitive than clinician-facing support because the user may not have the clinical training to evaluate the recommendation.

Implication for MC:

If the body map converts sensations into health meaning, likely causes, treatment direction, risk labels, or triage-like outputs, it moves away from journaling and toward health decision support. That requires stronger validation and clearer clinical-safety controls.

### Source 3: Health AI evaluation literature

Source role: indirect support for safety-validation requirements.

Facts:

- AI health-system evaluation literature distinguishes preclinical/theoretical evaluation, exploratory evaluation, definitive evaluation, and post-market monitoring.
- Safety, acceptability, efficacy, and real-world use are separate evaluation questions.

Implication for MC:

Even if body-map reflections are acceptable to users, that does not prove safety, clinical usefulness, or low risk. MC needs staged evaluation rather than a single persuasive demo.

### Source 4: NIST AI RMF

Source role: governance context.

Facts:

- NIST AI RMF treats AI risk management as a lifecycle process, not a one-time statement of intent.
- The framework emphasizes mapping context, measuring risks, managing risks, and governing the system.

Implication for MC:

A disclaimer is not a complete control. MC needs specific measurable risks, test criteria, misuse cases, and a governance loop for body-map outputs.

## Fact vs inference

Facts:

- WCAG accessibility is defined through testable criteria.
- WCAG warns that conformance does not cover every user need.
- WCAG specifically prohibits relying only on sensory characteristics for instructions.
- Health-related software claims become higher risk when outputs influence diagnosis, treatment, or user reliance.
- AI health tools require staged evaluation for safety, efficacy, acceptability, and real-world monitoring.

Inferences:

- MC body maps are likely higher risk than ordinary journaling if they interpret sensations as nervous-system states, trauma states, illness signals, or treatment recommendations.
- MC can keep the feature safer by treating body marks as user-authored data, not system-authored interpretation.
- The safest near-term claim is reflective interface, not body-based insight engine.

## Evaluation criterion: MC-BODYMAP-SAFETY-01

The body-map feature should not be described as safe, accessible, or nervous-system-informed until it passes all of the following:

1. No diagnostic or treatment inference is generated from body selections.
2. The interface distinguishes user-entered sensation, metaphor, AI-generated reflection, and evidence-backed information.
3. Every visual body-map interaction has a text equivalent.
4. Instructions do not rely only on shape, position, color, orientation, or visual location.
5. Full keyboard operation is possible.
6. Screen-reader flow identifies controls, regions, labels, state changes, and saved entries.
7. Color is not the only carrier of meaning.
8. Dragging has a non-drag alternative.
9. Small touch targets are avoided or have accessible alternatives.
10. The system includes escalation guidance for urgent symptoms without pretending to triage.
11. Users can delete, revise, export, or mark entries as metaphorical.
12. A safety review checks whether users misread symbolic reflection as medical guidance.

## Falsification checklist

The safer body-map claim fails if any of the following are true:

- Users believe MC diagnosed them.
- Users delay medical care because MC gave a calming symbolic interpretation.
- The body map requires sighted spatial interaction with no text alternative.
- A screen reader cannot identify body regions or entries.
- Color, shape, or body location is the only way meaning is communicated.
- The AI infers trauma, disease, dysautonomia, inflammation, structural imbalance, or treatment from body-map input.
- The feature produces certainty language such as “this means,” “your nervous system is,” or “this is caused by.”
- The feature cannot handle urgent symptom entries safely.
- The feature stores sensitive health-like data without a clear user-facing privacy model.

## Required UI language boundary

Allowed:

- “You marked pressure behind the right eye.”
- “You described this as heavy, hot, and hard to move.”
- “Here is a symbolic reflection based on your words.”
- “This is not a diagnosis or triage.”
- “For new, severe, or worsening symptoms, use appropriate medical care.”

Not allowed without clinical validation:

- “This shows nervous-system dysregulation.”
- “This pattern means trauma is stored here.”
- “This suggests inflammation, vascular dysfunction, or nerve compression.”
- “Do this intervention to correct it.”
- “This is safe because it is only symbolic.”

## Claim-status update

Previous implicit claim:

Body mapping is safe if framed as reflective and non-diagnostic.

Updated claim:

Body mapping is an unvalidated reflective interface that needs accessibility, safety, privacy, and trust-calibration testing before MC can claim it is safe or nervous-system-informed.

## Next proof needed

Run MC-BODYMAP-SAFETY-PILOT-01.

Minimum pilot:

- 10 body-map tasks using visual input.
- 10 equivalent tasks using text-only input.
- Keyboard-only test.
- Screen-reader test.
- Color-blindness and contrast check.
- Misinterpretation test: ask users to classify each output as fact, metaphor, reflection, health information, advice, or uncertainty.
- Safety test: include urgent symptom examples and confirm the system does not minimize them.
- Privacy comprehension test: ask users what kind of data they think is being stored.

Pass condition:

At least 90 percent of users correctly identify that outputs are reflective, not diagnostic; no critical accessibility blockers; no urgent-symptom minimization; and no output creates a medical or treatment inference.

## Current conclusion

MC can build the body map as a user-authored reflection layer. It cannot yet claim the body map is clinically safe, medically useful, accessibility-ready, or nervous-system-valid. The next proof is not more explanation; it is a direct safety and accessibility pilot.
