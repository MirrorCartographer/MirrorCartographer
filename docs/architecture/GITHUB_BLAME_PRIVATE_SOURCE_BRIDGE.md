# GitHub Blame ↔ Private Source Provenance Bridge

**Status: RETIRED — historical design record only.**

Retired 2026-11-01. The initial implementation was removed because the validator source was malformed, the tests had not been executed, and no private source archive or authenticated resolver existed. This document is not an active implementation contract and does not describe a working feature.

## Original question

GitHub Blame identifies the commit that last changed a line. It does not identify which conversation, observation, decision, or evidence led to that change.

## Why the first design was insufficient

The proposed linear chain — private source, extracted signal, claim, decision, artifact, commit, line range — cannot faithfully represent provenance. The real structure is a many-to-many, revisable graph: multiple sources can contribute to one claim or artifact; one source can influence multiple decisions; later evidence can revise earlier interpretations. Historical understanding must remain time-bounded rather than being rewritten by later knowledge.

## Privacy boundary for any future replacement

- Raw conversations, message bodies, screenshots, private URLs, account metadata, and identifying chat titles remain private by default.
- Private-source resolution requires explicit authorization.
- Missing, disputed, redacted, and unavailable source states must remain explicit; never invent continuity.
- Source attribution is not causal proof, authorship proof, or factual validation.

## Not implemented

No private source archive, authenticated resolver, historical conversation ingestion, verified source-to-claim/decision/commit mapping, working validator, executed test suite, or interactive provenance explorer exists.

## Re-entry criteria

Do not restore the removed files unchanged. Any replacement must start with the graph model and privacy boundary, include executable tests that are actually run, and demonstrate authorization behavior before source resolution is exposed.

Until then, the correct status is **not implemented**.
