# Research Tool Interoperability Gate

## Frontier scout extraction

Scientific AI is moving from single-answer assistants toward auditable research workbenches and agent workflows that integrate literature search, notebooks, code execution, analysis environments, and provenance logs. At the same time, longitudinal health AI, privacy-preserving memory, and veterinary AI infrastructure remain blocked by weak data provenance, fragmented tools, and benchmark gaps.

## Actionable design implication

Mirror Cartographer should not promote a biomedical, veterinary, neuroscience, mechanistic-biology, or scientific-AI claim into reusable discovery memory unless the claim can name the research tools and execution environments needed to reproduce or audit the claim path.

This gate converts that requirement into a packet-level schema and validator. It is not medical or veterinary advice. It organizes research evidence and implementation readiness.

## Gate requirement

A packet must declare:

- source status
- claim status
- privacy status
- missingness
- revision reason
- implementation status
- evidence strength
- falsification route
- next executable action
- toolchain components
- data boundary
- execution environment
- provenance log
- human review role
- blocked inferences

## Source map

| Source | Source status | Relevant signal | Claim status |
|---|---|---|---|
| Cornell CVM animal-health benchmark program | Clinical/research institution | Veterinary AI lacks standardized high-quality benchmark datasets across veterinary domains. | Infrastructure gap |
| LifeBench 2026 | Preprint / benchmark with public code claim | Long-horizon multi-source memory remains difficult; reported top systems reached 55.2% accuracy. | Benchmark signal, caveated |
| Agent-Memory Protocol 2026 | Peer-reviewed proceedings | Agent memory architectures need privacy-aware protocols because persistent context can leak identifiers and confidential traces. | Privacy architecture signal |
| Claude Science public beta coverage | Current platform/news signal, secondary source | Scientific AI tools are being packaged as workbenches integrating PubMed, Jupyter, R, local infrastructure, logs, and explanations. | Workflow trend, secondary |
| NVIDIA synthetic benchmark workflow | Industry method note | Privacy-preserving synthetic evaluation can support healthcare-like benchmarks without exposing real records. | Reproducible-method signal |

## Labels

- source_status: mixed public sources; primary/research-institution preferred where available; secondary platform coverage caveated
- claim_status: implementation requirement, not biological or clinical claim
- privacy_status: public-safe synthetic only
- missingness: no private patient, animal, or user records; no live clinical validation; no direct tool execution against protected datasets
- revision_reason: prior gates checked claims, provenance, consent, and workflow reconstruction, but did not require explicit toolchain interoperability
- implementation_status: schema, validator, fixtures, and regression tests added
- evidence_strength: moderate; strong for infrastructure gap and privacy/memory need, weaker for platform-specific workbench trend because source is secondary
- falsification_route: reject or revise if packets passing this gate cannot be independently reconstructed by a reviewer using the declared tools, environment, source map, and provenance log
- next_executable_action: run `python tools/research_tool_interoperability_gate/test_validate_research_tool_interoperability_packet.py`

## Prototype requirement

Discovery-memory promotion UI should show a compact interoperability strip:

`source -> data boundary -> toolchain -> execution environment -> provenance log -> reviewer role -> falsification route`

If any segment is missing, the packet remains research-draft only.
