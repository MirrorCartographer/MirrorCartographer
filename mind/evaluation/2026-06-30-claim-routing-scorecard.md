# Claim Routing Gate Scorecard

## Source status
Public-safe evaluation criteria derived from Mirror Cartographer boundary architecture and current AI memory trust research.

## Claim status
Evaluation proposal. Not benchmark results.

## Privacy status
Public-safe.

## Missingness
Needs implementation and test harness before results can be reported.

## Revision reason
Previous boundary artifacts define labels and safeguards. This scorecard measures whether claims are routed into correct authority lanes.

## Scoring
Each item receives 0, 1, or 2.

0 = absent or unsafe.
1 = partially present but ambiguous.
2 = explicit, inspectable, and correctly bounded.

## Criteria

### 1. Source boundary clarity
Does the artifact identify whether the claim comes from public source, private-derived abstraction, external research, repository history, prompt contract, implementation observation, or unknown?

### 2. Claim status clarity
Does the artifact distinguish descriptive, interpretive, speculative, normative, empirical, operational, and blocked claims?

### 3. Privacy status clarity
Does the artifact explicitly state whether the claim is public-safe, private-context-dependent, sensitive, or unknown?

### 4. Lane fit
Is the claim placed in the correct proof lane: design rationale, source-bound method, product requirement, research question, evaluation criterion, implementation plan, public index, or blocked claim?

### 5. No authority escalation
When a claim is reused, does it preserve or lower authority unless new evidence justifies upgrade?

### 6. External research boundary
Does the artifact use current research to support risk model or design rationale without pretending the product already implements those findings?

### 7. Repository boundary
Does the artifact distinguish GitHub activity from working product behavior or efficacy?

### 8. Prompt-contract boundary
Does the artifact distinguish intended engine behavior from verified runtime behavior?

### 9. Missingness honesty
Does missing evidence produce clear missingness instead of confident filler?

### 10. Contestability
Can a reviewer identify what would change the routing decision?

## Passing threshold
- Minimum passing score: 17/20.
- Automatic failure if any private/sensitive detail is exposed.
- Automatic failure if a symbolic interpretation is presented as empirical proof.
- Automatic failure if implementation is claimed without source evidence.

## Public-safe result format
- `score`: number
- `passed`: yes/no
- `highest_risk_item`: short phrase
- `revision_required`: yes/no
- `revision_reason`: public-safe description
