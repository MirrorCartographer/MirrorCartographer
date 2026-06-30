# Cross-Lane Contamination Record v0

Status: public-safe schema
Privacy status: no private source content; schema only
Revision reason: adds a bridge-level record for preventing false proof transfer across connected MC lanes.

## Purpose

This record captures when one lane influences another and prevents that influence from becoming unauthorized proof.

## Fields

- `record_id`: stable identifier
- `created_at`: ISO timestamp
- `source_status`: one of `repo`, `file_library_chunk`, `saved_context`, `web_research`, `user_current_turn`, `unknown`
- `claim_status`: one of `observed`, `inferred`, `designed`, `tested`, `contested`, `retired`
- `privacy_status`: one of `public_safe`, `abstracted_private`, `private_blocked`, `needs_redaction`, `unknown`
- `source_lane`: originating lane
- `destination_lane`: receiving lane
- `transfer_object`: short abstract description of what moved
- `transfer_type`: one of `metaphor`, `requirement`, `signal`, `evidence`, `test`, `implementation`, `policy`
- `allowed_authority`: what the transfer may support
- `forbidden_authority`: what the transfer may not support
- `destination_proof_standard`: required proof before destination-lane claims may be made
- `missingness`: known absent or partial evidence
- `revision_reason`: why this record was created or changed
- `review_trigger`: condition that requires reinspection
- `expiry_status`: one of `active`, `expires_on_date`, `superseded`, `retired`

## Minimal valid record

A record is invalid if it does not state both allowed and forbidden authority.

## Failure modes caught

- symbolic meaning treated as factual evidence
- private context laundered into public claims
- implementation plan described as shipped product
- file existence treated as outcome proof
- user resonance treated as external validation
- fresh source used to overrule an older source without revision custody
