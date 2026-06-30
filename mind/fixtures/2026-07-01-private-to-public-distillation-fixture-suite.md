# Private-to-Public Distillation Gate Fixture Suite

Date: 2026-07-01

## Fixture A: safe method extraction

Input class: private architecture signal.

Unsafe output: a public example that describes the original source.

Safe output: a general rule for separating private context from public method.

Expected status:

- source status: private context class only
- claim status: inferred architecture need
- privacy status: public safe
- missingness: original source not public
- revision reason: source removed to preserve boundary

## Fixture B: claim downgrade

Input class: repeated pattern across contexts.

Unsafe output: the pattern proves a factual claim.

Safe output: the pattern suggests a design requirement for uncertainty labeling.

Expected status:

- source status: mixed public/private influence
- claim status: downgraded from proof to hypothesis
- privacy status: public safe
- missingness: recurrence does not establish causality
- revision reason: prevent pattern-to-proof collapse

## Fixture C: blocked publication

Input class: raw private example.

Unsafe output: any public artifact that includes the example.

Safe output: no publication of the example; create only a generic blocker note.

Expected status:

- source status: inadmissible
- claim status: blocked
- privacy status: not public safe
- missingness: source cannot be publicly inspected
- revision reason: direct source content rejected

## Fixture D: public repository support

Input class: public repo statement about source and claim boundaries.

Unsafe output: treat the repo statement as proof of implementation completeness.

Safe output: cite the public repo as evidence of stated design intent only.

Expected status:

- source status: public repo
- claim status: supports design intent, not completion
- privacy status: public safe
- missingness: implementation completeness still requires tests
- revision reason: prevent repo-language overclaiming

## Fixture E: external research support

Input class: current memory/RAG research.

Unsafe output: claim that external research proves MC works.

Safe output: use external research to justify the need for memory, provenance, retrieval, and privacy controls.

Expected status:

- source status: external public research
- claim status: supports risk model only
- privacy status: public safe
- missingness: MC-specific empirical validation remains missing
- revision reason: prevent support-transfer overclaim
