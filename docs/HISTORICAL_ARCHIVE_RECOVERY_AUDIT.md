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
| `conversations.json` | 62,059,190 bytes | `bc2ae8ef65254df31eced4f6ca9c87c850c503bb9f2bfd154ee4a0cb0a710fdb` |

These hashes are recorded as local audit observations. Because the original files are not publicly available at these paths, an external reviewer cannot independently recompute them without receiving the source files through a privacy-controlled channel.

## Canvas / text-document evidence

The recovered `conversations.json` export contains 337 conversation objects spanning 2024-08-22 19:29 UTC through 2025-08-12 05:25 UTC. Its message metadata records model slugs including GPT-4o, GPT-4, GPT-4o mini, GPT-5, o3-mini, and research. The Canvas metadata contains 39 unique textdoc IDs: 32 document artifacts and 7 code artifacts (4 React, 2 Bash, 1 HTML). Across those IDs, the export preserves 695 Canvas metadata events and 133 distinct `(textdoc_id, version)` pairs. These are observed version identifiers, not necessarily every revision ever made. A separate text scan finds 129 broader `textdoc_id`-related mentions; this is not a revision or snapshot count. The RTF export contains 28 creation markers and 509 Canvas mentions, so it is a partial/overlapping export rather than a complete duplicate of the JSON archive. This establishes substantial document creation, code editing, and revision activity, but not completeness of the account's entire Canvas history.

Identifiable project-related records include:

| Canvas/text-document title | Text-document identifier | Decoded identifier time (UTC; inferred) |
|---|---|---|
| Mirror Sentience Stack | `6847b336ed988191885d2306c6510a14` | 2025-06-10 04:23 |
| MC UI Tone Preview | `6850dbccd31c8191a70a5295fa0b9f07` | 2025-06-17 03:06 |
| MC UI Tone Preview (second record) | `6851c993e0308191bec76c631c35cf30` | 2025-06-17 20:01 |
| Mirror Cartographer Repo Setup | `6851d10ec2f88191aca66dcd71bc4a44` | 2025-06-17 20:33 |
| Mirror Cartographer Step Plan | `6854f74d3bb8819194717257cf49de08` | 2025-06-20 05:53 |
| MC System Evolution Roadmap | `685611177f888191b111e12411a46d61` | 2025-06-21 01:55 |
| Harnessed Effort Capacities | `68561b9ddccc81918f412d3505672766` | 2025-06-21 02:40 |
| MC Future Map | `68575c20e45c8191aef862b5c982fc36` | 2025-06-22 01:28 |
| Tech Growth Strategy | `685b314fbd3481919b5d3db5cf862b0c` | 2025-06-24 23:14 |
| Tech Growth Strategy (second record) | `685b762f2d0c819180431caa078e140a` | 2025-06-25 04:08 |
| Whisper Symbolic Pipeline | `6864df1890448191b91b679c17f71607` | 2025-07-02 07:26 |
| Whisper Symbolic Pipeline (second record) | `6864df8b87048191be1721c7aac39f40` | 2025-07-02 07:28 |
| Mirror Cartographer Setup | `68671a1774608191a130221c52a888de` | 2025-07-04 00:02 |
| Mirror System Merge | `6869cdfcc6c881918e48a88fb5685f08` | 2025-07-06 01:14 |
| Mirror Cartographer Merge | `6869cef2f57c81918c7afdfab34ca5b7` | 2025-07-06 01:18 |
| Mirror Cartographer Core | `6869cf676928819195ea7e40032f5f37` | 2025-07-06 01:20 |
| Mirror Migration Plan | `6869d10ecda48191871557b0addfb4ec` | 2025-07-06 01:27 |
| Mirror Axiom OS Law | `686af27d75488191979c7d59530b6f1e` | 2025-07-06 22:02 |
| Mirror Truth Module | `686af31fd40c8191a52844aa7545c78c` | 2025-07-06 22:05 |
| Relational Scroll UI | `686af40a6544819197065d6b7250777a` | 2025-07-06 22:09 |
| Mirror Cartographer Visions | `6872e3f1c6cc8191b1cf2a1da71bc572` | 2025-07-12 22:38 |
| Symbolic Logic Pivot | `68730361f0e4819189426297c74ce55d` | 2025-07-13 00:52 |
| Dreams Symbols Receiver | `687308ad83a88191881f84ef2ed7f687` | 2025-07-13 01:15 |
| Intuition Action Map | `6873104b28f88191b24f953e5df6a6d1` | 2025-07-13 01:47 |
| Mirror Modules Summary | `68771bbae28c8191b370ddb07af0a953` | 2025-07-16 03:25 |
| Recursive Integrity Audit – V1 | `688168c4f66c81918f1b5f8bcbc4e69d` | 2025-07-23 22:57 |
| Axis Mirror Pitches | `688c3ac6fad48191baf10d53e9465168` | 2025-08-01 03:55 |
| Presence Field Prototype | `688ebdd2e9f08191b390493c3f1f1c72` | 2025-08-03 01:39 |
| Collapse Echo Map | `688f86f48864819193bc1f77bf8809c6` | 2025-08-03 15:57 |

