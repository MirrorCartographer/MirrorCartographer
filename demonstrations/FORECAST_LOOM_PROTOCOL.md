# Forecast Loom: Confidence Is a Forecast, Not a Fact

Status: public-safe creative proof and research protocol. The interaction uses fictional token vessels and local browser simulation.

UI implementation: [Forecast Loom](https://github.com/MirrorCartographer/mirror-cartographer-ui/tree/creative/forecast-loom-proof/public/forecast-loom.html).

## Cross-repository review

The current demonstration catalog already covers uncertainty, claim boundaries, contradictory evidence, controlled comparisons, and symbolic meaning. The UI repository also contains interactive research specimens for changing interpretations, abstracting private source material, and comparing controlled conditions.

This proof takes a distinct angle: **a stated probability is a forecast that can be scored against an outcome, while calibration is a property assessed across many forecasts and observed frequencies.** It does not claim to replace or rename existing demonstrations.

## Research question

Can a small, inspectable interaction help a visitor distinguish:

1. the probability implied by a transparent set of equally likely tokens;
2. a participant's numeric forecast;
3. the single outcome that happened;
4. a proper scoring rule applied to that forecast and outcome; and
5. calibration, which cannot be established from one outcome or a five-draw run?

## Mechanism

Each vessel contains a visible count of target and non-target tokens. One token is drawn uniformly at random in the browser. The participant chooses a probability from 0% to 100% before the draw. The local tool computes the binary Brier score:

`score = (forecast_probability - outcome)^2`

Here, the outcome is 1 if the target appears and 0 otherwise. A score of 0 is best for that realized outcome; a score of 1 is the largest possible squared error. For a set of forecasts, the mean score is the arithmetic mean of individual scores.

The Brier score is a proper scoring rule for probabilistic forecasts, but it combines aspects of calibration and discrimination/resolution. It must not be presented as a pure calibration measurement.

## Evidence boundary

- Token counts and equal-likelihood rules are explicit properties of the toy vessel.
- The random draw is a simulated outcome, not evidence about the real world.
- One score is noisy; five trials are illustrative, not enough to diagnose a person's calibration.
- Calibration requires many forecasts and a comparison between stated probabilities and observed event frequencies in appropriate groups.
- No personality, intelligence, or psychological trait is inferred from a forecast or score.
- The interaction is educational; it is not a validated training intervention.

## Privacy and agency

- No user text is requested.
- Forecasts and results exist only in the current page's memory.
- No analytics, network requests, cookies, or local storage are intended.
- The participant controls the forecast and may restart the run at any time.
- Keyboard operation, visible focus, semantic controls, responsive layout, and reduced-motion support are required.
- A score must be explained in text; color or decorative imagery alone cannot convey the result.

## Reproducible checks

From the UI repository root:

`node --test tests/forecast-loom-core.test.mjs`

The tests cover boundary scores, average scoring, probability from counts, injectable deterministic draws, and invalid inputs. A dedicated GitHub Actions workflow should run these checks independently of unrelated repository-wide gates.

## Adversarial cases

1. A forecast of 100% followed by a non-event must score 1.
2. A forecast of 0% followed by a non-event must score 0.
3. A 50% forecast must score 0.25 for either binary outcome.
4. A favorable count of zero or equal to total must produce probabilities 0 or 1.
5. A five-round mean score must not be described as proof of stable calibration.
6. The interface must not store forecasts after reload or transmit them to an external service.
7. A user with reduced motion must retain the full interaction and meaning.

## Next proof gate

Run the targeted Node tests and browser review, inspect keyboard and screen-reader behavior, and verify the deployed artifact before making claims about accessibility or educational effectiveness. Human comprehension requires a separate, consented evaluation.

## What remains unproven

This proof does not show that users learn probabilistic reasoning, improve calibration, or transfer the concept to real decisions. It does not measure individual skill. It demonstrates only the mechanics of forecasts, simulated outcomes, and Brier scoring in a transparent toy environment.
