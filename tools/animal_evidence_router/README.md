# Animal Evidence Router

Purpose: public-safe executable routing for animal-care research evidence organization.

This tool does not diagnose, treat, or advise. It validates and routes deidentified animal-care research packets into MC workflow queues:

- `organize_evidence`: acceptable public/synthetic packet with source references and bounded claim.
- `needs_veterinary_review`: packet is research-organizable but clinical/action language is too close to advice.
- `needs_more_evidence`: packet lacks enough source or measurement support.
- `privacy_block`: packet includes private identifiers, exact dates, raw transcript, contact/location detail, or personal animal identity residue.
- `reject_overclaim`: packet claims cure, diagnosis, certainty, or treatment efficacy without allowed evidence boundary.

## Packet interface

Each input is a JSON object with:

- `packet_id`: stable public-safe id.
- `species_scope`: one of `dog`, `cat`, `multi_species`, `unknown`.
- `research_question`: bounded research organization question.
- `claim_text`: bounded claim or hypothesis, not advice.
- `claim_status`: one of `hypothesis`, `association`, `background`, `protocol_candidate`, `needs_review`.
- `source_status`: one of `primary_source`, `clinical_institution`, `review`, `preprint`, `synthetic_fixture`, `unknown`.
- `evidence_refs`: list of non-private references or placeholder synthetic ids.
- `measurable_variables`: list of observable variables.
- `missingness`: list of missing fields, caveats, or uncertainties.
- `privacy_status`: one of `public_safe`, `synthetic`, `deidentified`, `private_risk`.
- `forbidden_content_flags`: list drawn from `diagnosis`, `treatment_instruction`, `cure_claim`, `private_identifier`, `exact_timestamp`, `raw_transcript`, `location_detail`, `none`.
- `next_executable_action`: public-safe next research organization action.

## Run

`python tools/animal_evidence_router/route_animal_evidence_packets.py tools/animal_evidence_router/fixtures.synthetic.json`

## Acceptance criteria

1. Blocks private-risk packets before evidence organization.
2. Rejects cure/diagnosis/treatment overclaims.
3. Routes weak but safe packets to more-evidence, not promotion.
4. Routes clinically sensitive packets to veterinary review, not advice.
5. Allows only bounded, sourced, measurable, public-safe research packets into organization.
