# GitHub Blame ↔ Private Source Provenance Bridge

Status: implementation contract  
Version: 1.0.0  
Scope: public repository metadata linked to private source records  
Privacy default: private source; public-safe trace only

## Purpose

GitHub Blame answers: **which commit last changed this line?** It does not answer: **which conversation, observation, decision, or evidence caused the change?**

This bridge joins those two histories without publishing raw conversations.

The repository is the public artifact/version layer. The private source vault is the verbatim conversation layer. A trace record connects them through opaque identifiers and cryptographic digests.

## The complete lineage

`private source → extracted signal → claim / requirement → decision → implementation artifact → commit → changed line range → review / revision`

Every arrow is an explicit relationship, not an inference from temporal proximity.

## What GitHub can establish

- A commit exists and has a specific immutable SHA.
- A file path and blob changed in that commit.
- A diff records the textual change.
- Blame attributes the current line to the commit that last changed it.
- Parent commits establish repository ancestry.

GitHub cannot establish which private conversation caused the change unless a separate source-to-change record explicitly links them.

## Record model

One trace record represents one source-to-artifact relationship. Multiple records may point to the same commit or line range. One source may influence multiple artifacts.

Required identity and implementation fields:

- `trace_id`: stable opaque trace identifier.
- `repository`: exact owner/name.
- `artifact_path`: repository-relative file path.
- `commit_sha`: full 40-character commit SHA.
- `parent_sha`: parent commit SHA when known.
- `line_ranges`: changed/current line ranges attributed to the commit; empty only when the artifact-level relationship is explicit and line attribution is not available.
- `source_ref`: opaque private-vault pointer; never a raw URL, account ID, chat title, or transcript excerpt.
- `source_digest`: SHA-256 digest of the exact private source unit, computed in the private environment.
- `source_kind`: conversation message/span, user instruction, file, observation, or external source.
- `relationship`: direct, derived, or contextual. Contextual is not causal proof.
- `transformation`: what was extracted or changed (e.g. requirement extraction, abstraction, implementation).
- `claim_refs` and `decision_refs`: stable IDs, not copied private text.
- `privacy_scope`: private source; public-safe metadata only.
- `raw_content_included`: must always be false.

## Privacy and publication rules

1. Never commit raw chat exports, message bodies, screenshots, private URLs, account metadata, or identifying chat titles.
2. The public trace contains only opaque source references and one-way digests. A digest is an integrity check, not a substitute for access control.
3. The private source vault owns the mapping from `source_ref` to the original conversation/message and enforces authorization.
4. No public UI may resolve an opaque private reference. Resolution requires an authenticated private service and an explicit permission check.
5. Redaction does not erase lineage: retain the opaque source reference, digest, redaction status, and reason code.
6. A source-to-commit link is not proof that the source fully justified the implementation. Preserve relationship type and review status.
7. If the original source is unavailable, say so. Do not reconstruct verbatim wording from summaries or infer a missing message.
8. A GitHub username/Blame author is an account attribution, not proof of intellectual origin or sole authorship.

## How to read a trace alongside GitHub Blame

1. Open the file's Blame view.
2. Select the commit shown for the relevant line.
3. Inspect the commit diff and parent.
4. Find trace records matching repository + path + commit SHA + line range.
5. Inspect the public-safe claim/decision references.
6. If authorized, resolve the opaque source reference in the private vault.
7. Compare the original source, transformation, implementation, and later revisions.

If no matching trace exists, the correct result is **source-to-code link unknown**, not “the commit author originated the idea.”

## Completeness states

- `linked`: exact source and exact commit are bound; line range is verified.
- `artifact_linked`: source and commit are bound, but line attribution is unavailable.
- `partial`: one side or an exact identifier is missing.
- `unavailable`: source cannot be retrieved or verified.
- `redacted`: source exists but is intentionally inaccessible in this context.
- `disputed`: competing source or attribution records exist.

Never promote `partial`, `unavailable`, `redacted`, or `disputed` to `linked` without new evidence.

## Minimum acceptance tests

- A reviewer can navigate from a blamed line to its exact commit and diff.
- A reviewer can find the corresponding public-safe trace without seeing raw chat.
- An authorized private reader can resolve the opaque source reference and verify its digest.
- A reader without private authorization cannot resolve the source reference.
- A missing source remains visibly missing.
- Multiple contributing sources can be represented without falsely assigning sole origin.
- Reverts, cherry-picks, file renames, and later line edits do not silently rewrite historical source attribution.

## Boundary

This bridge makes repository history more explainable. It does not turn GitHub Blame into a conversation archive, prove causality from timestamps, or certify the truth of a claim.