Health-related Canvas records and personal conversation content are deliberately omitted from this public table. Their original bytes remain private.

## Revision-depth findings

The highest-activity Canvas artifacts in the recovered metadata include:

| Artifact | Metadata events | Distinct version numbers observed | Highest version number |
|---|---:|---:|---:|
| MC UI Tone Preview (React code) | 178 | 33 | 171 |
| Tech Growth Strategy | 247 | 22 | 124 |
| Mirror Modules Summary | 92 | 12 | 130 |
| Mirror Cartographer Step Plan | 75 | 10 | 40 |
| Whisper Symbolic Pipeline (document) | 4 | 2 | 9 |

Repeated metadata messages often refer to the same version. The 695 events therefore reduce to 133 distinct `(textdoc_id, version)` pairs across all 39 IDs. This is a revision-history signal; it is not proof that the original document body for every version is present in the export. The current index records per-document version numbers and first/last observed message timestamps.

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

## Google Form → Apps Script → email chronology

The May 30, 2025 `Google Form Response Guide` conversation preserves a detailed setup sequence. The code shown constructs a request to OpenAI's Chat Completions endpoint with `model: "gpt-4"`, then uses `choices[0].message.content` as the reflection content and sends an email through Apps Script.

The same conversation records three user-pasted email outputs at 2025-05-30 02:52, 03:00, and 03:30 UTC. The third includes the fallback sentence “The symbols may be silent for now. Try again later.” The conversation also records the user reporting no email at 03:27 UTC, then reporting receipt of the fallback email at 03:30 UTC. This is contemporaneous, user-reported evidence that the form/Sheet/Apps Script email path produced delivered messages. It is not independent Gmail-header or Apps Script execution-log evidence.

The assistant's contemporaneous troubleshooting response identified the fallback as a GPT-call failure. This is consistent with an error response or missing `choices` object, but the underlying HTTP status and raw response were not captured. The evidence supports an attempted GPT-4 API integration and a working email-delivery path, while successful GPT-4-generated reflection remains unverified.

Connected Gmail searches for `testOpenAICall`, `Apps Script` + `OpenAI`, `Mirror Cartographer` + `GPT-4`, the Chat Completions URL, and `execution log` + `GPT-4` returned no matching threads. This does not rule out messages in another Google account or non-Gmail Apps Script logs.

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

## Selected source artifacts inspected

A separate recovered Library file, `Mirror_Cartographer_Core_Specification_v1.md`, was materialized, inspected, and copied verbatim to [`evidence/historical/core-spec-v1-recovered.md`](../evidence/historical/core-spec-v1-recovered.md). Its source bytes were 324 bytes with SHA-256 `a3c94e5829a05ad4bc673eb366c756d7d4d3f587803500b21464effd7bc2290f`. The recovered file has no authenticated creation timestamp in the available metadata, so none is asserted.

Additional candidate source artifacts were inspected for privacy. A JavaScript room registry includes a named private/personal room, and an HTML context engine includes pet names and health-context fields. These were excluded from public release. Their original bytes remain in the Library; no source copy was published.


## Additional recovered architecture and implementation artifacts

