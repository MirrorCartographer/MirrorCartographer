# Mirror Cartographer Engine Mesh v1

**Status:** integration contract and inventory; runtime orchestration is not yet implemented.  
**Date:** 2026-11-11  
**Owner / project direction:** Charity Alessandra Sturgell  
**Purpose:** connect the project's existing engines through explicit contracts without flattening them into one application or claiming unfinished integrations are live.

## 1. The design

Mirror Cartographer is a coordinated system, not one model. Each engine owns a bounded responsibility. The mesh routes work between them, preserves source lineage, and makes the state of every connection inspectable.

The intended path is:

`Experience → Request envelope → Permission gate → Orchestrator → Specialist engines → Verification → Provenance → Human decision → Experience`

A request may use one engine or a sequence. The orchestrator selects engines by declared capability, not by name, popularity, or an unrestricted model decision.

## 2. Engine responsibilities

| Engine | Responsibility | Existing evidence | Integration state |
|---|---|---|---|
| Living Atlas / UI | Human-facing experiences, rooms, navigation and controls | UI source, room engine, workbench, documented release checks | UI exists; each route still needs its own current live check |
| Mirror Cartographer Network | Owner-scoped identity, shared-world services and provenance API | API client, provenance record/link/contradiction/output actions, provider observatory source | Client and server code exist; current production availability is not verified here |
| LYR | Language and symbolic interpretation; provider routing | CLI bridge supports local Ollama and compatible remote providers; local retrieval and optional Network retrieval | Bridge exists; no verified trained LYR checkpoint; not integrated into the website conversation path |
| FREE 2.0 | Proposal registration, consequence mapping, integrity gates and human-review decisions | Deterministic Python core and specification | Executable local core; no production service adapter |
| Mirror Engine | Evidence records, links, contradictions and model-output receipts | SQLite store with export/import shape | Local prototype; not encrypted at rest; not approved for sensitive personal records |
| Relationship Engine / ARC research | Candidate relationships and structural bridge exploration | Tested relationship-engine artifact and research demonstrations | Narrow tools exist; no general cross-engine ARC service is established |
| Human Judgment Lab | Rubric design, calibration, agreement, reliability and evaluation operations | Interactive lab and reproducible synthetic Consensus Trap experiment | Executable research environment; synthetic evidence only, no field validation |
| Compute Mesh | Bounded workers, node identity, signed manifests/receipts, resource limits and execution | Private-workspace implementation and reported local test results | Code exists; enrollment, multi-device communication, recovery and production deployment remain incomplete |
| Domain research engines | Specialized workflows such as neurological evidence/provenance analysis | Local neurology engine and tests in the private workshop | Research prototype; not a clinical system or medical-device workflow |
| Business Value Engine | Opportunity discovery, service design, pricing, unit economics, funding fit and reinvestment | The business architecture and historical Tech Growth Strategy define the method | Design layer only; no executable opportunity/pricing engine yet |

The machine-readable registry is `engine-registry.v1.json`. It deliberately distinguishes implemented code, local tests, deployment verification, and planned connections.

## 3. Shared request envelope

Every adapter must accept a versioned request envelope and return a versioned result envelope. The first implementation may use JSON over local process boundaries or authenticated HTTPS; transport must not change the meaning of the contract.

Required request fields:

- `schema`: `mc.engine-request.v1`
- `request_id`: unique stable identifier
- `created_at`: ISO-8601 timestamp
- `requested_capability`: capability name from the registry
- `purpose`: user-visible reason for processing
- `actor`: user, authorized operator, or system process
- `inputs`: typed references or bounded payloads
- `permissions`: purpose, scope, retention and sharing authorization
- `constraints`: safety, time, cost and resource limits
- `provenance_refs`: source record identifiers; empty when there are none

Required result fields:

- `schema`: `mc.engine-result.v1`
- `request_id`: the originating request
- `engine_id` and `engine_version`
- `status`: `completed`, `needs_review`, `blocked`, `failed`, or `not_configured`
- `outputs`: typed result objects
- `provenance_refs`: records used or created
- `limitations`: what the result cannot establish
- `review_state`: `unreviewed`, `human_reviewed`, or `rejected`

No adapter may silently discard an unknown required field, upgrade an unreviewed model output to evidence, or turn missing data into a negative finding.

## 4. Routing and hand-offs

### A. Interpret and retrieve
The interface sends the user's explicit request and purpose. The permission gate classifies data and checks whether the requested operation is allowed. Retrieval may use an approved local MirrorStore or the owner-scoped Network API. Network synchronization is explicit and preview-first.

### B. Invoke specialist capability
LYR may draft or transform language. Research/relationship tools may propose candidate links. Domain engines may run their bounded workflow. The orchestrator must record which engine and version actually ran.

### C. Apply decision integrity
When a workflow proposes a consequential intervention, FREE evaluates the proposal's authority, owner, baseline, outcomes, stop conditions, rollback, data plan and unresolved consequences. FREE can block or return a proposal for revision; it cannot authorize a high-impact decision on a person's behalf.

