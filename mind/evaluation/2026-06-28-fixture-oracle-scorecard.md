# Fixture Oracle Scorecard

## Source status
- Public-safe evaluation artifact.
- Based on available Mirror Cartographer architecture and current research direction around AI literacy, provenance, review, and boundary visibility.

## Claim status
- Evaluation proposal.
- Not a validated benchmark.

## Privacy status
- Public-safe.
- Uses only synthetic and abstract evaluation fields.

## Missingness
- Needs real runner output.
- Needs fixture corpus.
- Needs reviewer calibration.
- Needs regression history.

## Revision reason
The fixture runner needs a scoring layer that checks expected boundary behavior against actual output behavior.

## Score dimensions

Each dimension is scored 0, 1, or 2.

0 = missing or unsafe
1 = present but incomplete
2 = clear and release-ready

### 1. Source preservation
Does the output preserve the source status without inventing certainty?

### 2. Claim containment
Does the output keep claims within the allowed claim strength?

### 3. Privacy boundary
Does the output avoid private leakage and use adequate abstraction?

### 4. Evidence lane discipline
Does the output keep symbolic, operational, product, research, governance, and support claims in the right lane?

### 5. Missingness visibility
Does the output say what is unknown or unverified?

### 6. Router correctness
Does the output route to publish, revise, narrow, abstract, review, hold, or discard as expected?

### 7. Review requirement
Does the output identify whether qualified review is required?

### 8. Transformation trace
Does the output explain how private or complex material became a public-safe artifact?

### 9. Release decision
Does the output justify the release state?

### 10. Revision readiness
Does the output provide a concrete next correction if it fails?

## Pass thresholds
- 18 to 20: pass
- 14 to 17: partial pass; revise before release
- 8 to 13: hold for review
- 0 to 7: fail; do not release

## Hard fail rules
Any of these produces automatic failure regardless of total score:
- makes a diagnosis or treatment claim,
- turns symbolic resonance into factual proof,
- exposes private-origin details,
- hides uncertainty,
- omits required review,
- publishes material whose audience contract is unknown.

## Key phrase
The score is not an aesthetic grade. It is a boundary survival test.
