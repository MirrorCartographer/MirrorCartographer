# Three Lenses — Research Protocol

**Status:** Proposed; not validated with participants.  
**Companion proof:** https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/creative/three-lenses-proof/public/three-lenses.html  
**Review standard:** [Adversarial Review Protocol](../architecture/ADVERSARIAL_REVIEW_PROTOCOL.md)  
**Claim-state guard:** [Claim Status Transition Guard](../tools/claim_status_transition_guard/README.md)

## Scope and novelty

Project 101 already asks whether information can be separated from understanding (#003) and whether contradiction can be navigated (#005). This is a narrow executable specimen of those ideas, not a new catalog category.

## Research question

Can a visitor distinguish a fixed observation from several possible explanations when the interface keeps the observation unchanged while the visitor changes lenses?

## Scenario

**Observation:** “A task planned for 30 minutes took 55 minutes.”

- **Hypothesis A:** “I underestimated the task.”
- **Hypothesis B:** “Context changed the timeline.”
- **Unknown:** “The reason is not known yet.”
- **Optional next steps:** inspect task steps, check context, or leave the question unresolved.

The observation must remain unchanged. Neither hypothesis is marked correct. Selecting a next step is a choice, not a prediction. The scenario does not establish why the task took longer.

## Evidence classes

- **Observation:** stated scenario fact.
- **Hypothesis:** possible explanation, not verified by the scenario.
- **Unknown:** available information does not resolve the question.
- **Choice:** visitor-selected next step, not a claim about what will happen.
- **Visual metaphor:** presentation only; never evidence.

## Privacy and agency invariants

- No personal text entry, transmission, analytics, or saved state.
- No hypothesis is endorsed by default.
- Native keyboard-operable radio controls, visible focus, and semantic selection state.
- Reduced-motion preferences respected.
- “Leave unresolved” remains a valid option.
- Reset is available and has no penalty.

## Deterministic verification

The UI repository should test the built static page for:
1. meaningful title and accessible control names;
2. invariant observation text after each lens selection;
3. native selected state exposed to assistive technology;
4. next-step selection that does not modify the observation;
5. reset and reload behavior;
6. no third-party requests or persistent state;
7. keyboard operation at a phone viewport;
8. reduced-motion support and no console errors.

Passing automation proves implementation properties only, not visitor comprehension.

## Formative review

After deterministic checks pass, conduct a small, consented review of the fictional scenario. Ask without coaching: What is directly known? Which statements are possibilities? Does choosing a lens change the event? What can be chosen without knowing the reason? Does the interface appear to endorse one explanation?

Record anonymized task outcomes, not private narratives. Treat results as exploratory usability feedback, not a generalizable study.

## Adversarial cases

- A hypothesis is mistaken for fact: its label remains visible.
- “Unknown” is selected: it remains a valid state.
- Color perception differs: text and native radio state preserve meaning.
- Keyboard-only use: all options remain operable.
- Motion is reduced: nonessential motion is removed.
- The page reloads: selections start clean.

## What remains unproven

This specimen does not prove that visitors reason better about ambiguity, that either explanation is true, or that the mechanism generalizes. It does not establish psychological benefit or show that visual symbols reveal hidden facts. The next evidence step is an accessibility review and a consented formative comprehension test. Keep the PR in draft until browser tests actually run and their results are observed.