### D. Evaluate the system
Human Judgment Lab can evaluate outputs against a declared rubric. Synthetic tests remain synthetic. Human evaluation is separate from model self-assessment; agreement is not proof of accuracy.

### E. Preserve and return
Results are stored as unreviewed provenance records unless an authorized human explicitly reviews them. The interface receives the result, evidence links, limitations and next available actions.

## 5. Non-negotiable boundaries

1. **Consent is purpose-specific.** A user allowing one task does not authorize unrelated reuse, sharing, training or publication.
2. **Sensitive data is excluded by default.** Health, veterinary, financial, benefits, identity and other restricted data must not be sent to model providers or shared services without a reviewed, explicit data path and appropriate protections.
3. **No silent synchronization.** Local-to-network transfer requires preview, record-level approval and an explicit apply action.
4. **No autonomous high-impact decisions.** Models and engines can prepare evidence and recommendations; authorized humans or institutions retain decision authority.
5. **No false model claims.** The resident deterministic dialogue runtime is not a trained LYR model. A CLI adapter is not proof of a trained checkpoint.
6. **No false validation claims.** Unit tests, synthetic experiments, operational smoke checks and field validation are different evidence classes.
7. **No false availability claims.** A source route or configured endpoint is not proof that the deployed service is healthy.
8. **Fail closed.** Missing credentials, permissions, schemas, required evidence or resource budget block the relevant action; they do not trigger an unapproved fallback.
9. **Reversibility and audit.** Mutations need an actor, timestamp, reason, prior state and recovery path.
10. **Data minimization.** Pass references and the smallest required payload, not entire archives or unrelated personal records.

## 6. Business Value Engine: how the system sustains the free world

This is the business-building method we developed: inspect the whole environment, identify valuable unmet needs, combine existing capabilities, design a deliverable, measure its value and delivery cost, then reinvest the surplus. It is a proposed orchestration capability, not a software engine that currently runs by itself.

Its lifecycle is:

1. **Discover** — map real problems, affected people, current workarounds and existing resources.
2. **Compose** — select engines and partners that can solve a bounded part of the problem.
3. **Validate** — test whether the result improves a measurable outcome; preserve uncertainty and negative results.
4. **Package** — define the buyer, deliverable, scope, service boundary, price and support obligation.
5. **Deliver** — execute with permissions, named owners, evidence and human review.
6. **Measure** — calculate value delivered, cost to serve, quality, repeatability and risks.
7. **Reinvest** — direct a defined share of earned revenue or grant funding into the free public layer and the next validated capability.

The public creative and learning experience can remain free. The revenue-bearing layer should sell institutional capability, not access to a person's inner life.

Potential paid offerings, subject to validation:

- **Evaluation operations:** rubric design, human evaluation programs, calibration and decision-ready evaluation packets.
- **Evidence and provenance infrastructure:** auditable records, source lineage, contradiction tracking and research workflows.
- **Private institutional deployments:** controlled environments, integrations, administration, support and service-level commitments.
- **Research and implementation partnerships:** scoped pilots with measurable baselines, stop conditions and public-interest outcomes.
- **Specialist workflow engineering:** carefully bounded integrations for organizations that need evidence-aware case or service workflows.

Potential funding routes include research grants, public-interest contracts, institutional pilots and carefully selected investment. The first commercial proof should be a paid or funded pilot with a named buyer, a measurable problem, a baseline, an agreed deliverable and a documented cost to serve.

Do not monetize private user records, sell sensitive inferences, gate essential public access behind engagement, or promise clinical/veterinary capability before qualified validation and integration exist.

## 7. Build order

1. **Registry and contract** — this document and the JSON registry; validate names, capabilities, dependencies and evidence states.
2. **Adapter harness** — common request/result schemas, timeouts, error states, capability discovery and deterministic tests.
3. **First safe end-to-end path** — UI request → permission check → approved provenance retrieval → one specialist engine → unreviewed result receipt → UI display.
4. **FREE hand-off** — route consequential proposals through FREE; require human review and explicit stop/rollback details.
5. **Evaluation hand-off** — export bounded, de-identified test packets to Human Judgment Lab; preserve synthetic/field labels.
6. **Worker execution** — connect Compute Mesh only after node enrollment, signed job manifests, resource ceilings, cancellation, receipts and recovery are tested.
7. **Domain integrations** — medical and veterinary connections only through authorized provider APIs, explicit consent, appropriate security, qualified partners and workflow validation.
8. **Commercial proof** — select one institutional pilot, validate value and delivery cost, then decide whether to grant-fund, license or raise capital.

## 8. What this change does and does not do

This first mesh change creates the canonical inventory, shared interface contract, routing policy and a validator. It does **not** make every engine call every other engine, deploy a new backend, train LYR, encrypt the local SQLite store, connect medical/veterinary records, or establish a revenue stream. Those are separate implementation and verification gates.

The next engineering deliverable is the adapter harness and one complete, safe, observable end-to-end path—not another collection of disconnected dashboards.
