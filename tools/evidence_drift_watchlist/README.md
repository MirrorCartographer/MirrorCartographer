# Evidence Drift Watchlist

Executable Mirror Cartographer component for converting stable-seeming research claims into a watchlist of claims that must be periodically rechecked before they are reused in discovery memory, collaborator packets, animal-care evidence maps, or public artifacts.

The component does **not** verify the truth of a claim. It assigns a drift risk and a recheck queue from packet metadata so stale medical, veterinary, AI, legal, or scientific statements do not keep circulating as if they were current.

## Cure/discovery tie

Cure-oriented and discovery-oriented systems fail when an old claim silently becomes infrastructure. This gate protects hypothesis generation and literature organization by separating:

- stable background claims
- fast-moving claims requiring scheduled recheck
- unsupported or stale claims requiring evidence refresh before reuse
- blocked claims that contain advice or private residue

## Input shape

A JSON file containing either a list of packets or an object with `claims`.

Required fields per claim:

- `claim_id`: string beginning with `edw_`
- `domain`: one of `medical`, `veterinary`, `ai_systems`, `biology`, `software`, `legal_policy`, `general_science`
- `source_status`: `synthetic`, `public`, `literature_note`, `preprint`, `guideline`, `mixed_public`
- `claim_status`: `hypothesis_only`, `observational`, `supported`, `inconclusive`, `contradicted`
- `privacy_status`: `synthetic_only`, `public_safe`, `deidentified_public`
- `last_checked`: ISO date string, YYYY-MM-DD
- `freshness_window_days`: positive integer
- `evidence_refs`: list of public-safe source or artifact references
- `claim_text_public`: public-safe bounded claim text
- `missingness`: list of known gaps
- `revision_reason`: why this claim entered the watchlist
- `next_executable_action`: concrete recheck or routing action

## CLI

```bash
python tools/evidence_drift_watchlist/build_evidence_drift_watchlist.py tools/evidence_drift_watchlist/fixtures.synthetic.json
```

## Output queues

- `current_low_drift`: reusable with normal provenance.
- `recheck_soon`: still usable only with freshness warning.
- `refresh_before_reuse`: too stale or weakly evidenced for reuse.
- `blocked_boundary`: private residue, advice leakage, or invalid status.

## Tests

```bash
python tools/evidence_drift_watchlist/test_build_evidence_drift_watchlist.py
```

## Boundary

Research organization only. Not medical, veterinary, legal, or financial advice.
