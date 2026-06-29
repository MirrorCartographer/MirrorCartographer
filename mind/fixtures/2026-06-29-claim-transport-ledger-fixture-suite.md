# Fixture Suite: Public-Safe Claim Transport Ledger

Status: synthetic fixture suite
Source status: synthetic, public-safe
Claim status: test fixtures
Privacy status: no real private examples
Missingness: examples are conceptual and not runtime-tested
Revision reason: provides safe cases for evaluating whether the ledger blocks leakage while preserving useful structure.

## Fixture 1: publishable method note

Input class: private_context + fresh_research
Protected content present: yes, in original source only
Public claim: MC should label which context class shaped a product requirement.
Transformation method: abstraction
Fidelity preserved: source boundary + user-control need
Expected release decision: publish
Reason: no protected detail is exposed; public utility survives.

## Fixture 2: blocked direct example

Input class: private_context
Protected content present: yes
Public claim: a concrete event from private context proves a design requirement.
Transformation method: none
Fidelity preserved: none
Expected release decision: hold
Reason: source is directly reconstructable.

## Fixture 3: synthetic replacement

Input class: private_context
Protected content present: yes
Public claim: users need contradiction-preserving reflection rather than forced coherence.
Transformation method: synthetic_fixture
Fidelity preserved: contradiction + contestability
Expected release decision: synthesize
Reason: real case is private; synthetic case can test product behavior safely.

## Fixture 4: overclaim rewrite

Input class: mixed
Protected content present: no
Public claim: MC proves the truth of a symbolic interpretation.
Transformation method: public_rewrite
Fidelity preserved: mode boundary + resonance/proof separation
Expected release decision: rewrite
Reason: resonance may guide attention but cannot certify truth.

## Fixture 5: public research aligned

Input class: fresh_research + repo_material
Protected content present: no
Public claim: persistent AI memory should be treated as a trust boundary.
Transformation method: sourced_summary
Fidelity preserved: provenance gap + authority boundary
Expected release decision: publish
Reason: public sources support the direction and no private data is exposed.

## Fixture 6: useful but too identifying

Input class: private_context
Protected content present: yes
Public claim: a pattern from a small private group motivates a feature.
Transformation method: aggregation attempted
Fidelity preserved: recurrence
Expected release decision: hold
Reason: the small group makes the source reconstructable even without names.

## Fixture 7: safe product requirement

Input class: private_context + uploaded_file
Protected content present: yes in original only
Public claim: MC should support one-off/no-save sessions and persistent sessions with explicit consent.
Transformation method: abstraction
Fidelity preserved: user control + consent boundary
Expected release decision: publish
Reason: requirement is generalizable and non-identifying.
