# Foundation Sovereignty Ledger

This directory publishes a public-safe, executable proof surface for Foundation Intelligence.

It does not publish private transcripts, credentials, personal facts, internal interpretations, production topology, or recovery secrets. It publishes the stronger thing outsiders can actually evaluate: falsifiable claims, explicit ownership boundaries, dependency declarations, adversarial failures, exit paths, and machine-verifiable continuity receipts.

## What is unusual here

Most architecture repositories publish diagrams and intentions. This ledger publishes claims that fail closed.

Each capability receipt states:

- what Foundation controls
- what remains physically or institutionally external
- which commodity dependencies remain
- how each dependency exits
- which adversarial drills passed
- which risks remain unresolved
- which prior receipt this one extends
- which public-safe community views were added

A receipt is accepted only when its canonical digest matches and every claimed capability includes an ownership boundary, dependency list, exit path, falsification evidence, and next test.

## Run

```bash
python tools/foundation_sovereignty/validate_ledger.py \
  tools/foundation_sovereignty/examples/0001-synthetic-platform-receipt.json
```

Expected output:

```text
ACCEPT
capability=whole-platform-recovery
continuity=verified
```

## Public value

This creates a reusable protocol for projects that need to prove they own the software control plane without pretending to own hardware, public networks, registries, or internet institutions. The protocol remains implementation-neutral and can evaluate self-hosted, rented, hybrid, or migrated infrastructure.
