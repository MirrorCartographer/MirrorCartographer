# Technical evidence register

**Updated:** 2026-11-05  
**Scope:** public research repository and cross-project architecture  
**Purpose:** distinguish inspectable implementation from plans, historical prototypes, and unverified runtime claims.

## System map

| System | Role | Evidence location | Current evidence boundary |
|---|---|---|---|
| Mirror Cartographer | Umbrella research and product system | This repository, Observatory guide, research expeditions | Broad project identity; individual subsystems have separate maturity |
| Mirror Cartographer UI / Living Atlas | Interactive rooms, visual tools, workbench | [UI repository](https://github.com/MirrorCartographer/mirror-cartographer-ui) | Source and published entry points exist; each artifact requires its own runtime check |
| Repository C | Private reflection engine, creative workshop, memory and provider experiments | Private repository; public summary in this record | Must remain private; see private completion map and audit |
| Human Judgment Lab | Human/model evaluation methods and experiments | Private repository J | Synthetic simulations and source-level tests; not field validation |
| FREE 2.0 | Decision-integrity and governance workflow | Private repository C / research documentation | Core implementation exists; integration and full acceptance remain incomplete |
| LYR | Independent language-model research implementation | Private repository C | Model architecture/training/inference code exists; no verified trained checkpoint established |
| ARC | Relation reasoning and composition experiments | Research artifacts and private project records | Separate solver/evaluation lane; do not conflate with LYR or FREE |
| Meaning Integrity | Response-level meaning failure evaluation | Research and private benchmark artifacts | Distinct from Human Judgment Lab; benchmark validity requires separate study |
| Creation Portal v1 | Recovered standalone HTML prototype with localStorage artifact archive; inline JS syntax passed `node --check` | Source verified and syntax checked; browser behavior not fully tested |
| Implementation Packs v1/v2 | Product instructions, symbolic ontology, session-state contract, reflection logic, safety boundaries, and developer handoff | Historical specifications; not proof of a deployed backend |
| Unified Execution Hub UI | Local-first static dashboard in `MirrorCartographer/mirror-cartographer-ui/execution-hub.html` | Source verified; browser behavior not independently executed in this pass |
| Historical Canvas corpus | Product specs, code documents, revision history | User-controlled Canvas recovery archive | 39 unique Canvas textdoc IDs (32 document artifacts, 7 code artifacts), 695 Canvas metadata events, and 133 distinct `(textdoc_id, version)` pairs across a bounded 337-conversation export. These are observed version identifiers, not every historical revision. |
| Historical Google Apps Script integration | Form intake, Apps Script request, email response | Recovered conversation/source artifacts | Code configured to request OpenAI Chat Completions with `gpt-4`; successful generation for a specific submission is not established by fallback email alone |

## Verified source-level evidence

### Public Observatory / research repository

- The repository README defines Mirror Cartographer as an evidence-aware research and systems practice.
- The Cabinet of Real Things distinguishes artifacts from proposals and explicitly warns that catalogue concepts are not automatically implemented demos.
- Research expeditions and system documents preserve questions, evidence boundaries, and falsification paths.
- The repository is public and can serve as the primary public research and portfolio surface.

### Public UI repository

- Its completion map records 96 HTML artifacts indexed in the workbench.
- It records 79 rooms as discoverable and describes interaction, accessibility, local-storage, and browser-test changes.
- Source-level tests and CI gates exist; source indexing does not imply every page has been tested on every device or deployment.

### Private Repository C

- The completion map describes the main reflection application, symbolic corpus, provider-neutral CLI, deterministic project daemon, bounded model worker, continuity records, and quality gates.
- The repository audit records passing quality/daemon runs for named commits and explicitly records skipped model inference when the OpenAI secret was absent.
- Live website-to-model integration, real-browser/offline behavior, and local Ollama inference remain unverified unless newer evidence is added.
- Keep all source and raw memory records private.

### Private Human Judgment Lab

- The recovery index inventories the evaluation program, six-dimension rubric, synthetic dataset, Consensus Trap simulation, seeded controls, run export, and deterministic tests.
- The simulation demonstrates behavior under stated assumptions; it is not empirical evidence of real human-rater behavior.
- Keep repository J private unless the owner deliberately changes its visibility.

### LYR and FREE

- LYR has a decoder-only Transformer, tokenizer, training loop, and inference script in the private source tree.
- No verified trained checkpoint or reproducible training run has been established in this register.
- FREE 2.0 has an executable core and governance concepts, but the full contradiction/supersession graph and end-to-end integration remain incomplete.
- Do not describe LYR as a completed foundation model or FREE as a fully deployed autonomous governance system.

## Historical API evidence

A recovered May 30, 2025 Google Form / Apps Script workflow constructs a request to `https://api.openai.com/v1/chat/completions` with `model: "gpt-4"`. The conversation archive contains three user-pasted email outputs from that workflow, including a later fallback message (“The symbols may be silent for now. Try again later.”). This is contemporaneous, user-reported evidence that the email path delivered messages; it does not establish successful GPT-4 inference. No Apps Script execution record, HTTP status, raw API response, request ID, or Gmail headers were recovered. Report this as an implemented integration attempt with unverified successful inference.

## Verification labels

Use these labels consistently:

- **Verified runtime:** reproducible execution with preserved logs/results.
- **Verified CI:** a named CI run passed on a named commit.
- **Source verified:** relevant code exists and has been inspected.
- **Historical artifact:** original file or Canvas snapshot recovered, but not necessarily executable today.
- **Implemented, runtime unverified:** implementation exists; successful live operation has not been reproduced.
- **Specified:** requirements or architecture exist; implementation not established.
- **Unverified:** evidence is insufficient.

## Security

Never commit API keys, access tokens, private exports, personal records, or secrets. Rotate any credential found in source history. A private repository is not a secret manager. Use GitHub Actions secrets or an OS credential store for runtime credentials. Public sites must be treated as public unless access control is independently tested.
