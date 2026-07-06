# Proxy Endpoint Separation Gate

## Purpose

Mirror Cartographer needs to distinguish a short-term proxy signal from a validated cure/discovery endpoint. This gate prevents generated claims from entering discovery memory when they collapse:

- short-term signal into durable outcome,
- correlation into mechanism,
- symptom movement into cure,
- observation into clinical/veterinary advice,
- plausible narrative into falsifiable longitudinal evidence.

This is research-organization infrastructure only. It is not medical or veterinary advice.

## Frontier signal

Current frontier work points toward longitudinal, multimodal, privacy-preserving, and workflow-valid evaluation rather than isolated answer correctness.

Source map:

1. Stanford HAI, `Advancing Responsible Healthcare AI with Longitudinal EHR Datasets` — highlights longitudinal EHR benchmarks including EHRSHOT, INSPECT, and MedAlign for healthcare AI evaluation.
2. `Longitudinal big biological data in the AI era` — argues that AI can connect health, disease, genes, transcripts, proteins, metabolites, microbiome, diet, toxins, and disease progression through longitudinal biological data.
3. Cornell University College of Veterinary Medicine, `From Data to Animal Health: Building Benchmarks for AI-Driven Veterinary Innovation` — states veterinary AI has benchmark and data-infrastructure challenges from species diversity, varied data modalities, ethics, and regulatory differences.
4. `LABBench2` — frames scientific AI evaluation around methodological appropriateness and relevance, not only answer recall.
5. `Position: Real-World Clinical AI Requires Multimodal, Longitudinal, and Privacy-Preserving Corpora` — argues for multimodal longitudinal healthcare corpora and heterogeneous data architecture.

## Design implication

MC should require every cure/discovery-adjacent packet to name both:

- **Proxy signals**: early, indirect, short-window, noisy, or context-sensitive observations.
- **Target endpoints**: durable, decision-relevant, longer-window outcomes with promotion thresholds.

Memory promotion is blocked unless the packet includes endpoint windows, confounders, review requirements, and falsification logic.

## Acceptance criteria

A valid packet must include:

- at least one proxy signal,
- at least one target endpoint,
- different proxy and endpoint windows,
- a reason the endpoint needs a longer window,
- at least one confounder,
- explicit review requirement,
- research-only scope boundary for advice-like claims,
- falsification route with reject or revise conditions before promotion.

## Run

```bash
python tools/proxy_endpoint_separation_gate/validate_proxy_endpoint_packet.py tools/proxy_endpoint_separation_gate/fixtures.synthetic.json
python tools/proxy_endpoint_separation_gate/test_validate_proxy_endpoint_packet.py
```

## Labels

Source status: public frontier scan plus synthetic implementation.
Claim status: discovery-infrastructure evaluation criterion, not medical/veterinary advice.
Privacy status: public-safe synthetic only.
Missingness: no production corpus, curator labels, or CI wiring yet.
Revision reason: prevent short-window proxy movement from being stored as durable cure/discovery evidence.
Implementation status: schema, fixtures, validator, tests, and source map committed.
Evidence strength: moderate; convergent from longitudinal health AI, scientific-agent evaluation, and veterinary benchmark infrastructure.
Falsification route: revise if curator review shows proxy/endpoint separation does not reduce unsupported discovery-memory promotion or blocks useful research packets.
Next executable action: wire this validator after hypothesis generation and before discovery-memory admission.
