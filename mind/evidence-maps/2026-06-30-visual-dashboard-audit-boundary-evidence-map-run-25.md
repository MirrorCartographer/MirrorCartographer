# Evidence Map Run 25: Visual Dashboard Audit Boundary

Date: 2026-06-30

## Claim tested

C-VISUAL-DASHBOARD-01: Mirror Cartographer claim graphs, dependency maps, confidence-over-time displays, and proof-film dashboards can make MC evidence more trustworthy or audit-ready by making it visually navigable.

## Bottom line

Supported only as an audit-interface design rationale, not as proof of accuracy, safety, or validity.

A dashboard may improve inspection, navigation, traceability, and reviewer attention. It does not itself validate the underlying claims. A visual layer can also create false confidence if it makes weak evidence look coherent, complete, or authoritative.

## Fact / inference separation

### Facts from sources

1. NIST AI RMF is intended to help organizations manage AI risks and incorporate trustworthiness considerations into the design, development, use, and evaluation of AI systems. NIST also identifies Map, Measure, Manage, and Govern as core risk-management functions. Source: NIST AI Risk Management Framework page and AI RMF materials.

2. W3C PROV defines provenance as information about entities, activities, and people involved in producing data or things, usable for assessing quality, reliability, or trustworthiness. PROV also supports representing attribution, processing steps, derivation, versioning, procedures, and reproducibility. Source: W3C PROV Overview, 2013-04-30.

3. Visualization research, including Munzner's nested model for visualization design and validation, treats visualization design as a chain from domain problem characterization to data/task abstraction, visual encoding/interaction design, and algorithmic implementation. Validation can fail at different layers; a visually effective encoding is not equivalent to validating the domain claim.

4. Visualization literature also recognizes that visual presentation choices can affect comprehension, memory, salience, and interpretation. This creates both opportunity and risk: a visual dashboard can help reviewers find structure, but it can also over-emphasize apparent structure.

### MC-specific inferences

1. MC should use visual dashboards for audit navigation only if every visual node links back to a specific claim, evidence item, status, uncertainty label, source type, and last-review date.

2. A confidence graph should not be treated as a confidence generator. It is only a display of prior scoring decisions unless the scoring method, evidence threshold, reviewer procedure, and downgrade rules are independently specified.

3. A proof film can improve audit usability only if it exposes the same underlying evidence map, not if it replaces the map with a persuasive narrative.

4. If a dashboard makes the repository feel more coherent than the evidence warrants, the dashboard is harmful even if it is aesthetically successful.

## Evidence quality

- NIST AI RMF: high-quality governance source; supports lifecycle risk-management framing, not MC effectiveness.
- W3C PROV: high-quality provenance standard; supports traceability and provenance requirements, not dashboard validity.
- Munzner / IEEE visualization framework: high-quality visualization-design source; supports multi-layer validation of visual tools, not MC-specific outcomes.
- Visualization memorability / chartjunk literature: useful caution that visual salience is not identical to truth, completeness, or decision quality.

## Claim-status update

Previous loose assumption:

Visuals and proof films will make MC more understandable and therefore more credible.

Replacement claim:

C-VISUAL-DASHBOARD-01R: MC visual dashboards are supported as audit-interface aids only when they preserve provenance, expose uncertainty, distinguish evidence type from claim status, and are tested against non-visual baselines for audit accuracy and unsupported-confidence effects.

Status: supported audit-interface design requirement; MC implementation unvalidated.

Confidence: moderate for the governance requirement; low for any claim that dashboards improve real reviewer accuracy until tested.

## Evaluation criterion added

VISUAL-AUDIT-CRIT-01: A Mirror Cartographer dashboard must pass all of the following before it can be called audit-supporting:

1. Every node has a stable claim ID.
2. Every edge has a typed relationship: supports, contradicts, depends-on, derived-from, replaces, retires, or tests.
3. Every evidence node states source type: primary standard, peer-reviewed paper, systematic review, policy guidance, internal MC artifact, user observation, or inference.
4. Every confidence score links to the scoring rule that generated it.
5. Every visual confidence cue has an adjacent uncertainty statement.
6. No color, size, animation, or layout implies stronger evidence than the recorded claim status permits.
7. The visual artifact can be reviewed without the narrative layer.
8. The narrative layer can be reviewed without the visual artifact.
9. A reviewer can reconstruct the same claim-status decision from the underlying evidence map alone.
10. A seeded-error review is run before any public claim that the dashboard improves auditability.

## Falsification checklist

Downgrade C-VISUAL-DASHBOARD-01R if any of the following occurs:

- Reviewers become more confident after using the dashboard but do not become more accurate.
- Reviewers miss seeded contradictions more often in dashboard mode than text-only evidence-map mode.
- Visual grouping causes reviewers to infer causal or evidentiary relationships that are not explicitly encoded.
- Confidence-over-time charts are interpreted as empirical validation when they only reflect internal status updates.
- The proof-film layer persuades reviewers to accept a claim they would reject from the evidence map alone.
- A node cannot be traced back to a source, artifact, reviewer action, or inference label.

## Test plan

VISUAL-AUDIT-GATE-01

Purpose: Test whether MC visual dashboards improve audit accuracy without increasing unsupported confidence.

Materials:

- 8 existing Evidence Engine maps.
- A text-only evidence-map packet for each map.
- A dashboard/proof-film version for each map.
- 16 seeded issues distributed across the packet set:
  - unsupported inference,
  - missing source,
  - source-status mismatch,
  - overclaim,
  - hidden contradiction,
  - stale claim status,
  - untyped dependency,
  - confidence-score mismatch.

Reviewer conditions:

- Group A reviews text-only packets first.
- Group B reviews dashboard packets first.
- Cross-over after a delay, with artifact order randomized.

Metrics:

- Seeded issue detection rate.
- Correct claim-status decision rate.
- Unsupported confidence delta.
- Time to locate evidence.
- Reviewer explanation quality.
- False-positive contradiction rate.

Pass threshold:

Dashboard condition may be called audit-supporting only if:

- seeded issue detection improves by at least 15 percent or time-to-evidence decreases by at least 25 percent,
- unsupported confidence does not increase,
- claim-status accuracy does not decrease,
- reviewers can cite the underlying evidence source for at least 90 percent of their decisions.

Failure consequence:

If the dashboard improves speed or excitement but increases unsupported confidence, it must be classified as a presentation artifact, not an audit artifact.

## Implementation note

This map does not prove that MC dashboards work. It prevents the repository from treating beauty, coherence, or navigability as evidence. The visual layer earns audit status only through reviewer performance against seeded errors and explicit provenance reconstruction.

## Next proof needed

Run VISUAL-AUDIT-GATE-01 on 8 Evidence Engine maps using text-only versus dashboard/proof-film review. Publish the seeded-error key, reviewer scores, unsupported-confidence deltas, and downgrade ledger.
