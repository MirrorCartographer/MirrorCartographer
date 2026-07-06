# Retrieval Boundary Checker

## Component purpose

The Retrieval Boundary Checker is an executable Mirror Cartographer gate for evidence-boundary routing. It prevents retrieved material from crossing into the wrong memory partition before it can seed hypotheses, evidence packets, collaborator packets, or longitudinal research memory.

This supports cure/discovery infrastructure by preserving a clean distinction between public evidence, deidentified/private longitudinal signals, source status, claim status, and advice-like content. The component is not medical or veterinary advice; it is research-organization infrastructure.

## Executable interface

```bash
python tools/retrieval_boundary_checker/check_retrieval_boundaries.py \
  tools/retrieval_boundary_checker/fixtures.synthetic.json
```

Machine-readable output:

```bash
python tools/retrieval_boundary_checker/check_retrieval_boundaries.py \
  tools/retrieval_boundary_checker/fixtures.synthetic.json \
  --json
```

Regression test:

```bash
python tools/retrieval_boundary_checker/test_check_retrieval_boundaries.py
```

## Packet shape

Each packet contains:

- `id`: stable packet identifier
- `source_status`: source category, such as `primary_public`, `preprint_public`, `private_abstracted`, or `mixed_public_private`
- `claim_status`: intended claim stage, such as `research_question`, `hypothesis_candidate`, or `falsification_task`
- `privacy_status`: public/deidentified/private state
- `route_intent`: pipeline target
- `retrieval_inputs`: list of retrieved inputs with boundary and safety metadata
- `output_packet`: proposed destination boundary, memory scope, and action
- `expected_decision`: synthetic fixture oracle for tests

## Acceptance criteria

A packet passes only when:

1. source, claim, privacy, and route labels are known;
2. retrieval inputs are present and carry boundary metadata;
3. private or mixed public/private sources do not route into public discovery memory;
4. advice-like medical/veterinary content is rejected from discovery memory;
5. private research memory admissions use `admit_with_privacy_partition`;
6. public discovery memory admissions contain no private details.

## Labels

- Source status: assistant-generated public-safe synthetic implementation.
- Claim status: executable evidence-boundary routing gate, not a biomedical claim.
- Privacy status: synthetic/public-safe only.
- Missingness: not yet wired into CI, retrieval adapters, or memory admission flow.
- Revision reason: previous gates validated packets after formation; this component checks boundary routing before retrieved material can contaminate discovery memory.
- Implementation status: fixtures, CLI checker, tests, and README committed.
- Testability: run the test script or CLI against fixture packets.
- Next executable action: connect this checker before provenance packet construction and before public/private memory writes.
