# Evidence Map: Reviewable Symbolic Output Boundary

Date: 2026-06-29
Status: New evidence map
Claim ID: R-REVIEWABLE-SYMBOLIC-01
Related domains: Mirror Cartographer evaluation, symbolic cognition, auditability, human-AI review

## Claim tested

Mirror Cartographer assumes that symbolic outputs can be externally reviewed, audited, and improved by someone other than the original user.

This is a weak point because many MC outputs are intentionally symbolic, metaphorical, embodied, and context-sensitive. That gives the system expressive power, but it also creates an evaluation risk: the output may feel meaningful to the original user while being too private, ambiguous, or under-specified for independent review.

## Claim status update

Previous status: implicit architectural assumption.

New status: partially supported as an evaluation requirement, not proven as an MC capability.

Reason: high-quality AI governance and measurement sources support traceability, documentation, provenance, stakeholder review, lifecycle risk management, and explicit evaluation criteria. Inter-rater reliability literature supports the need to test whether multiple reviewers can apply the same labels or judgments consistently. None of these sources prove that MC symbolic outputs are currently reviewable.

## Evidence found

### Source 1: NIST AI RMF 1.0 and NIST AI RMF program page

NIST describes the AI RMF as a framework for improving the ability to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems. This supports MC treating reviewability as part of evaluation and risk management, not as an optional documentation afterthought.

Source: https://www.nist.gov/itl/ai-risk-management-framework

### Source 2: NIST AI 600-1 Generative AI Profile, July 2024

NIST's generative AI profile emphasizes governance, content provenance, pre-deployment testing, and incident disclosure. It also distinguishes risks that are empirically demonstrated from risks that remain speculative or uncertain. This supports labeling MC's symbolic-output reviewability as unproven until tested directly.

Source: https://doi.org/10.6028/NIST.AI.600-1

### Source 3: Inter-rater reliability methods

Inter-rater reliability is the degree of agreement among independent observers rating or coding the same phenomenon. Assessment tools that rely on ratings need adequate inter-rater reliability or the ratings are not valid tests. Common methods include Cohen's kappa, Fleiss' kappa, Krippendorff's alpha, intraclass correlation, and agreement/disagreement analysis.

Source: Cohen, J. 1960. A coefficient of agreement for nominal scales.
Source: Fleiss, J. L. 1971. Measuring nominal scale agreement among many raters.
Source: Krippendorff, K. Content Analysis: An Introduction to Its Methodology.
Source overview: https://en.wikipedia.org/wiki/Inter-rater_reliability

### Source 4: Explainability and traceability in generated design artifacts

Recent requirements-engineering research finds that AI-generated design artifacts without adequate explainability require extensive manual validation, reduce stakeholder trust, and create compliance risk in regulated contexts. This supports the narrower inference that MC artifacts should contain source tracing and justification when they are meant to guide decisions or be reused outside the original conversation.

Source: Shah, S. T. U., Hussein, M., Barcomb, A., & Moshirpour, M. 2025. Explainability as a Compliance Requirement: What Regulated Industries Need from AI Tools for Design Artifact Generation. https://arxiv.org/abs/2507.09220

## Fact vs. inference

### Facts

1. NIST treats AI trustworthiness as a lifecycle risk-management problem across design, development, use, and evaluation.
2. NIST's generative AI profile explicitly includes governance, content provenance, pre-deployment testing, and incident disclosure as primary considerations.
3. Inter-rater reliability is a recognized way to test whether independent observers can apply ratings or labels consistently.
4. For ambiguous rating tasks, clear scoring guidelines reduce drift and bias and improve reliability.
5. AI-generated artifacts that lack traceability can increase manual validation burden and reduce stakeholder confidence in safety-critical or regulated workflows.

### Inferences

