# Product Requirement: Fixture Oracle Layer

## Source status
Public-safe product requirement derived from the current Mirror Cartographer evaluation architecture.

## Claim status
Product requirement. Not yet implemented.

## Privacy status
Public-safe. No private examples included.

## Missingness
Requires implementation, test data, reviewer workflow, and regression reporting.

## Revision reason
The fixture runner needs expected-output oracles so tests can fail for the right reasons.

## Requirement
Mirror Cartographer should support synthetic fixture oracles that define the expected boundary behavior before a fixture is run.

## User story
As a reviewer, I want every synthetic fixture to have an expected-output oracle so I can see whether the system preserved source status, claim status, privacy status, evidence lane, review need, router state, and release decision.

## Functional requirements
1. Create a fixture oracle record for each synthetic fixture.
2. Run the fixture through the current public-safe compiler / router pipeline.
3. Compare actual output against expected oracle fields.
4. Produce a pass, fail, partial, or not-run result.
5. Record mismatch notes.
6. Route failed outputs to revise, narrow, abstract, review, hold, or discard.
7. Preserve regression history across runs.
8. Never require private-origin examples to test public safety.

## Non-functional requirements
- Public-safe by default.
- Human-readable before machine-optimized.
- Versioned.
- Reviewable by non-engineers.
- Compatible with future automation.
- Resistant to polished overclaiming.

## Acceptance criteria
- A reviewer can read the oracle before the run.
- A reviewer can read the actual output after the run.
- The system identifies mismatches.
- The system provides a next action.
- The release state is justified.
- No private-origin content is needed for the test.

## Out of scope
- Diagnosis.
- Therapy replacement.
- Legal compliance certification.
- Automated public release without human review.

## Key phrase
Expected behavior must be visible before beauty is allowed to persuade.
