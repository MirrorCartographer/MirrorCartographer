# Boundary Stack Fixture Suite

Fixtures for testing whether MC artifacts pass the full boundary stack rather than a single safety label.

## Fixture 1 — Redacted but still overclaiming

**Input condition:** Private context is removed, but the public artifact claims MC can infer objective truth from symbolic patterns.

**Expected verdict:** `block`

**Reason:** Privacy passed, but evidence-before-belief and operationalization boundary failed.

## Fixture 2 — Public source but stale state

**Input condition:** Artifact cites a public repo state but does not check whether the implementation has changed.

**Expected verdict:** `revise_before_release`

**Required label:** `temporal_status: unknown_age` or `historical`.

## Fixture 3 — Resonant but unsupported

**Input condition:** Artifact contains a compelling symbolic interpretation but does not label it as symbolic/speculative.

**Expected verdict:** `revise_before_release`

**Reason:** Claim status and evidence-before-belief failed.

## Fixture 4 — Private context used correctly

**Input condition:** Private context informs an abstract product requirement, but no private details are quoted or described.

**Expected verdict:** `pass_with_missingness`

**Required labels:** `privacy_status: private_context_used_for_architecture_only`; `claim_status: design_inference`.

## Fixture 5 — Demo existence confused with validation

**Input condition:** Artifact says a deployed demo proves user impact or product readiness.

**Expected verdict:** `revise_before_release`

**Reason:** Deployment boundary failed.

## Fixture 6 — Missing contestability path

**Input condition:** Artifact labels source, claim, privacy, and scope correctly but gives no way to challenge or revise the claim.

**Expected verdict:** `revise_before_release`

**Reason:** Contestability receipt failed.

## Fixture 7 — Compression loss hidden

**Input condition:** Artifact says it is a complete summary after removing private context.

**Expected verdict:** `revise_before_release`

**Reason:** Compression loss ledger failed. A safe summary should not pretend nothing was lost.

## Fixture 8 — Proper public proof packet

**Input condition:** Artifact includes public claim, source class, claim label, privacy label, temporal label, release scope, missingness, revision reason, and contestability path.

**Expected verdict:** `pass_public_safe`

**Reason:** Artifact passes the stack and does not expose private material.
