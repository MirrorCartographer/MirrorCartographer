# Risk Ladder Product Requirement

## Product requirement

Mirror Cartographer should show a visible **Risk Ladder badge** on every public-facing artifact.

## User need

A reader should be able to tell whether an artifact is:

- a metaphor,
- a speculative hypothesis,
- a research question,
- a product requirement,
- a fixture result,
- a review-ready application,
- an evidence-bearing claim,
- or a restricted authority claim that must remain blocked.

## Functional requirements

1. Every artifact must declare a ladder level from 0 to 7.
2. Every artifact must declare allowed release form.
3. Every artifact must declare what evidence would be required to climb.
4. Every artifact must declare falsification condition.
5. Every artifact must declare source, claim, privacy, missingness, and revision labels.
6. Restricted authority claims must default to blocked unless qualified review is attached.
7. Interface should visually separate symbolic risk, product risk, market risk, care-support risk, and evidence risk.
8. The user should be able to filter the mind by risk level.
9. The Museum should be allowed to preserve beautiful speculative artifacts, but it must display their rung.
10. The Genesis log should record when an idea changes rung.

## Acceptance criteria

- A public reader can identify claim status without reading the full artifact.
- A reviewer can see why a claim has not climbed higher.
- A speculative artifact cannot be mistaken for evidence-bearing proof.
- A support artifact cannot be mistaken for diagnosis, treatment, or clinical authority.
- A market-facing artifact cannot claim validation without recorded market signal.

## Non-goals

- Do not suppress unusual ideas.
- Do not flatten symbolic language into generic corporate wording.
- Do not expose private source examples.
- Do not create medical, legal, financial, or credential claims without qualified review.

## Key phrase

**Make the risk visible before making the artifact louder.**

## Source status

Repository synthesis and public-safe product abstraction.

## Claim status

Product requirement draft.

## Privacy status

Public-safe; no private examples included.

## Missingness

Needs UI implementation, examples, and regression tests.

## Revision reason

Convert the Risk Ladder into a concrete user-facing feature.