1. MC symbolic outputs should not be considered architecturally mature unless another person can identify what the output claims, what it only symbolizes, what evidence it used, and what uncertainty remains.
2. A symbolic artifact that cannot survive independent review may still be personally meaningful, but should not be used as evidence, diagnosis, decision support, or public proof.
3. MC needs a reviewability layer that preserves aesthetic/symbolic richness while preventing private resonance from being mistaken for external validity.
4. External reviewability should be measured before MC claims that a symbolic artifact is transferable, reusable, or convincing to outsiders.

## Requirement added

### R-REVIEWABLE-SYMBOLIC-01

Every MC artifact intended for external use must include enough structure for an independent reviewer to distinguish:

- observed user-provided material,
- symbolic interpretation,
- model inference,
- evidence-grounded claim,
- uncertainty,
- possible alternative interpretations,
- intended use,
- prohibited use.

If an artifact cannot meet this requirement, it may remain a private reflection artifact but must not be treated as external proof.

## Evaluation criterion added

### REVIEWABLE-SYMBOLIC-01

Given an MC symbolic output and its review card, three independent reviewers should be able to answer the following without conversation context:

1. What did the user explicitly provide?
2. What did MC infer?
3. What is metaphorical rather than factual?
4. What claim, if any, is evidence-grounded?
5. What remains unknown?
6. What decisions should this artifact not be used for?
7. What would falsify or weaken the interpretation?

Minimum pass condition for external-use artifacts:

- At least 80% raw agreement on the seven review questions, and
- no critical disagreement on whether a statement is factual, inferred, or symbolic.

Stronger validation target:

- Use Cohen's kappa for two reviewers or Fleiss'/Krippendorff-style agreement for three or more reviewers once enough artifacts exist.
- Require agreement analysis by label type: factual, inferred, symbolic, uncertain, contraindicated.

## Test plan

### Phase 1: Artifact selection

Select 10 existing MC outputs:

- 3 symbolic/body maps,
- 2 public-facing MC descriptions,
- 2 AI opportunity proof artifacts,
- 2 evidence maps,
- 1 aesthetic/visual symbolic artifact.

### Phase 2: Apply review card

For each artifact, create a Reviewability Card with:

- explicit source material,
- claim inventory,
- symbol inventory,
- inference inventory,
- evidence links,
- uncertainty list,
- non-use boundaries,
- falsification hooks.

### Phase 3: Independent review

Ask at least three reviewers, human or model-assisted but independently prompted, to classify each sentence or claim as:

- Reported,
- Inferred,
- Symbolic,
- Evidence-grounded,
- Unsupported,
- Unknown,
- Contraindicated.

### Phase 4: Score

Measure:

- agreement on label categories,
- disagreements involving factual vs symbolic status,
- number of claims that reviewers cannot classify,
- number of claims requiring original conversation context,
- number of claims that appear more certain than evidence permits.

### Phase 5: Decision

If review fails, the artifact must be either:

- rewritten with clearer boundaries,
- downgraded to private reflection only,
- split into symbolic and factual layers,
- or added to the Negative Result Ledger.

## Falsification checklist

This claim should be weakened or rejected if:

- independent reviewers cannot reliably distinguish factual, inferred, and symbolic content;
- reviewers need access to the entire conversation history to understand the artifact;
- symbolic language consistently causes reviewers to overestimate factual support;
- the Reviewability Card strips away so much meaning that the artifact no longer performs its intended reflective function;
- reviewability scores do not predict better external comprehension, safer reuse, or better decision calibration.

## Design implication

MC should preserve two output modes:

1. Private symbolic mode: optimized for personal resonance, atmosphere, metaphor, and orientation.
2. External review mode: optimized for auditability, claim separation, evidence status, and falsifiability.

The same artifact may have both layers, but they must not be collapsed.

## Next proof needed

Create review cards for five existing MC artifacts and run a three-reviewer classification test.

The immediate proof question is not whether reviewers like the artifacts. The proof question is whether reviewers can tell what is factual, what is inferred, what is symbolic, and what must not be used as evidence.
