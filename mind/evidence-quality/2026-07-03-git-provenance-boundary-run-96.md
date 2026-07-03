# Git Provenance Boundary Evidence Map — Run 96

Date: 2026-07-03

## Claim tested

GitHub commit history is sufficient to make the Mirror Cartographer knowledge substrate auditable.

## Result

Status: downgraded / narrowed.

Git and GitHub commit history provide useful version integrity, change history, and file-level accountability, but they are not sufficient by themselves to prove evidence provenance, claim support, source lineage, or epistemic auditability.

A safer claim is:

> GitHub can serve as a versioned storage and change-history layer for the Mirror Cartographer knowledge substrate, but auditable evidence governance requires explicit provenance metadata linking claims, evidence, sources, activities, agents, timestamps, confidence transitions, and validation status.

## High-quality sources reviewed

### W3C PROV

Source: https://www.w3.org/TR/prov-overview/

Relevant finding:

W3C defines provenance as information about entities, activities, and people involved in producing data or things, used to assess quality, reliability, or trustworthiness. PROV provides a model and serializations for interoperable provenance exchange.

Source: https://www.w3.org/TR/prov-dm/

Relevant finding:

PROV-DM models entities, activities, agents, usage, generation, derivation, revision, attribution, association, invalidation, and primary-source relationships. This is closer to what MC needs for epistemic audit than a flat commit log.

### Git documentation

Source: https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control

Relevant finding:

Git is a version-control system that records changes to files over time so specific versions can be recalled, compared, and attributed to modification history.

Source: https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F

Relevant finding:

Git stores snapshots of project files. Git also checksums stored content and refers to objects by checksum. This supports content integrity and version recovery, not full epistemic provenance.

### Software Heritage persistent identifiers

Source: https://docs.softwareheritage.org/devel/swh-model/persistent-identifiers.html

Relevant finding:

Software Heritage persistent identifiers are stable identifiers for archived software objects. Their intrinsic identifiers use cryptographic hashes over object properties and form a Merkle DAG. This supports long-term artifact identification, but it still does not say whether a claim is true or whether a citation supports a specific sentence.

## Fact vs inference

### Facts

- Git records file changes over time and allows earlier states to be recalled.
- Git stores committed project states as snapshots.
- Git checksums stored content, which helps detect content changes or corruption.
- W3C PROV treats provenance as more than versioning; it includes entities, activities, people/agents, derivation, usage, generation, and attribution.
- Software Heritage identifiers can provide persistent, hash-based identification for archived software artifacts.

### Inferences

- MC should not equate GitHub commit history with full auditability.
- GitHub is a persistence and change-history layer, not the full provenance layer.
- MC evidence maps need structured provenance fields if they are to support audit claims.
- A future graph model should use claim/evidence/source/activity relationships instead of relying only on folder paths and commit history.

## Claim-status update

### Previous loose assumption

GitHub commit history proves the work is auditable.

### Updated claim

GitHub commit history contributes to auditability by preserving versioned file changes, but MC auditability requires explicit provenance metadata and source-to-claim links.

### Current status

Partially supported as infrastructure. Not supported as complete evidence-governance provenance.

## Evaluation criterion added

### MC-PROVENANCE-01

A Mirror Cartographer artifact should not be labeled fully auditable unless it records at minimum:

1. claim ID;
2. artifact ID;
3. source IDs and URLs;
4. exact source role for each source;
5. directness of source support;
6. author/agent that produced the artifact;
7. activity performed: evidence map, claim update, downgrade, evaluation, test, archive, etc.;
8. timestamp;
9. prior claim status;
10. new claim status;
11. reason for status change;
12. contradiction search status;
13. next proof required.

## Falsification checklist

The stronger claim “GitHub history is enough for MC auditability” fails if any of the following are true:

- A reader cannot tell which exact claim a source supports.
- A reader cannot separate source citation from source role.
- A reader cannot identify whether the source directly supports, indirectly supports, contextualizes, or contradicts the claim.
- A reader cannot reconstruct the activity that produced a status change.
- A reader cannot determine whether a claim was upgraded, downgraded, retired, or unchanged.
- A reader cannot identify unresolved contradictions.
- A reader can see that a file changed but cannot tell why epistemic confidence changed.

## Next proof needed

Run MC-PROVENANCE-PILOT-01:

- Select 20 existing MC artifacts.
- Convert each into a structured provenance record using MC-PROVENANCE-01.
- Have an independent reviewer try to reconstruct:
  - what claim was tested;
  - what evidence was used;
  - what changed;
  - why confidence changed;
  - what remains unproven.
- Pass condition: reviewer can reconstruct all five items for at least 18 of 20 artifacts without asking the artifact creator.

## Boundary statement

GitHub can show that a file existed at a commit and changed over time. It does not, by itself, prove that the file's claims are true, that its sources directly support those claims, or that the knowledge substrate is epistemically auditable.
