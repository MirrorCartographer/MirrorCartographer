# Historical archive recovery — verified inventory and chronology

**Audit date:** 2026-11-05  
**Project lead:** Charity Alessandra Sturgell  
**Scope:** available Library artifacts and connected GitHub repositories; not the user's entire account, device, or historical sandbox estate.

## What was actually inspected

The available Library contains a file named `REFRESHED_ARTIFACT_CATALOG_CURRENT.csv`. Its raw file was materialized for inspection. It contains 256 catalog rows across eight asset types and seven lanes. It is a May 4, 2026 UTC inventory snapshot, not a live filesystem listing.

Catalog lane counts:

| Lane | Rows |
|---|---:|
| Thunder-Door / music-film | 102 |
| General / uncategorized | 64 |
| Studio / proof system | 34 |
| ARC | 23 |
| Field / TikTok organizer | 15 |
| Bio safety / bounty | 14 |
| Index / manifest | 4 |

Asset-type counts: 72 image assets, 55 videos, 33 documents, 31 ZIP bundles, 23 audio files, 17 ledgers/tables, 14 data/manifests, and 11 HTML/dashboard tools.

The catalog includes a broad set of artifacts beyond the current GitHub repositories: proof-system bundles, ARC materials, creative production outputs, dashboards, film assets, and procedural tools. The catalog's sandbox paths are historical references; they do not establish that those files still exist in the current runtime.

## Hashes of inspected source records

These hashes identify the exact bytes of the three records inspected in this audit. The originals contain private and personal content and are not being copied into this public repository.

| Source record | Size | SHA-256 |
|---|---:|---|
| `REFRESHED_ARTIFACT_CATALOG_CURRENT.csv` | 56,016 bytes | `1e8f67707ad0682d0c4b5ec3b939e848c1d4fd30dd3d52fc0ac0ce68a801da96` |
| `Mirror_Cartographer_Atlas_Omnibus(1).pdf` | 8,113,153 bytes | `ae3133f2283bfacbc56b5fbc36cf5a8dc961de99cafb05dc26753f7bd98a3b0f` |
| `chatgpt log.rtf` | 25,279,288 bytes | `03b2ebf944f36fe6e1a9235029f256fdd3bf4e5310b0ff50b6840294cc6acd48` |

These hashes are recorded as local audit observations. Because the original files are not publicly available at these paths, an external reviewer cannot independently recompute them without receiving the source files through a privacy-controlled channel.

## Canvas / text-document evidence

The inspected RTF archive contains 509 textual mentions of Canvas, 103 occurrences of `textdoc_id`, and 28 distinct `Successfully created text document` records. This is direct evidence that the export preserves a substantial set of Canvas/text-document creation events. It does not establish that all 28 documents, all snapshots, or the full account history are present.

Identifiable project-related records include:

| Canvas/text-document title | Text-document identifier | Decoded identifier time (UTC; inferred) |
|---|---|---|
| MC UI Tone Preview | `6850dbccd31c8191a70a5295fa0b9f07` | 2025-06-17 03:06 |
| MC UI Tone Preview (second record) | `6851c993e0308191bec76c631c35cf30` | 2025-06-17 20:01 |
| Mirror Cartographer Repo Setup | `6851d10ec2f88191aca66dcd71bc4a44` | 2025-06-17 20:33 |
| Whisper Symbolic Pipeline | `6864df1890448191b91b679c17f71607` | 2025-07-02 07:26 |
| Whisper Symbolic Pipeline (second record) | `6864df8b87048191be1721c7aac39f40` | 2025-07-02 07:28 |
| Mirror Cartographer Setup | `68671a1774608191a130221c52a888de` | 2025-07-04 00:02 |
| Mirror System Merge | `6869cdfcc6c881918e48a88fb5685f08` | 2025-07-06 01:14 |
| Mirror Cartographer Merge | `6869cef2f57c81918c7afdfab34ca5b7` | 2025-07-06 01:18 |
| Mirror Cartographer Core | `6869cf676928819195ea7e40032f5f37` | 2025-07-06 01:20 |
| Mirror Migration Plan | `6869d10ecda48191871557b0addfb4ec` | 2025-07-06 01:27 |
| Mirror Cartographer Visions | `6872e3f1c6cc8191b1cf2a1da71bc572` | 2025-07-12 22:38 |
| Symbolic Logic Pivot | `68730361f0e4819189426297c74ce55d` | 2025-07-13 00:52 |
| Dreams Symbols Receiver | `687308ad83a88191881f84ef2ed7f687` | 2025-07-13 01:15 |
| Intuition Action Map | `6873104b28f88191b24f953e5df6a6d1` | 2025-07-13 01:47 |
| Mirror Modules Summary | `68771bbae28c8191b370ddb07af0a953` | 2025-07-16 03:25 |
| Recursive Integrity Audit | `688168c4f66c8191baf10d53e9465168` | 2025-07-23 22:57 |
| Axis Mirror Pitches | `688c3ac6f66c8191baf10d53e9465168` | 2025-08-01 03:55 |
| Presence Field Prototype | `688ebdd2e9f08191b390493c3f1f1c72` | 2025-08-03 01:39 |
| Collapse Echo Map | `688f86f48864819193bc1f77bf8809c6` | 2025-08-03 15:57 |

