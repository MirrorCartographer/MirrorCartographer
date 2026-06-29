# Public-Safe Claim Transport Ledger

Status: research note
Source status: private-context-informed, file-library-supported, fresh-research-supported, repo-targeted
Claim status: proposed architecture pattern
Privacy status: public-safe abstraction; no raw transcript, personal, household, health, animal-care, financial, location, relationship, credential, or private identity details included
Missingness: implementation not yet wired into runtime; evidence is conceptual + source-aligned, not production-tested
Revision reason: previous MC mind runs created separate gates for source boundaries, redaction fidelity, release readiness, influence tracing, resonance/proof separation, and authority boundaries. This run joins them into one transport record so public artifacts can show how a claim crossed from context into release without exposing protected source material.

## Core finding

MC needs a Public-Safe Claim Transport Ledger: a stage-by-stage record of how a claim, requirement, method, or research question moves from source context into a publishable artifact.

The ledger does not store the private source. It stores the crossing logic.

## Problem

A public-safe artifact can fail in two opposite ways:

1. It leaks source material by carrying private details across the boundary.
2. It becomes too flattened to preserve the architecture that made the finding meaningful.

MC needs to preserve structural signal without exposing protected detail.

## Ledger stages

1. Source boundary classification
   - What class of context shaped the work?
   - Public source, private conversation, uploaded file, repo material, current research, synthetic fixture, or mixed source.

2. Claim extraction
   - What claim is being transported?
   - Fact, inference, product requirement, method, evaluation criterion, research question, hypothesis, metaphor, or speculative design concept.

3. Privacy transformation
   - What was removed, generalized, or converted into synthetic structure?
   - The ledger should record categories of removal, not the removed content.

4. Fidelity preservation
   - What structural signal survived redaction?
   - Examples: contradiction, recurrence, user-control need, provenance gap, mode-boundary need, missingness, contestability requirement.

5. Authority boundary
   - What the claim is allowed to do.
   - What the claim is forbidden to do.

6. Evaluation route
   - How the claim can be tested, challenged, or revised.

7. Release decision
   - Publish, hold, rewrite, synthesize, restrict, or discard.

8. Revision trail
   - Why the artifact changed.
   - Which boundary or evidence update forced the change.

## Public-safe output classes

Allowed public outputs:

- Abstracted method notes
- Product requirements
- Evaluation criteria
- Schema drafts
- Research questions
- Source-boundary notes
- Privacy-safe indexes
- Synthetic fixtures
- Implementation plans
- Governance checklists

Disallowed public outputs:

- Raw transcript excerpts from private contexts
- Personal identifying details
- Household details
- Health or animal-care specifics
- Financial details
- Location details
- Relationship details
- Credentials or access details
- Direct source reconstruction clues

## Design implication

Every public MC artifact should include a compact boundary header:

- Source status
- Claim status
- Privacy status
- Missingness
- Revision reason

This turns privacy from a hidden promise into inspectable release infrastructure.

## Evaluation questions

- Can an external reader understand the claim without private context?
- Can an external reader verify the boundary class?
- Does the artifact preserve the shape of the insight?
- Does it avoid reconstructing protected source material?
- Does it state what would change the claim?
- Does it separate resonance, inference, speculation, and evidence?
- Does it avoid therapeutic, diagnostic, legal, financial, or operational authority where not authorized?

## Key phrase

The public artifact is not the source. It is the inspected crossing of a claim.
