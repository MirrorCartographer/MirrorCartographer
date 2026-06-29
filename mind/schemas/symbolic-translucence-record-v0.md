# SymbolicTranslucenceRecord v0

Status labels

- Source status: derived from public-safe MC architecture and current human-centered AI transparency concerns.
- Claim status: schema proposal.
- Privacy status: public-safe schema; no private source details.
- Missingness: not yet validated with real sessions or accessibility testing.
- Revision reason: created to make symbolic interpretation inspectable without exposing private context.

## Purpose

A `SymbolicTranslucenceRecord` documents how an MC output moved from input signal to interpretation while preserving source boundaries.

It should help the user see how the map was made.

It should not reveal private raw material.

## Required fields

### output_id

Stable identifier for the output or artifact.

### entry_signal_type

Use one or more:

- direct user text
- selected symbol
- uploaded artifact
- prior public-safe summary
- saved preference
- system requirement
- research source
- synthetic fixture

### lens_route

The interpretive lens or lenses used.

Examples:

- symbolic
- neutral
- scientific
- product
- evaluation
- privacy
- governance
- accessibility
- care-communication support
- implementation

### transformation_path

Plain-language explanation of how the input was transformed.

### claim_mode

Use one:

- fact
- inference
- symbolic interpretation
- speculation
- product requirement
- evaluation criterion
- research question
- implementation plan

### evidence_boundary

What evidence is allowed to support this output.

### privacy_boundary

What source classes are blocked from public release.

### confidence_shape

Describe the confidence as a shape, not just a number.

Examples:

- narrow but strong
- broad and tentative
- emotionally resonant but unproven
- implementation-ready but untested
- research-aligned but not validated

### missingness

What is unknown, untested, unavailable, or intentionally withheld.

### agency_affordances

User actions supported by the interface.

Use any:

- accept
- reject
- rename
- split
- merge
- ask for colder view
- ask for more symbolic view
- ask for source-boundary view
- mark as unresolved

### release_state

Use one:

- private only
- internal research
- public-safe speculation
- public-safe method
- product requirement
- tested protocol

### revision_reason

Why the record was created or changed.

## Non-goals

This record must not expose:

- raw transcript content
- personal identity details
- health or animal-care details
- financial details
- household or location details
- relationship details
- credential details
- private emotional specifics

## Rule

The user should be able to see the angle of interpretation without seeing the private room reflected in the glass.
