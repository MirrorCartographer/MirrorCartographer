# Evidence Drift Watchlist

Executable Mirror Cartographer component for medical/scientific and animal-care evidence organization.

Purpose: prevent a retrieved source, literature note, animal-care observation, or hypothesis support packet from being treated as stable evidence when its evidentiary status has drifted.

This is not medical or veterinary advice. It is a public-safe routing gate for research memory.

Input contract: JSON object with `packets`, where each packet includes `id`, `domain`, `claim_text`, `claim_status`, `source_status`, `privacy_status`, `evidence_date`, `last_reviewed_date`, `contradiction_count`, `superseded_by`, `missingness`, and `revision_reason`.

Output contract: JSON object with `watchlist` route entries and summary counts. Routes are `stable`, `watch`, `review`, or `block`.

Routing rules:

- `block` when privacy is `private` or `unknown`.
- `block` when claim status is `contradicted`.
- `review` when source status is `unknown` or evidence date is invalid/missing.
- `review` when `superseded_by` is non-empty.
- `review` when contradiction count is greater than zero.
- `watch` when last review is more than 180 days after the evidence date.
- `watch` when missingness is non-empty.
- `stable` only when the packet is public-safe/synthetic/redacted, not contradicted, not superseded, has no contradictions, and has required dates.

Run: `python tools/evidence_drift_watchlist.py tools/evidence_drift_watchlist_fixtures.synthetic.json`

Test: `python tools/test_evidence_drift_watchlist.py`

Acceptance criteria:

1. Private or unknown privacy packets never route to stable.
2. Contradicted packets route to block.
3. Superseded evidence routes to review.
4. Old evidence routes to watch unless a stronger block/review rule applies.
5. Missingness is preserved as an explicit drift reason.
6. Output includes a machine-readable summary count.
