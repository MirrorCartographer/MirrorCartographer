# 100-iteration improvement log — Observatory

**Target:** 100 distinct inspect → change/test → verify → record cycles.  
**Completed:** 1/100 (cross-repository guardrail regression tests added; execution pending).  
**Branch:** `work/100-iterations-2026-11-03`

## Iteration 001 — Protect canonical deployment and privacy invariants

- **Observation:** The project has two explicitly protected live experiences and strict rules against claiming a deployment works without browser evidence. These invariants were documented, but the continuity test suite did not enforce them.
- **Change:** Added `tools/continuity/cross-repo-guardrails.test.mjs`. The existing `test:continuity` script already includes this test glob.
- **Expected proof:** Node tests confirm both canonical URLs remain in the README and coordination guide, deployment claims require browser verification, and daemon boundaries remain read-only/private.
- **Verification status:** CODE-ONLY. Hosted execution has not yet been observed.
- **Risk:** Textual contract tests protect policy wording; they do not verify live URL health or deployment identity.

## Remaining iteration areas (002–100)

- 002–010: Claim/evidence/provenance schema integrity and missing-source detection.
- 011–020: Hypothesis falsifiers, rival explanations, uncertainty and negative evidence.
- 021–030: Research citation integrity and source freshness.
- 031–040: Cross-domain relationship engine calibration and false-bridge tests.
- 041–050: Demonstration reproducibility and synthetic-data labeling.
- 051–060: Case-study provenance, missingness, and decision reconstruction.
- 061–070: Architecture/ontology consistency and stable identifiers.
- 071–080: Daemon coverage, report accuracy, and false-positive reduction.
- 081–090: Research-to-interface handoff and cross-repository link contracts.
- 091–100: Release verification, archive integrity, backup/restore, and external reproducibility.

**Counting rule:** A pass counts only when it has a distinct target, evidence, a concrete change or test, and a recorded outcome. A source link is not deployment proof.
