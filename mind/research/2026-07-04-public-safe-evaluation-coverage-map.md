# Public-Safe Evaluation Coverage Map

## Core finding

Mirror Cartographer needs a **Public-Safe Evaluation Coverage Map**: a registry that proves each public-facing method, requirement, interface claim, research question, and implementation plan has at least one evaluation path that does not depend on private source material.

Operating line: **A public-safe system is not sufficiently protected by redaction alone; it also needs evaluability after redaction, so the public artifact can be tested without reusing, exposing, or reconstructing private context.**

## Source status

- Source class: private-context-informed architecture synthesis; repository-facing abstract method note.
- Source boundary: private chats, saved context, and prior MC research notes may inform the need for the control, but no private transcript, household fact, health detail, animal-care detail, financial detail, relationship detail, location detail, credential, identifying timeline, or raw example is included here.
- Repository status: intended for the private MirrorCartographer mind/research area as a public-safe architecture note.
- External source status: not source-bound to external publications in this note; it is an internal product-governance requirement derived from repeated public-safety constraints.

## Claim status

- Claim type: product requirement and evaluation-governance proposal.
- Claim strength: design recommendation, not empirical proof.
- Claim allowed publicly: yes, if kept at method/protocol level.
- Claim not allowed publicly: any statement implying that specific private material was tested, failed, passed, or motivated a named example.

## Privacy status

- Privacy classification: public-safe abstraction.
- Exposure risk: medium if implemented with real private examples; low if implemented only with synthetic, generalized, or formally generated fixtures.
- Redaction requirement: all evaluation fixtures must be source-bound as synthetic, public-domain, permissioned, or internal-private-nonpublishable.
- Rehydration risk: high if test names, fixture topology, variable order, symbolic labels, or scenario combinations mirror private source shape.

## Missingness

- Missing concrete fixture suite for each MC output class.
- Missing machine-readable coverage schema.
- Missing CI check that blocks public artifacts with no safe evaluation path.
- Missing distinction between evaluation that verifies privacy safety and evaluation that verifies product usefulness.
- Missing review path for cases where an artifact is safe to describe but unsafe to demonstrate.

## Required coverage dimensions

Each public-safe artifact should be mapped against these dimensions before publication:

1. **Source boundary coverage**
   - Can the artifact identify whether it came from public sources, private-context-informed synthesis, repository materials, synthetic examples, or mixed sources?
   - Does it state which source classes are not allowed to appear in evidence?

2. **Claim boundary coverage**
   - Is the artifact labeled as observation, hypothesis, requirement, method, evaluation criterion, implementation plan, or open question?
   - Does the claim level match the available evidence?

3. **Privacy boundary coverage**
   - Does the artifact avoid direct personal facts?
   - Does it avoid indirect reconstruction through sequence, metaphor, topology, specificity, or example shape?

4. **Evaluation coverage**
   - Can the artifact be tested with public-safe fixtures?
   - Are those fixtures synthetic or otherwise safe to publish?
   - Does the evaluation still mean something after private material is removed?

5. **Revision coverage**
   - Is there a reason for the note?
   - Is the revision reason stated without revealing the private source that created the need?

## Proposed schema

```yaml
artifact_id: string
artifact_title: string
artifact_type: method | requirement | research_question | evaluation_criterion | implementation_plan | index | interface_contract
source_status:
  class: public | private_context_informed | repository | synthetic | mixed
  publishable_evidence: yes | no | partial
  forbidden_source_classes: []
claim_status:
  class: observation | hypothesis | requirement | method | evaluation | plan | open_question
  strength: low | medium | high
  demotion_path: string
privacy_status:
  class: public_safe | internal_only | needs_review | unsafe
  reconstruction_risk: low | medium | high
  unsafe_detail_classes: []
evaluation_status:
  has_public_safe_fixture: true | false
  fixture_source: synthetic | public | permissioned | none
  test_type: redaction | inference | interface | claim_strength | usefulness | regression
missingness:
  known_gaps: []
  blockers: []
revision:
  reason: string
  meaningful_change: string
```

## Evaluation criteria

A note passes the Public-Safe Evaluation Coverage Map only if:

- It can be evaluated without exposing private examples.
- It labels claim strength and source class.
- It includes a demotion path when evidence is weak or private-only.
- It separates privacy-safety evaluation from usefulness evaluation.
- It names missingness without pointing back to private facts.
- It avoids fixtures whose scenario structure could reveal private-context shape.

## Implementation plan

1. Add a `public_safety_coverage.yaml` manifest beside each public-safe research note.
2. Build a minimal validator that checks required fields before public export.
3. Create synthetic fixture packs for each MC output class: mode boundary, claim pattern, interface contract, redaction regression, inference quarantine, source rehydration, and assumption expiry.
4. Add a review state for artifacts that are safe to name but unsafe to demonstrate.
5. Add a public export rule: no artifact leaves the private repo unless the evaluation path is either public-safe or explicitly marked unavailable with a reason.

## Research questions

- How much structural similarity between a synthetic fixture and private source context is enough to create reconstruction risk?
- Can MC define privacy-safe fixture generation rules that preserve cognitive architecture while changing scenario topology?
- What is the minimum evidence needed to promote a private-context-informed method into a public product requirement?
- How should the system score artifacts that are safe as abstract requirements but unsafe as examples?

## Revision reason

This note extends prior public-safe boundary work by adding **evaluability after redaction**. Earlier controls emphasize what may be said, retained, or transformed. This note adds the requirement that every retained public-safe abstraction must still be testable through a safe evidence path.
