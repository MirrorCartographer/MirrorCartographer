# Evidence Map: Visual Polish Is Not Proof of Trust, Adoption, or Safety

Date: 2026-07-04
Status: Claim narrowed / evaluation criterion added
Area: Mirror Cartographer / AI opportunity work / GitHub mind

## Claim tested

Mirror Cartographer and AI opportunity artifacts sometimes imply that visual polish, symbolic beauty, designed typography, or emotionally compelling presentation can make the system credible, trusted, or commercially persuasive.

## Updated claim status

**Previous weak claim:**
A visually compelling MC artifact can prove seriousness, credibility, or adoption potential.

**Updated claim:**
Visual and symbolic design can improve perceived credibility, initial attention, emotional engagement, and tolerance of minor usability friction, but it does **not** prove factual accuracy, user comprehension, safety, business value, or durable adoption. Strong visual design must be evaluated separately from task success, evidence quality, accessibility, user autonomy, and over-trust risk.

## Evidence found

### Fact: credibility can be affected by visual design

Stanford's Web Credibility Guidelines report that the guidelines were based on three years of research with more than 4,500 people. The Stanford page advises making claims easy to verify with citations and source material. It also says people quickly evaluate sites by visual design alone and recommends professional or purpose-appropriate layout, typography, images, and consistency.

Source: Stanford Guidelines for Web Credibility, B.J. Fogg, Stanford Persuasive Technology Lab, updated June 2002.

### Fact: visual appeal can create perceived-usability bias

Nielsen Norman Group describes the aesthetic-usability effect: users tend to perceive attractive products as more usable, and positive visual response can make users more tolerant of minor problems. NN/g also warns that the effect can mask usability problems during user research; teams must observe what users do, not only what they say.

Source: Nielsen Norman Group, "The Aesthetic-Usability Effect," Kate Moran, February 3, 2024.

### Fact: severe usability problems are not solved by beauty

NN/g explicitly limits the aesthetic-usability effect: attractive design can make people forgive minor usability issues, but not major ones. Functionality sacrificed for aesthetics can cause users to lose patience.

Source: Nielsen Norman Group, "The Aesthetic-Usability Effect," 2024.

### Fact: accessibility must include visual interaction details

WCAG 2.2 includes specific success criteria for non-text contrast and focus appearance. This means visual design is not only an aesthetic layer; controls, focus indicators, meaningful graphics, and contrast must remain perceivable and operable.

Sources: W3C/WAI WCAG 2.2 Understanding Success Criterion 1.4.11 Non-text Contrast; WCAG 2.2 Understanding Success Criterion 2.4.13 Focus Appearance.

## Inference

MC should treat visual/symbolic polish as an engagement hypothesis, not proof of truth, safety, or market value.

A strong-looking artifact may produce:

- more initial attention,
- more perceived credibility,
- more emotional resonance,
- more tolerance of small friction,
- and stronger memorability.

But the same visual power may also produce:

- over-trust,
- false sense of rigor,
- missed usability defects,
- accessibility failures,
- emotional persuasion without evidence,
- or inflated commercial confidence.

Therefore, MC visuals should be tested against behavior and comprehension, not only preference or praise.

## Evaluation criterion added

### MC-VISUAL-TRUST-BOUNDARY-01

Any MC artifact that uses strong visual, symbolic, cinematic, or emotionally persuasive design must be evaluated on at least five separate dimensions:

1. **Attention:** Did the user notice and engage with the artifact?
2. **Comprehension:** Can the user accurately explain what the artifact claims and does not claim?
3. **Evidence discrimination:** Can the user distinguish fact, inference, metaphor, and speculation?
4. **Task success:** Can the user complete the intended task without relying on aesthetic impression alone?
5. **Over-trust risk:** Did the artifact make the user rate the system as more accurate, safe, or validated than the evidence supports?
6. **Accessibility:** Are contrast, focus state, reading order, labels, and non-text elements perceivable and operable?
7. **Adoption signal:** Did the user take a meaningful next action beyond saying it looks good?

A visually strong artifact may be classified as **compelling but unproven** until it passes comprehension, task, and over-trust checks.

## Falsification checklist

The stronger claim "visual polish improves MC usefulness" should be rejected or narrowed further if testing shows any of the following:

- Users praise the artifact but cannot explain its claim boundaries.
- Users mistake metaphor for evidence.
- Users rate the artifact as trustworthy without checking sources.
- Users fail the task but still rate the experience highly because it looks good.
- Visual design reduces readability, accessibility, or keyboard/screen-reader operability.
- Users remember the aesthetic but not the actionable output.
- Stakeholders show interest but do not take a next action, commit time, provide data, fund a pilot, or request a follow-up artifact.

## Test plan

### MC-VISUAL-CREDIBILITY-PILOT-01

Compare four versions of the same MC artifact:

1. plain text evidence map,
2. visually polished symbolic artifact,
3. visually polished artifact with explicit fact/inference/metaphor labels,
4. visually polished artifact with labels plus task checklist.

Measure:

- first-click or first-read engagement,
- claim-boundary comprehension,
- fact/inference/metaphor separation,
- task completion,
- confidence calibration,
- source-checking behavior,
- accessibility pass/fail,
- and meaningful next action.

## Next proof needed

Run `MC-VISUAL-CREDIBILITY-PILOT-01` with at least 8-12 users or stakeholder reviewers. The next proof is not whether people say the artifact is beautiful. The proof is whether visual/symbolic design improves engagement without increasing unsupported trust, misunderstanding, or accessibility failure.
