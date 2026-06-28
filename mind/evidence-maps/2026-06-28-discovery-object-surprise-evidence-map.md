# Evidence Map: Discovery Object / Surprise Capture

Date: 2026-06-28
Status: Evidence-supported design direction; MC-specific effect unproven
Privacy level: Public-safe; no private user facts required

## Claim tested

Mirror Cartographer should treat `Discovery` as a first-class artifact type, separate from notes, issues, or research summaries.

A Discovery is not merely a useful fact. It records a moment where an expectation, assumption, model, or design frame broke and forced the system to update.

## Why this claim matters

The current GitHub mind is strong at storing answers, evidence maps, requirements, and patterns. Its weak point is that surprise can disappear into polished summaries. If surprise is lost, the repository becomes an archive of conclusions instead of a record of how understanding changed.

## Evidence found

### Fact 1: Prediction error and surprise are strongly linked to learning signals

Reward prediction error is a well-established learning concept: learning updates when outcomes differ from expectations. A 2023 Frontiers in Neuroscience review summarizes reward prediction error mechanisms and their relationship to learning-related behaviors, including reversal learning and memory reconsolidation.

Source: Deng et al., "Reward prediction error in learning-related behaviors," Frontiers in Neuroscience, 2023.
URL: https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2023.1171612/full

### Fact 2: Insight research links AHA/surprise to prediction-error-like belief updating

A 2024 preregistered study in Psychonomic Bulletin & Review found that surprise during insight problem solving was significantly predicted by metacognitive prediction error, particularly for correctly solved problems. The authors caution that AHA is multifaceted and prediction error is not the only driver.

Source: Becker, "Surprise!—Clarifying the link between insight and prediction error," Psychonomic Bulletin & Review, 2024.
URL: https://link.springer.com/article/10.3758/s13423-024-02517-0

### Fact 3: Serendipity research treats unexpected information encounters as a research object, not just luck

A 2021 systematic review in Journal of Documentation reviewed 207 studies on serendipity in human information behavior and organized research topics including potential benefits, models, contextual factors, and methods.

Source: Liu et al., "Serendipity in human information behavior: a systematic review," Journal of Documentation, 2021.
URL: https://www.emerald.com/jd/article/78/2/435/194506/Serendipity-in-human-information-behavior-a

### Fact 4: Recent scientometric work argues that apparent serendipity often becomes more likely after new tools or methods create conditions for surprising observations

A 2026 Scientometrics article studying major scientific discoveries argues that tool and method development can make surprising discoveries more likely and more replicable. It warns against treating serendipity as purely passive luck.

Source: Krauss, "Predictable serendipity: how new tools turn serendipity into systematic breakthroughs," Scientometrics, 2026.
URL: https://link.springer.com/article/10.1007/s11192-025-05503-y

### Fact 5: Structured reviews/debriefs improve learning when they compare intention, result, cause, and next change

After-action review/debrief literature supports structured reflection around what was intended, what happened, why, and what should change. A 2013 meta-analysis found debriefs improve individual and team performance when done well.

Source: Tannenbaum & Cerasoli, "Do Team and Individual Debriefs Enhance Performance? A Meta-Analysis," Human Factors, 2013.
URL: https://journals.sagepub.com/doi/10.1177/0018720812448394

## Fact / inference split

### Facts

- Surprise and prediction error are established learning-related constructs.
- Insight research supports a relationship between surprise and metacognitive prediction error, but not a complete one-to-one equivalence.
- Serendipity can be studied as a pattern of information encounter and use, not only as anecdotal luck.
- New tools and methods can increase the chance of productive surprising observations.
- Structured reflection processes can improve team and individual learning.

### Inferences for MC

- MC should not only store polished conclusions; it should store the broken expectation that produced a change in understanding.
- A Discovery object can preserve the learning signal that normal summaries tend to erase.
- The most useful Discovery object will be lightweight, not bureaucratic: assumption broken, evidence, update, downstream change, next test.
- Discovery capture may improve the GitHub mind's evolutionary continuity, but that is not yet proven.

## Claim status

Partially supported.

The evidence supports the design logic that surprise, prediction error, serendipity, and structured reflection are useful learning mechanisms. It does not prove that MC's proposed Discovery object will improve architecture quality, creativity, or user understanding.

## Requirement added

### R-DISCOVERY-01: First-class Discovery artifact

The GitHub mind SHOULD include a first-class `Discovery` artifact type for moments where a prior expectation, claim, or model breaks.

Minimum fields:

- `trigger`: What observation, source, artifact, joke, error, or user phrase caused the discovery?
- `prior_assumption`: What did the system previously expect or believe?
- `break`: What exactly failed, contradicted, or became insufficient?
- `update`: What changed in the model afterward?
- `downstream_changes`: Which notes, requirements, patterns, issues, or questions should change because of this?
- `status`: hypothesis, supported direction, validated, falsified, retired
- `next_test`: What would prove the discovery is useful rather than merely interesting?

## Evaluation criterion

### DISCOVERY-01: Reconstruction of learning

Given a Discovery artifact, an independent reviewer should be able to reconstruct:

1. the original assumption,
2. what broke it,
3. what changed afterward,
4. which architecture elements were affected,
5. and what proof is still missing.

Success threshold: reviewer can accurately reconstruct these five elements without hidden conversation context.

## Minimal test plan

Create three versions of the same architecture update:

1. normal note,
2. evidence map only,
3. Discovery object plus evidence map.

After a delay, compare whether a reviewer can identify:

- why the update happened,
- what assumption changed,
- whether the change is evidence-backed or speculative,
- what next test follows.

## Falsification checklist

This pattern should be weakened or rejected if:

- Discovery objects become a second kind of bloated paperwork.
- They preserve novelty without improving future design decisions.
- Reviewers cannot distinguish genuine discoveries from ordinary observations.
- The Discovery object encourages forced drama: every note pretending to be a breakthrough.
- The extra structure reduces playground freedom or causes premature filtering.

## Public-safe implementation note

A Discovery object should abstract private material into architecture-safe language. It should not quote personal, medical, relational, or identifying content unless explicitly intended for private storage. Public artifacts should use generalized triggers such as `user phrase`, `research finding`, `prototype failure`, `contradictory evidence`, or `playground artifact`.

## Next proof needed

Build five Discovery objects from existing MC/GitHub changes and compare them against the original notes. Test whether they make the evolution of the GitHub mind more legible without making the repository feel like paperwork.
