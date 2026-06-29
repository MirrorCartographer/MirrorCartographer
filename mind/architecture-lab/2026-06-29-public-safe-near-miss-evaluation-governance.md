# Public-Safe Near-Miss Evaluation Governance

Date: 2026-06-29
Status: architecture note / evaluation governance pattern
Scope: public-safe Mirror Cartographer architecture research

## Architecture question

How should MC create synthetic near-miss evaluation cases for agency-boundary testing while keeping the corpus public-safe and non-instructional?

## Research basis

Current sources reviewed:

1. DarkPatterns-LLM, arXiv, 2025-12-29: useful because it treats problematic AI influence as multi-layer behavior rather than a single binary label.
2. DarkBench, OpenReview: useful because it shows that evaluation suites can group behavior by recurring risk categories instead of relying on isolated examples.
3. NIST AI RMF Generative AI Profile, NIST AI 600-1, 2024-07-26: useful because it frames evaluation as part of lifecycle risk management.
4. OpenAI external red-teaming process paper, arXiv, 2025-01-24: useful because it separates risk taxonomy, expert review, system evaluation, and reporting.
5. Cloud Security Alliance Agentic NIST AI RMF Profile, 2026: useful because agentic systems add memory, tool-use, autonomy, and live-environment risks.
6. Cloud Security Alliance NIST AI Agent Security red-teaming note, 2026-03-31: useful because agent evaluations must consider memory, tools, indirect influence, and supply-chain paths.
7. OWASP GenAI / LLM risk framing: useful because prompts, memory, retrieval, tools, outputs, and downstream action must be treated as a connected risk surface.

## What changed in understanding

MC should not build a vivid library of risky symbolic or emotional interaction examples. It should build a public-safe evaluation corpus made from bland, abstract, near-identical cases where the only meaningful difference is the agency boundary being tested.

The evaluation unit is the boundary shift, not the dramatic content.

## Design pattern added

Name: Public-Safe Delta Case

Intent: Test whether MC can distinguish Helpful, Caution, Suspect, and Blocked agency states without storing private material or creating reusable harmful examples.

Core idea: each test case should describe a neutral interaction structure, the agency capacity being tested, the expected label, and the observable reason for the label. It should not preserve emotionally persuasive wording.

## Case schema

```yaml
case_id: MC-PSDC-0001
case_type: near_miss_delta
public_safety_level: abstract_only
domain: symbolic | emotional | practical | memory | retrieval | recommendation | export
agency_capacity_tested:
  - choice
  - exit
  - uncertainty
  - future_influence
  - privacy
  - social_boundary
boundary_shift: brief abstract description of what changes between the paired cases
expected_label: Helpful | Caution | Suspect | Blocked
observable_basis:
  - reason visible from the interaction envelope
receipt_expectation:
  store: true_or_false
  retrieve: true_or_false
  influence: true_or_false
  transmit: true_or_false
redaction_required:
  - no private symbols
  - no names
  - no health facts
  - no relationship facts
  - no precise biography
misuse_guard: explanation of why the case is non-instructional
review_status: draft | reviewed | retired
```

## Requirements update

1. Near-miss cases must be abstract-first.
2. Cases must avoid private or emotionally identifying material.
3. Cases must test one boundary shift at a time.
4. Cases must include receipt expectations for store, retrieve, influence, and transmit.
5. Cases must record observable rationale only.
6. Cases must include a misuse guard before public publication.
7. Cases should be boring enough that they test architecture rather than persuasive writing.
8. Cases should be paired when possible so reviewers compare boundary shifts instead of reacting to style.

## Prototype plan

Phase 1: create 12 abstract cases.

- 3 symbolic interpretation cases
- 3 emotional reflection cases
- 2 memory / future influence cases
- 2 recommendation or ranking cases
- 2 export / social transmission cases

Phase 2: have each case independently labeled by at least two reviewers or model passes.

Phase 3: route disagreements through the existing agency-label adjudication protocol.

Phase 4: retire or rewrite any case that depends on dramatic wording rather than observable agency structure.

## Durable implementation target

Add a future folder:

`mind/evaluation/public-safe-delta-cases/`

Each case should be stored as one YAML file. A separate index should summarize coverage by domain, agency capacity, expected label, and receipt expectation.

## Next research question

How should MC measure reviewer agreement on `Caution` vs `Suspect` labels without turning symbolic reflection into rigid compliance scoring?
