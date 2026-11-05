# Repository Consolidation Map v1
Updated: 2026-11-04
Status: architecture decision; integration work remains.

## Repository roles
| Repository class | Canonical responsibility | Integration boundary |
|---|---|---|
| Public research repository | Research, evidence, governance, shared methods, FREE 2.0 | Public research surface; never store sensitive records |
| Private continuity/model workspace | Personal continuity, symbolic engine, local model execution, provenance graph | Private data boundary; do not publish raw personal archives |
| Private evaluation laboratory | Evaluation science and human judgment experiments | Synthetic experiment outputs are not field evidence |
| Public creative UI repository | Creative and experiential interface | Preserve creative identity; local memory is not encrypted |

## Canonical components discovered
1. A provider adapter exists in the private continuity workspace for local Ollama and OpenAI-compatible endpoints. It has local keyword retrieval but does not persist conversation history.
2. An append-only provenance graph exists with record types, origin/authorship, source locators, confidence, uncertainty, contradiction, support, derivation, supersession, and lineage.
3. A bounded model-driven patch worker exists with an explicit file allowlist, validation, and rollback. It uses an OpenAI-compatible API only when an owner-provided secret is present; model inference was not verified in the latest recorded run.
4. A separate evaluation laboratory contains a human-evaluation operations studio and a consensus-bias simulation. Synthetic parameters are not empirical evidence.
5. The public creative UI repository contains a large indexed set of HTML experiences, curated destinations, procedural room configurations, local memory experiments, and automated release checks.
6. FREE 2.0's new Python core provides portable decision gates and consequence trees. Integration with the existing JSONL provenance graph remains required.
7. The new SQLite MirrorStore is an experimental portable storage adapter. It is not the canonical project memory and must not silently replace the existing append-only graph.
8. The new PyTorch decoder-only Transformer and training entry point are the project-owned from-scratch model path. No trained checkpoint has been produced or verified.

## Integration sequence
1. Freeze schemas for provenance records, decisions, consequences, model outputs, and memory consent.
2. Maintain a tested adapter between FREE 2.0 objects and the existing provenance graph; retain original records and link revisions.
3. Extend the existing provider adapter with a project-model adapter only after checkpoint format and inference contract are stable.
4. Keep model output as unreviewed generated material until a human or external evidence source validates it.
5. Route evaluation tasks to the independent evaluation laboratory; do not let the model grade itself without a separate reference.
6. Let the creative UI call the engine through an explicit local or authenticated API boundary; never expose model credentials in browser code.
7. Retain a provider-offline mode: memory, evidence inspection, FREE checks, and export must continue without any model.

## Non-duplication rule
Before adding a second implementation of a capability, inspect whether one exists in a private or public project repository. New code must either extend the canonical component, provide a justified alternative, or be marked experimental and scheduled for reconciliation.
