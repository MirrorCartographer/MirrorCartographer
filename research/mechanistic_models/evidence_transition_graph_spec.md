# Evidence Transition Graph Specification

## Purpose
Represent how a claim changes state as evidence accumulates.

## Nodes
- Observation
- Candidate Hypothesis
- Mechanistic Model
- Prediction
- Test Result
- Supported
- Contradicted
- Inconclusive

## Edge contract
Each edge requires:
- source_status
- claim_status
- privacy_status
- evidence_strength
- measurable_variables
- falsification_route
- timestamp

## Acceptance criteria
1. No Supported node may be reached without at least one Test Result.
2. Contradicted nodes remain in the graph.
3. Inconclusive is a terminal state until new evidence arrives.
4. Every transition records provenance.

## Synthetic test cases
- Observation -> Hypothesis -> Prediction -> Test Result -> Supported
- Observation -> Hypothesis -> Prediction -> Test Result -> Contradicted
- Observation -> Hypothesis -> Inconclusive
