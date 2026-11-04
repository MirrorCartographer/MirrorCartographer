# 100-iteration improvement log — Observatory

**Target:** 100 distinct inspect → change/test → verify → record cycles.  
**Completed:** 13/100 (malformed index containers, incomplete record roots, and invalid JSON now fail with structured diagnostics; Continuity integrity run #161 passed).  
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


## Iteration 005 — Normalize historical machine relations

- **Observation:** Hosted corpus validation exposed three records whose relation arrays contained state-annotated identifiers or prose rather than canonical CM IDs.
- **Change:** CM-0018 and CM-0019 now point to canonical superseded IDs and preserve the former state annotations in separate metadata. CM-0020 moves its prose-only contradiction description into `related_artifacts` rather than a machine relation array.
- **Verification:** The prior hosted run identified the exact relation defects. A fresh hosted continuity run is still required.
- **Risk:** This normalizes three known cases; a broader corpus audit may reveal more legacy relation encodings.


## Iteration 006 — Distinguish migrated memory aliases from canonical records

- **Observation:** The validator passed all 169 unit tests but its CLI corpus scan still failed because a migrated memory packet reused CM-0013 while a different canonical record now owns CM-0013. The memory packet explicitly carries `legacy_id` and migration provenance, so it is not a second canonical record.
- **Change:** The validator now classifies packets with explicit `legacy_id` or `migration` metadata as migrated legacy aliases and records them in `skipped_legacy_files`. Added a regression test proving that this exception does not weaken duplicate detection for ordinary canonical records across storage roots.
- **Verification:** GitHub Actions Continuity integrity run #136 passed: 170/170 tests, aggregate validator `ok: true`, 29 canonical records checked, with migrated/legacy packets explicitly reported as skipped. The separate Mirror Cartographer CI typecheck/build run #4777 also passed.
- **Risk:** Legacy aliases are preserved and counted but not validated against the canonical CM schema; their provenance remains available for a separate migration audit.


## Iteration 007 — Enforce meaningful provenance locators and hashes

- **Observation:** The continuity validator checked only that `content_sha` existed. Null, numeric, or whitespace-only values could pass the source-shape check despite providing no usable content identity. Whitespace-only locators had the same issue.
- **Change:** Source locators and content hashes must now be non-empty strings after trimming. Added regression cases for empty, whitespace, null, numeric hashes, and whitespace-only locators.
- **Verification:** GitHub Actions Continuity integrity run #139 passed 172/172 tests; aggregate validator returned `ok: true` with 29 canonical records checked. Mirror Cartographer CI run #4780 also passed.
- **Risk:** A non-empty hash string is not proof that the hash matches the referenced bytes; content-hash verification remains a separate check.


## Iteration 008 — Validate explanatory and falsification fields as text

- **Observation:** Required record fields were checked for presence, but `title`, `summary`, and `falsification_or_review_route` could still contain empty strings, whitespace, or non-string values.
- **Change:** The validator now requires each field to be a non-empty string after trimming. Added regression tests for empty titles, numeric summaries, and whitespace-only review routes.
- **Verification:** GitHub Actions Continuity integrity run #142 passed 173/173 tests; aggregate validator returned `ok: true` with 29 canonical records checked. Mirror Cartographer CI run #4783 also passed.
- **Risk:** A non-empty review route is not proof that the route is actionable; independent source availability and falsifiability still require review.


## Iteration 009 — Fail closed on malformed record/source objects

- **Observation:** The validator assumed every collection entry and source was an object. A string record wrapper or null source could throw a runtime TypeError instead of returning a structured validation failure.
- **Change:** Added explicit object-shape guards for records and source entries. Malformed values now produce locator-specific validation errors without crashing the validator. Added regression tests for a string record wrapper and a null source.
- **Verification:** GitHub Actions Continuity integrity run #145 passed 174/174 tests; aggregate validator returned `ok: true` with 29 canonical records checked. The malformed-object fixture tests confirm structured rejection rather than a runtime exception.
- **Risk:** This guards basic object shape; nested source metadata still requires field-by-field validation and hash verification.


## Iteration 010 — Enforce canonical IDs in machine relation arrays

- **Observation:** Relation arrays were checked for array shape and target existence, but malformed targets such as prose, state-annotated IDs, objects, or null values were not rejected at the schema boundary.
- **Change:** Every `contradicts` and `supersedes` target must now match the canonical `CM-####` identifier form. Added regression cases for a legacy queue ID, state-annotated ID, object, and null.
- **Verification:** GitHub Actions Continuity integrity run #148 passed 175/175 tests; aggregate validator returned `ok: true` with 29 canonical records checked. Mirror Cartographer CI run #4789 passed.
- **Risk:** Canonical ID shape does not prove that the target exists; the existing cross-record reference and cycle checks remain necessary.



## Iteration 011 — Fail closed on malformed continuity index containers

- **Observation:** The validator assumed the parsed index was an object with an array-valued `records` property. A null index or object-valued `records` field could throw a TypeError before the validator returned its structured diagnostics.
- **Change:** Added explicit index-container and records-array guards. Malformed roots now return a normal failed validation result with a precise locator error; canonical records are not partially processed. Added regression tests for null and object-valued index containers.
- **Verification:** GitHub Actions Continuity integrity run #154 passed; Mirror Cartographer CI run #4823 passed. The index-shape regression cases are included in that run.
- **Risk:** This validates the index envelope, not every optional index metadata field or the provenance bytes referenced by records.

 
## Iteration 012 — Fail closed when configured record roots are missing

- **Observation:** The validator silently skipped configured record directories that did not exist. A typo or missing mount could therefore produce a green result from only the remaining roots while omitting part of the continuity corpus.
- **Change:** Missing roots, non-directory roots, and unreadable roots now produce explicit validation errors. Added regression tests for missing and file-valued roots.
- **Verification:** GitHub Actions Continuity integrity run #158 passed with the missing-root and non-directory-root regression cases; Mirror Cartographer CI run #4827 passed.
- **Risk:** Every configured root is now required to exist. Callers must omit genuinely optional roots rather than passing nonexistent paths.

 
## Iteration 013 — Convert malformed JSON into structured corpus errors

- **Observation:** Invalid JSON in the continuity index or one record file threw from the parser and terminated the validator before it could return its normal machine-readable result or continue scanning other records.
- **Change:** Index parse failures now return a structured failed result. Record-file parse failures are appended to the error list and scanning continues, preserving diagnostics from valid neighboring records. Added regression tests for both paths.
- **Verification:** GitHub Actions Continuity integrity run #161 passed with malformed-index and malformed-record JSON cases; valid neighboring records remained visible in the diagnostic result.
- **Risk:** Malformed files remain fatal to overall validation, as intended; the change improves diagnostics and scan completeness rather than accepting bad data.

 
## Iteration 014 — Preserve timestamps for blocked queue updates

- **Observation:** The repository-tree current-view workflow failed on the existing `C-001` update because its status is `blocked_external_configuration`, but the reducer required `completed_at` for every update. That incorrectly conflated a status update with completion.
- **Change:** Queue updates now accept `updated_at` for non-completed statuses while completed records still require `completed_at`. The historical append-only queue record remains unchanged; its filename-derived timestamp is handled by the follow-on fallback iteration. Sorting and duplicate detection use the actual event timestamp field. Added regression tests for both status classes.
- **Verification:** Pending hosted Continuity Current View validation; this iteration is not counted as complete until materialization succeeds.
- **Risk:** The timestamp is derived from the update filename's recorded local minute; it preserves the source event's precision rather than inventing seconds beyond `:00`.

 
## Iteration 015 — Derive missing blocked-update timestamps from immutable paths

- **Observation:** The current-view materializer correctly distinguished `updated_at` from `completed_at`, but the append-only corpus contains older blocked updates whose timestamp is recorded only in the immutable filename. The workflow therefore failed on the next historical C-001 update.
- **Change:** Non-completed updates may now derive `updated_at` from a parseable timestamp embedded in the filename when the document has neither timestamp field. The materialized record identifies `timestamp_source: filename`; completed updates still require an explicit `completed_at`. Added tests for offset-aware timestamp parsing and rejection of filenames without a timestamp.
- **Verification:** Pending hosted Continuity Current View materialization; this iteration is not counted as complete until the full 549-file corpus is processed.
- **Risk:** Filename-derived time is only as precise as the path encoding; the materialized view records the timestamp source so it cannot be mistaken for a document-supplied field.

 
## Iteration 016 — Normalize legacy queue-update field names

- **Observation:** The append-only queue corpus includes historical documents using `item_id` and `recorded_at` rather than the newer `queue_item` and `updated_at` fields. The materializer stopped at these records even though their identity and event time were present.
- **Change:** The reducer now normalizes `item_id` to `queue_item` and `recorded_at` to the canonical update timestamp while retaining the timestamp provenance label. Added regression coverage for the legacy record shape.
- **Verification:** Pending hosted Continuity Current View materialization across the full corpus; this iteration is not counted as complete until it succeeds.
- **Risk:** Only the documented legacy aliases are accepted; unknown schema variants still fail closed.

 
## Iteration 017 — Materialize the immutable current view from local Git objects

- **Observation:** The hosted current-view workflow fetched the commit, recursive tree, canonical queue, and every one of 549 queue-update blobs through separate GitHub API requests. Repeated runs exhausted the API allowance and failed with HTTP 403 before completing, even though the exact commit was already checked out.
- **Change:** The workflow now resolves the requested immutable commit locally, derives its tree and blob identities with Git, enumerates the complete recursive tree, and reads each queue-update blob from that same commit. This preserves commit/tree/blob provenance and completeness checks while removing hundreds of network requests. Replaced API-mock tests with temporary-repository integration tests.
- **Verification:** Pending hosted Current View materialization of the complete corpus and the local-Git regression suite.
- **Risk:** The workflow now depends on checkout containing the exact `GITHUB_SHA` commit and its objects; the workflow must keep checkout and `GITHUB_SHA` aligned.

 
## Iteration 018 — Normalize legacy queue ownership fields

- **Observation:** Historical queue updates use `team` where newer records use `owner`. The materializer required only `owner`, so it rejected valid historical entries before applying the owner filter.
- **Change:** The reducer now normalizes `team` to the effective owner while preserving owner isolation. Added tests proving the legacy record is included for its team and excluded from another team's current view.
- **Verification:** Pending hosted Current View materialization across the full repository tree.
- **Risk:** Unknown ownership aliases remain rejected; only the observed legacy `team` field is accepted.
