# Authority Preservation Matrix

Date: 2026-07-01
Status: public-safe architecture note

## Finding

Mirror Cartographer needs an Authority Preservation Matrix: a review layer that keeps symbolic, personal, product, research, implementation, accessibility, safety, and evaluation authorities distinct even when their meanings are connected in the same operating graph.

## Operating line

Meaning may converge. Authority must remain typed.

## Source status

- Private-context source status: used only as architectural context; no raw transcript, household, health, animal-care, financial, location, relationship, credential, or personally identifying details are included.
- File-library source status: abstracted from public-facing and project-facing Mirror Cartographer materials describing MC as a human-centered symbolic/emotional reflection system, psychologically sustainable AI interaction layer, and proof-lane graph.
- GitHub source status: intended as a durable repository note in the public `MirrorCartographer/MirrorCartographer` repository.

## Claim status

- Claim type: product architecture requirement and evaluation criterion.
- Evidence level: architecture synthesis, not empirical validation.
- Valid claim: MC should preserve separate authority types for different lanes of meaning and proof.
- Invalid claim: this note does not prove clinical, therapeutic, benchmark, commercial, or safety efficacy.

## Privacy status

- Public-safe: yes.
- Transformation method: private and sensitive context was reduced to abstract design pressure only.
- Excluded material: personal facts, household details, animal-care details, health material, financial material, location material, relationship details, credentials, and raw transcript content.

## Missingness

- No complete raw export was available in this run.
- File Library retrieval is chunked and partial.
- Repository search may not surface every newly created file immediately because indexing can lag.
- No live product telemetry or user-study data was available.

## Revision reason

Prior MC notes already established source boundaries, evidence lanes, abstraction audits, continuity containers, and proof-transfer firewalls. The missing piece is explicit authority preservation: a system can connect domains without letting one domain inherit another domain's authority.

## Product requirement

Every durable MC object should carry an `authority_type` field alongside existing boundary metadata.

Suggested authority types:

- `symbolic_reflection`
- `user_confirmed_state`
- `creative_artifact`
- `product_requirement`
- `implementation_evidence`
- `accessibility_evidence`
- `research_question`
- `source_backed_fact`
- `safety_boundary`
- `evaluation_result`

## Evaluation criteria

A generated or stored MC artifact passes the Authority Preservation Matrix if:

1. It states what kind of authority it has.
2. It states what kind of authority it does not have.
3. It does not use symbolic resonance as factual proof.
4. It does not use implementation existence as user benefit proof.
5. It does not use private context as public evidence.
6. It preserves the difference between a meaningful reflection, a supported claim, a measurable result, and a design hypothesis.

## Implementation plan

1. Add `authority_type` to reflection, note, index, and research schemas.
2. Add an authority downgrade step before public export.
3. Add a lint rule that blocks artifacts with high-impact claims and no authority label.
4. Add a public-safe export template that includes source status, claim status, privacy status, missingness, revision reason, and authority type.
5. Add tests using synthetic examples only.

## Public-safe index entry

- Name: Authority Preservation Matrix
- Category: boundary governance / meaning integrity
- Use: prevents cross-domain authority leakage
- Public status: publishable
- Proof status: design requirement, pending implementation and evaluation
