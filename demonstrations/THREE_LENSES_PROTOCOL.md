# Three Lenses — Research Protocol

**Status:** Proposed; no participant results yet.  
**Companion proof:** https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/creative/three-lenses-proof-review/public/three-lenses.html  
**Review standard:** [Adversarial Review Protocol](../architecture/ADVERSARIAL_REVIEW_PROTOCOL.md)  
**Claim-state guard:** [Claim Status Transition Guard](../tools/claim_status_transition_guard/README.md)

## Scope

Project 101 already asks whether information can be separated from understanding (#003) and whether contradiction can be navigated (#005). This is a small executable specimen of those ideas, not a new catalog category.

## Research question

Can a visitor distinguish a fixed observation from possible explanations when the interface keeps the observation unchanged while the visitor changes lenses?

## Scenario

**Observation:** “A task planned for 30 minutes took 55 minutes.”

- **Hypothesis A:** “I underestimated the task.”
- **Hypothesis B:** “Context changed the timeline.”
- **Unknown:** “The reason is not known yet.”
- **Optional next steps:** inspect task steps, check context, or leave the question unresolved.

The observation must remain unchanged. Neither hypothesis is marked correct. A next step is a choice, not a prediction. The scenario does not establish why the task took longer.

## Evidence classes

- **Observation:** stated scenario fact.
- **Hypothesis:** possible explanation, not verified.
- **Unknown:** the available information does not resolve the question.
- **Choice:** visitor-selected next step, not an outcome claim.
- **Visual metaphor:** presentation only; never evidence.

## Privacy and agency invariants

- No personal text entry, transmission, analytics, or saved state.
- No hypothesis is endorsed by default.
- Native radio controls, keyboard operation, visible focus, and semantic selection state.
- Reduced-motion preferences are respected.
- “Leave unresolved” remains a valid option; reset has no penalty.

## Deterministic checks

Run from the UI repository:

`npx playwright test tests/three-lenses.spec.js --reporter=line`

The test checks the fixed observation, lens/action selection, reset, no persistent state, no third-party requests, keyboard selection, phone viewport overflow, and reduced-motion preference. Passing automation establishes implementation properties only, not visitor comprehension.

## Formative review

After deterministic checks pass, conduct a small, consented review of the fictional scenario. Ask without coaching: What is directly known? Which statements are possibilities? Does choosing a lens change the event? What can be chosen without knowing the reason? Does the interface appear to endorse one explanation?

Record anonymized task outcomes, not private narratives. Treat results as exploratory usability feedback, not a generalizable study.

## What remains unproven

The specimen does not prove that visitors reason better about ambiguity, that either explanation is true, or that the mechanism generalizes. It does not establish psychological benefit or show that symbols reveal hidden facts. The next evidence step is an accessibility review and a consented formative comprehension test. Keep the PR in draft until browser tests actually run and results are observed.
