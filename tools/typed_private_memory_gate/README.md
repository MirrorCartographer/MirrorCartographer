# Typed Private Memory Gate

## Frontier scout result

Reusable discovery memory should not store raw sensitive human-health, animal-health, identity, household, location, or longitudinal context. It should also not destroy all semantics through blunt masking. This gate tests a middle path: convert sensitive spans into typed placeholders, preserve the research-useful relation structure, require local-only restoration, and block retrieval when the memory is not task-appropriate.

## Actionable design implication

MC discovery memory needs a typed private-memory admission layer before any longitudinal health, animal-health, mechanistic-biology, neuroscience, HCI, or personal-context packet is promoted into reusable memory.

A packet is admissible only when it includes:

1. no raw sensitive memory in reusable storage;
2. typed placeholders for sensitive spans;
3. a semantic utility plan explaining what remains useful after sanitization;
4. a local restoration boundary proving the cloud-side packet cannot restore private values;
5. a query-conditioned retrieval gate to prevent cross-domain leakage and tool-action drift;
6. an audit trace and falsification route.

## Source map

| Source | Status | Why it matters |
|---|---:|---|
| MemPrivacy: Privacy-Preserving Personalized Memory Management for Edge-Cloud Agents, arXiv 2605.09530, May 10 2026 | preprint with clear caveat | Introduces privacy-sensitive span detection, semantically structured type-aware placeholders, local restoration, and MemPrivacy-Bench. |
| Beyond Similarity: Trustworthy Memory Search for Personal AI Agents, arXiv 2606.06054, June 4 2026 | preprint with clear caveat | Frames memory search as a trust boundary; supports query-conditioned admission before retrieved memory reaches an agent. |
| SuperLocalMemory, arXiv 2603.02240, February 17 2026 | preprint/open-source claim with caveat | Supports local-first memory, provenance, poisoning defense, and GDPR erasure as memory-system requirements. |
| SplitAgent, arXiv 2603.08221, March 9 2026 | preprint with clear caveat | Supports context-aware dynamic sanitization rather than one-size-fits-all masking. |
| DICOM De-Identification via Hybrid AI and Rule-Based Framework, arXiv 2507.23736, July 31 2025 | preprint with clear caveat | Shows uncertainty-aware redaction and human verification as release requirements for medical data. |
| HIPAA de-identification concepts / Safe Harbor and Expert Determination | institutional/legal background | Useful boundary model for de-identification; this repository does not claim legal compliance. |

## Labels

- Source status: public frontier scan, preprints with caveats, institutional/legal background, and synthetic fixtures.
- Claim status: infrastructure hypothesis and evaluation criterion; not medical or veterinary advice.
- Privacy status: public-safe implementation with synthetic fixtures only.
- Missingness: no real production corpus, curator labels, legal review, or CI wiring yet.
- Revision reason: frontier agent-memory work points to a privacy/utility failure mode: raw memory leaks private context, while blunt masking destroys useful relational structure.
- Implementation status: schema, validator, synthetic valid/invalid fixtures, regression tests, and source map committed.
- Evidence strength: moderate; mostly preprint-level, but directionally aligned across independent memory-safety and de-identification work.
- Falsification route: revise or remove if typed placeholders do not reduce leakage, if retrieval utility drops below blunt masking, or if curator review shows cross-domain leakage persists.
- Next executable action: run `python tools/typed_private_memory_gate/test_validate_typed_private_memory_packet.py`, then wire this gate before reusable discovery-memory writes.

## Prototype requirement

Any discovery-memory promotion pipeline should call this gate after evidence/provenance validation and before durable memory write. Health or animal-health packets must remain research-organization packets unless reviewed by domain experts; the validator must not convert observations into diagnosis, treatment, or cure claims.