Health-related Canvas records and personal conversation content are deliberately omitted from this public table. Their original bytes remain private.

## Canvas-to-implementation crosswalk

| Historical Canvas artifact | Corresponding implementation family | Mapping status |
|---|---|---|
| Mirror Cartographer Repo Setup | `MirrorCartographer/mirror-cartographer-ui` | Direct conceptual and scaffold relationship; exact commit mapping still needed |
| MC UI Tone Preview (two records) | `mirror-cartographer-ui` tone/room interface | Strong title and code-family match; exact revision-to-commit comparison pending |
| Mirror Cartographer Setup | Early React + Node GPT-4 assistant scaffold and API route | Source instructions present in RTF; successful deployment/inference not established |
| Mirror Cartographer Core / Merge | Current Mirror Cartographer research repository and private engine work | Conceptual/architecture lineage; exact file-by-file mapping pending |
| Whisper Symbolic Pipeline (two records) | Whisper/audio transcription and symbolic reflection experiments | Documented plan/prototype family; runtime and exact repository mapping pending |
| Presence Field Prototype | Presence Field / reflective interaction artifacts | Historical document identified; execution and commit mapping pending |
| Collapse Echo Map / Axis Mirror Pitches | Symbolic and relational mapping research | Historical documents identified; implementation mapping not established |
| Mirror Modules Summary / Recursive Integrity Audit | Modular architecture and integrity research | Historical documents identified; exact source mapping pending |

## Google Apps Script / OpenAI API evidence

The RTF contains Apps Script instructions and a test function that:

- retrieves `OPENAI_KEY` from Apps Script Script Properties;
- posts to `https://api.openai.com/v1/chat/completions`;
- specifies `model: "gpt-4"`;
- sends a Mirror Cartographer test prompt;
- logs `response.getContentText()`.

This is evidence of an implemented API-call test procedure and code configured to call OpenAI's GPT-4 Chat Completions endpoint. The same instructions explicitly tell the user to open View > Logs and inspect the result. No actual Apps Script execution log, HTTP status, response body, OpenAI request ID, or matching sent email headers were recovered in this audit.

**Conclusion:** source-level API integration is evidenced; successful external GPT-4 inference from that Apps Script execution is not yet proven. A separate exported ChatGPT conversation record contains `model_slug: gpt-4o` and request metadata dated 2024-10-03 UTC, but that proves a ChatGPT conversation used GPT-4o, not that the Apps Script or independent Mirror Cartographer backend used it.

## Repository and service inventory

The connected GitHub account exposes four repositories under `MirrorCartographer`: two public (`MirrorCartographer`, `mirror-cartographer-ui`) and two private (`c`, `J`). The two private repositories were not copied into this public archive. Public UI source and public research records are independently inspectable; private implementation claims require authorized review of the private repositories.

GitHub repository access alone does not establish deployment history. Vercel, Netlify, Google Apps Script, and any local Mac services need their own deployment or execution records. No current Vercel or Google Apps Script execution log was available through the connected sources inspected in this pass.

## Privacy review

Do not publish the original RTF, full catalog, medical/veterinary records, private conversations, API keys, tokens, or raw private source dumps. The source catalog contains personal and unrelated creative materials. Public records should contain only sanitized metadata, evidence summaries, and non-sensitive source identifiers.

An archive manifest generator is provided at `tools/build_archive_manifest.py`. It defaults to excluding hidden files, secret filenames, likely sensitive directories, and common credential patterns. Its output must still receive human review before publication. It records hashes and filesystem mtimes but does not certify authorship or original creation time.

## Open tasks

1. Recover native Canvas document exports and revision metadata; compare each document's actual body to its matching implementation commits.
2. Recover Apps Script execution records and sent email headers. Preserve HTTP status, response ID, model, timestamps, and redacted response content; never publish API keys.
3. Inspect public Git commit history, tags, CI runs, and deployments; reproduce representative public artifacts from clean checkouts.
4. Audit private repositories C and J without copying private data into this repository; prepare a controlled reviewer access package.
5. Reconcile the 256-row artifact catalog against currently available files; sandbox references in the catalog are not evidence of current availability.
6. Have an independent reviewer validate the strongest implementations and sign a dated report with methods, commit SHAs, test environment, and limitations.

## Reproducibility and integrity

Use the archive manifest tool on a staged copy, review exclusions, then preserve the manifest and its own SHA-256. Do not change or normalize original files before hashing. For long-term authenticity, publish signed Git tags or detached signatures and preserve source archives in at least two owner-controlled locations.
