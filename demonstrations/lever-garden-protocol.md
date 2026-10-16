# The Lever Beneath the Leaves — Research Protocol

Status: proposed creative proof; not yet merged or deployed.

Companion interaction: [Lever Beneath the Leaves](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/creative/lever-garden-proof/public/lever-garden.html).
Reproducible browser test: [lever-garden.spec.js](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/creative/lever-garden-proof/tests/lever-garden.spec.js).
Review standard: [Adversarial Review Protocol](https://github.com/MirrorCartographer/MirrorCartographer/blob/main/architecture/ADVERSARIAL_REVIEW_PROTOCOL.md).

## Research question

Can an interactive toy make the difference between noticing a pattern and isolating a variable perceptible without presenting a toy result as a universal causal claim?

## Cross-repository duplicate review

The research catalog already contains related concepts: Claim Boundary Renderer (#043), Contradiction as Asset (#044), Experiment Ladder (#046), and Cause-to-Effect Chain (#070). The UI repository also contains Three Lenses and Glasshouse Gate.

This specimen is narrower than those concepts. It is not a set of competing interpretations of a fixed observation, not a private-to-public transformation gate, and not a general claim-labeling interface. It is a small deterministic intervention game: change a setting, run a trial, and compare the new result with the immediately preceding trial.

## Toy model

The seed opens if and only if light >= 1 and water >= 1. Wind has no effect. The rule is encoded directly in the page and can be revealed by the visitor. Each trial records three synthetic settings and one binary outcome.

The comparison routine examines adjacent trials:
- zero changed variables: repeat, no new contrast;
- one changed variable: report the paired outcome difference and qualify the inference;
- more than one changed variable: refuse to attribute the difference to a single setting.

This deterministic rule makes the interaction checkable. It does not reproduce the complexity, noise, confounding, or measurement error of real-world systems.

## User path

1. Run a starting trial.
2. Change one setting while holding the others constant.
3. Run another trial.
4. Read the comparison in plain language.
5. Optionally reveal the toy rule.
6. Reset the garden at any time.

The visitor is not required to reach a solution or accept a conclusion.

## Invariants

- All content and trials are fictional and synthetic.
- No personal text entry, uploads, network calls, analytics, cookies, local storage, or session storage.
- Trial history exists only in the current page's memory and resets on reload or explicit reset.
- Keyboard-accessible native range controls and buttons are used.
- Result and comparison messages are exposed as live regions.
- Reduced-motion preferences disable transitions.
- The page explicitly states that a toy-model result does not establish a universal cause or explain human behavior.
- An unchanged result is not described as proof that a variable never matters.

## Reproducible browser test

From the UI repository root:

`npx playwright test tests/lever-garden.spec.js --reporter=line`

The committed test covers the initial state; one-variable water and wind contrasts; bounded comparison language; rule reveal; reset; narrow viewport overflow; reduced-motion preference; and the settings group. Network and storage isolation are design constraints visible in the page source, not assertions in this browser test; add a separate automated gate if that property becomes a release requirement.

The test has not been run in this authoring session. It must not be described as passing until the actual command or CI run confirms that.

## Adversarial cases

- Change multiple settings before a trial: the UI must say the pair cannot isolate one lever.
- Repeat identical settings: the UI must not call the repeat new evidence.
- Change wind while light or water is below threshold: unchanged output must not become a universal claim that wind is irrelevant in every system.
- Reload or reset: no prior trial should survive.
- Disable motion and use keyboard navigation: essential state and controls remain perceivable.
- Inspect network and storage: no personal or trial data should leave or persist.

## What remains unproven

- That visitors learn or retain the distinction between correlation, controlled contrast, and causal inference.
- That the interaction generalizes beyond this tiny deterministic model.
- That all browser and screen-reader combinations provide an equivalent experience.
- That the page has been deployed to a public preview.
- That the framing is empirically better than alternative teaching designs.

Before merge: run the browser test, inspect its actual result, perform keyboard and screen-reader review, and record defects under the adversarial review protocol.