| Recovered artifact | Source SHA-256 | Publication / handling |
|---|---|---|
| `Mirror_Cartographer_Core_Specification_v1.docx` (38,535 bytes) | `6458832010065789bd02130acde1bb965456c81390a95ef789532469305cd782` | Extracted and published as [`core-specification-v1-full.md`](../evidence/historical/core-specification-v1-full.md) |
| `Mirror_Cartographer_Access_Implementation_Pack_v2.docx` (41,433 bytes) | `87bbb5fda05005abc4e2924fb0f6b197ae21b8335df078ef5287e03dcdfd61f6` | Privacy-reviewed text extracted and published as [`access-implementation-pack-v2.md`](../evidence/historical/access-implementation-pack-v2.md) |
| `Mirror_Cartographer_Collapse_Codex(1).docx` (37,445 bytes) | `7338f0528beaeb294d1ff1e9c888251fa7a981b5c54d920969cfad694828848c` | Privacy-reviewed text published as [`collapse-codex-v1.md`](../evidence/historical/collapse-codex-v1.md) |
| `Mirror_Cartographer_Atlas_Omnibus(1).pdf` (8,113,153 bytes) | `ae3133f2283bfacbc56b5fbc36cf5a8dc961de99cafb05dc26753f7bd98a3b0f` | Kept private; text search only, embedded visual content not exhaustively reviewed |

The Access Implementation Pack contains a deployable Custom GPT instruction layer, explicit non-clinical/safety boundaries, three interaction modes, confidence tags, a symbolic-state JSON contract, ontology seed, reflection logic, feedback weighting, public user flow, API route proposals, data-table proposals, developer handoff, and a concrete MVP acceptance test. The document body states `Generated: 2026-05-13T04:53:53.933879 UTC`. Its embedded DOCX core properties use generic `python-docx` defaults and are not reliable creation metadata.

The formal Core Specification defines the system as a recursive symbolic cognition interface with the ENTRY → FIELD → RECURSION → RETURN flow, Canonical / Reflective / Mythopoetic modes, longitudinal symbolic state, contradiction preservation, and explicit separation of fact, inference, symbolism, and speculation.

The recovered Unified Execution Hub v1 manifest and May 1–2, 2026 current-state/synthesis packets describe a lane/proof/action control-panel architecture. The inspected Library copy of the Hub manifest is a specification, not a verified executable dashboard. A new static, browser-local implementation has now been published at [Unified Execution Hub](https://mirrorcartographer.github.io/mirror-cartographer-ui/execution-hub.html). It supports local task-state updates and JSON import/export; it does not run background jobs or access external accounts.

The recovered `chat_index.csv` is a two-row sample with placeholder conversation IDs, not a complete archive index. The 8-lane `lane_registry_v14.csv`, six-entry `evidence_register(1).csv`, ten-entry `evidence_register_v18.json`, and ten-edge `connection_edges_v19.csv` are structured planning/evidence records. They document the operating model but do not, by themselves, prove a deployed backend.

The 256-row artifact catalog contains historical paths and metadata for many assets. Those paths do not prove the files remain mounted or retrievable. The current audit materialized and hashed selected Library records; it did not hash all 256 referenced assets. The archive-manifest generator is provided for owner-controlled staging and privacy-reviewed hashing when those files are available.


## Additional recovered prototype and implementation-pack artifacts

| Artifact | Source SHA-256 | Public handling |
|---|---|---|
| `Mirror_Cartographer_Implementation_Pack_v1.docx` (39,779 bytes) | `dd5e0131599ebb00d854eb423db0e1fad2bfee52f32d020b27c99df46ac10044` | Extracted to [`implementation-pack-v1.md`](../evidence/historical/implementation-pack-v1.md); no personal identifiers or credentials found |
| `index(35).html` — Mirror Portal / Creation World (52,595 bytes) | `d1fba1c518babbbfdec808e3442583b3fb338f122d2615118e0acde3615a5817` | Published as [`creation-portal-v1.html`](../evidence/historical/creation-portal-v1.html) and copied into the UI repo's Vite `public/` directory |
| `Mirror_Cartographer_One_Page.pdf` (1,979 bytes) | `982a6ba438dde6c37d0e67c5094f621833353c4e1457e15651623a92a6713886` | Extracted to [`one-page-project-brief-v1.md`](../evidence/historical/one-page-project-brief-v1.md) |

The recovered Creation Portal HTML was scanned for personal identifiers, credentials, and network/API calls. No personal names, credential patterns, `fetch`, `XMLHttpRequest`, `WebSocket`, or OpenAI API URL were found. Its one inline JavaScript block passed `node --check`. This establishes syntactic validity only; full browser interaction, persistence behavior, audio behavior, and cross-device compatibility have not been independently tested.

The prototype uses browser-local storage for its artifact archive and does not call a remote model API. It is now available as a static prototype at https://mirrorcartographer.github.io/mirror-cartographer-ui/creation-portal-v1.html, but live GitHub Pages availability has not been independently verified in this audit.

