# Three Lenses — Research Protocol

**Status:** Proposed; not validated with participants.  
**Companion proof:** https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/creative/three-lenses-proof/public/three-lenses.html  
**Governing review:** [Adversarial Review Protocol](../architecture/ADVERSARIAL_REVIEW_PROTOCOL.md)  
**Related gate:** [Claim Status Transition Guard](../tools/claim_status_transition_guard/README.md)

## Why this is not a duplicate

The Project 101 catalog already asks whether information can be separated from understanding (#003) and whether contradiction can be navigated (#005). This is a narrow executable specimen of those ideas, not a new catalog category.

## Research question

Can a visitor tell the difference between a fixed observation and several possible interpretations when the interface keeps the observation unchanged while the visitor changes lenses?

## Scenario and mechanism

The fictional scenario is: “A message sent at 09:00 has no reply by 11:00.”

- **Observation:** the sentence above; it must remain unchanged throughout the interaction.
- **Hypothesis A:** “They are avoiding me.”
- **Hypothesis B:** “They have not seen it yet.”
- **Unknown:** “The reason is not known yet.”
- **Optional next steps:** wait for another data point, ask a neutral question, or leave the matter unresolved for now.

The page must not mark either hypothesis as correct. A chosen next step is a choice, not a prediction of outcome. The example does not establish anyone's actual intent.

## Evidence classes

- **Observation:** explicitly stated scenario fact.
- **Hypothesis:** possible explanation, not verified by the scenario.
- **Unknown:** the available information does not resolve the question.
- **Choice:** visitor-selected action, not a claim about what will happen.
- **Visual metaphor:** presentation only; never evidence.

## Privacy and agency invariants

- No personal text entry is required.
- No visitor input is transmitted or persisted.
- No hypothesis is endorsed by default.
- Native keyboard-operable controls and visible focus states are required.
- Selection state is conveyed with semantic labels, not color alone.
- Meaningful changes are announced to assistive technology.
- Reduced-motion preferences are respected.
- “Leave unresolved” is a valid outcome.
- Reset is available and has no penalty.

## Deterministic verification

The companion UI repository should test the built static page for:
1. meaningful page title and accessible control names;
2. invariant observation text after each lens selection;
3. programmatically exposed selected state;
4. action selection that does not modify the observation;
5. reset and reload behavior;
6. absence of third-party requests;
7. keyboard use at a phone viewport;
8. reduced-motion styling and no console errors.

Passing automation proves implementation properties only; it does not prove visitor comprehension.

## Formative review

After deterministic checks pass, invite a small, consented review of the fictional scenario. Ask participants, without coaching:
- What is directly known?
- Which statements are possibilities?
- Does selecting a lens change the event?
- What can be chosen without knowing the reason?
- Does the interface appear to endorse one explanation?

Record anonymized task outcomes, not private narratives. Treat the result as exploratory usability feedback, not a generalizable study.

## Adversarial cases

| Case | Required behavior |
|---|---|
| A hypothesis is mistaken for fact | Its status remains visibly “hypothesis” |
| “Unknown” is selected | It remains a valid state |
| Color perception differs | Text and semantic state preserve meaning |
| Keyboard-only use | Every control remains operable |
| Motion is reduced | Nonessential motion is removed |
| Page reloads | Interaction state starts clean |
| JavaScript is unavailable | Scenario text and evidence labels remain readable |

## Publication gates

Use the governing adversarial protocol's design, implementation, publication, consequence, and verification gates. Keep the PR in draft until the browser test has actually run and the result is observed.

## What remains unproven

This specimen does not prove that visitors reason better about ambiguity, that a selected explanation is true, that the mechanism generalizes beyond this scenario, or that visual symbols reveal hidden facts. The next evidence step is an accessibility review and a consented formative comprehension test.
