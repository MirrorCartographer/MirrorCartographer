# InfluenceGraphRecord v0

Status labels

- Source status: derived from Consent-Scoped Influence Graph research note and existing public-safe compiler direction.
- Claim status: schema proposal, not implemented in runtime.
- Privacy status: public-safe; no private source material.
- Missingness: not yet validated against real repository workflows, not threat-modeled, not enforced by CI.
- Revision reason: created to make public-safe artifact influence traceable without exposing private context.

## Purpose

An `InfluenceGraphRecord` documents how an artifact was shaped.

It records influence without publishing private source content.

## Required fields

### artifact_id

Stable path or identifier for the artifact.

### artifact_type

Examples:

- research note
- product requirement
- schema
- scorecard
- fixture
- index
- field log
- museum entry

### source_lanes_used

Public-safe lane labels only.

Suggested lane labels:

- public_repo
- saved_architecture_context
- conversation_pattern_context
- external_research
- synthetic_fixture
- implementation_observation

### source_lanes_blocked

Classes of material intentionally blocked from crossing.

Required default blocked classes:

- personal details
- household details
- health details
- animal-care details
- financial details
- location details
- relationship details
- credential details
- raw transcript details

### influence_edges

List of influence relationships.

Each edge should include:

- from_lane
- to_artifact_or_claim
- edge_type
- transformation_type
- allowed_public_output
- blocked_output

Allowed edge types:

- informed_by
- abstracted_from
- blocked_from
- tested_by
- constrained_by
- revised_because

### claim_dependencies

For each claim, identify what supports it.

Use:

- public evidence
- repository precedent
- architecture inference
- synthetic fixture only
- speculative hypothesis
- unsupported / needs research

### privacy_status

Use one:

- public-safe
- internal-only
- mixed-source abstracted
- blocked

### claim_status

Use one:

- observation
- inference
- hypothesis
- method proposal
- product requirement
- tested result

### missingness

What is absent or not proven.

### revision_reason

Why this artifact exists or changed.

## Constraint

No raw private source text belongs inside an InfluenceGraphRecord.

If a source cannot be safely represented as a lane label and transformation, it is not public-safe.

## Minimum valid record

A valid record must answer:

1. What shaped this artifact?
2. What was blocked?
3. What kind of transformation occurred?
4. Which claims are evidence-supported versus speculative?
5. What remains missing?

## Implementation note

This schema should eventually be enforced by a repository check before artifacts move from internal research into public-facing demos.
