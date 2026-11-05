# Repository Consolidation Map v1
Updated: 2026-11-04
Status: architecture decision; integration work remains.

## Repository roles
| Repository | Canonical responsibility | Existing components | Boundary |
|---|---|---|---|
| MirrorCartographer/MirrorCartographer | Research, evidence, governance, shared methods | Research Method, 101-Dimension Atlas, Field Lens, relationship engine, demonstrations, FREE 2.0 core | Public research surface; never store sensitive records |
| MirrorCartographer/c (private) | Personal continuity, symbolic engine, local model execution, provenance graph | tools/ask.mjs, memory JSONL/JSON, task queue, provider adapters, neurology/engine.mjs, bounded model worker | Canonical private continuity prototype; do not publish or expose raw personal archives |
| MirrorCartographer/J (private) | Evaluation science and human judgment experiments | Human Evaluation Operations Studio, Consensus Trap | Synthetic experiment outputs are not field evidence |
| MirrorCartographer/mirror-cartographer-ui | Creative and experiential interface | 96 indexed HTML artifacts, 34 curated destinations, 79 procedural room configs, Living Atlas, workbench | Preserve creative identity; local memory is not encrypted |
 
## Canonical components discovered
1. **Model adapter:** Repository C `tools/ask.mjs` already supports local Ollama and OpenAI-compatible endpoints. It has local keyword retrieval but does not persist conversation history.
2. **Project memory:** Repository C `memory/index.json`, `memory/records.jsonl`, `memory/decisions.jsonl`, task queues, and run records establish an append-only provenance-oriented continuity architecture.
3. **Provenance graph:** Repository C `neurology/engine.mjs` validates record origin, authorship, sources, confidence, uncertainty, contradiction, support, derivation, supersession, and lineage. It is domain-provenance software, not a clinical decision engine.
4. **Model-driven patch worker:** Repository C `daemons/model_worker.py` uses an OpenAI-compatible API only when an owner-provided secret is present; it restricts edits to an allowlist and runs validation/rollback. This is not a local-model agent and inference was skipped in the last recorded run.
5. **Evaluation laboratory:** Repository J separates agreement, accuracy, confidence, evidence quality, and decision quality; its Consensus Trap is a simulation with illustrative parameters.
6. **FREE 2.0:** the new Python core provides portable decision gates and consequence trees. Integration with the existing JSONL provenance graph remains required.
7. **SQLite MirrorStore:** the new `mirror_engine/store.py` is an experimental portable storage adapter. It is not the canonical project memory and must not silently replace Repository C's append-only graph. Evaluate schema alignment, deletion semantics, encryption, and migration before adoption.
8. **Independent model:** the new PyTorch decoder-only Transformer and training entry point are the project-owned from-scratch model path. No trained checkpoint has been produced or verified.

## Integration sequence
1. Freeze schemas for provenance records, decisions, consequences, model outputs, and memory consent.
2. Write a tested adapter between FREE 2.0 objects and Repository C's provenance graph; retain the original record and link revisions.
3. Extend `tools/ask.mjs` with a project-model adapter only after checkpoint format and inference contract are stable.
4. Keep model output as unreviewed generated material until a human or external evidence source validates it.
5. Route evaluation tasks to Repository J's experiments; do not let the model grade itself without a separate reference.
6. Let the creative UI call the engine through an explicit local or authenticated API boundary; never expose model credentials in browser code.
7. Retain a provider-offline mode: memory, evidence inspection, FREE checks, and export must continue without any model.

## Non-duplication rule
Before adding a second implementation of a capability, inspect whether one exists in Repository C, J, or the UI. New code must either extend the canonical component, provide a justified alternative, or be marked experimental and scheduled for reconciliation.
