# 100-iteration improvement log — Observatory

**Target:** 100 distinct inspect → change/test → verify → record cycles.  
**Completed:** 2/100 (guardrail regression test corrected; aggregate continuity parser repaired to ingest claims collections and corpus semantics corrected).  
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


## Iteration 002 — Repair aggregate continuity ingestion

- **Observation:** Hosted continuity CI exposed a corpus validator that assumed each JSON file contained one record or a `record` wrapper. A valid historical slice stores three records under `claims`, so the validator produced missing-field errors and the corpus test dereferenced an undefined record.
- **Change:** The validator and corpus test loader now normalize single records, `record` wrappers, `records` arrays, and `claims` arrays. The historical CM-0011 entry now classifies its own supported assertion as observed and records the superseded queue artifact separately instead of misusing a machine relation that must point to a CM record.
- **Verification:** The pre-fix hosted run reported 166/169 tests passing; a new hosted run must confirm the complete continuity suite.
- **Risk:** The normalization covers the four declared container shapes; unknown JSON container shapes now fail explicitly instead of being silently treated as empty.


## Iteration 003 — Separate canonical continuity records from legacy evidence packets

- **Observation:** Hosted CI showed that the records directory contains two formats: canonical CM records and older continuity-mining packets using `record_id`/`claim_states`. Treating every JSON file as a canonical record generated false missing-field failures. One canonical record also encoded a relation as `CM-0015:proposed`, mixing a state annotation into an identifier.
- **Change:** The aggregate validator now validates canonical records and supported record collections, explicitly counts/skips legacy evidence packets, and reports the skip count. The corpus test uses the same canonical-record filter. CM-0016 now links to canonical ID `CM-0015` and preserves the prior state annotation in `supersedes_state`.
- **Verification:** Prior hosted run exposed these exact incompatibilities. A fresh hosted run is required to prove the entire corpus and continuity suite pass.
- **Risk:** Legacy packets remain preserved but are not schema-validated by the canonical CM validator; they require their own schema-specific validation.


## Iteration 004 — Resolve duplicate aggregate records and taxonomy drift

- **Observation:** The next hosted run showed that aggregate `claims` files duplicate individual `CM-####.json` files. It also revealed legitimate canonical kinds and evidence-strength labels missing from the validator's closed enums.
- **Change:** Aggregate files are now skipped only when every contained CM record has an individual canonical file. The validator's accepted kind/evidence taxonomies now include the additional values observed in the committed corpus. The corpus test applies the same aggregate precedence rule.
- **Verification:** The hosted run identified duplicate IDs and exact enum values. Another hosted run is required; additional schema and relation inconsistencies may remain.
- **Risk:** Aggregate files with any record lacking an individual counterpart remain included. Legacy evidence packets are counted but not validated by the canonical schema.
