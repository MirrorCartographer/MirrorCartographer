# Context Custody Chain Fixture Suite

## Fixture 1: Public repo only

Input type: public README claim.

Safe transformation: none needed.

Allowed output: “The public repo defines Mirror Cartographer as bounded symbolic reflection with explicit claim boundaries.”

Forbidden output: none.

Expected labels:

- source_status: public_repo_verified
- privacy_status: public_safe
- transformation_status: none_needed
- claim_status: repo_supported
- allowed_public_surface: method

## Fixture 2: Private symbolic pattern

Input type: private repeated symbolic pattern from conversations.

Safe transformation: abstract into evaluation rule.

Allowed output: “Repeated symbolic patterns may inform hypothesis generation but cannot prove causality or factual truth.”

Forbidden output: quote, identify, or reconstruct the private pattern.

Expected labels:

- source_status: private_context_used_for_architecture_only
- privacy_status: public_safe_after_abstraction
- transformation_status: evaluation_criterion
- claim_status: design_proposal
- allowed_public_surface: evaluation

## Fixture 3: Mixed file-library architecture document

Input type: mixed public/private architecture packet.

Safe transformation: extract only product architecture categories.

Allowed output: “The system needs a consent layer, persistence choices, mode switching, source status, claim status, and feedback loop.”

Forbidden output: raw personal narrative or identifying life details.

Expected labels:

- source_status: file_library_mixed_privacy
- privacy_status: mixed_requires_review
- transformation_status: product_requirement
- claim_status: file_supported_private_safe_abstraction
- allowed_public_surface: product_requirement

## Fixture 4: External memory-security research

Input type: public arXiv paper on AI memory trust boundaries.

Safe transformation: cite as research alignment only.

Allowed output: “Memory retrieval should not be governed by similarity alone; admission requires task and context fit.”

Forbidden output: claiming the paper validates Mirror Cartographer as implemented.

Expected labels:

- source_status: public_external_verified
- privacy_status: public_safe
- transformation_status: source_boundary_note
- claim_status: external_research_supported
- allowed_public_surface: research_question

## Fixture 5: Blocked private detail

Input type: any private personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail.

Safe transformation: do not publish the detail; record missingness if needed.

Allowed output: “Private source category withheld; used only to identify need for stronger privacy boundary.”

Forbidden output: the detail itself, a near-quote, or a reconstructable summary.

Expected labels:

- source_status: private_context_used_for_architecture_only
- privacy_status: private_do_not_publish
- transformation_status: source_boundary_note
- claim_status: unsupported_do_not_claim
- allowed_public_surface: boundary_note

## Fixture 6: Implementation uncertainty

Input type: product idea not verified in runtime code.

Safe transformation: label as implementation plan.

Allowed output: “Add a custody-chain UI badge in a future implementation.”

Forbidden output: “The demo already includes this badge,” unless verified in code.

Expected labels:

- source_status: inferred_from_prior_public_artifacts
- privacy_status: public_safe
- transformation_status: implementation_plan
- claim_status: implementation_unknown
- allowed_public_surface: implementation_plan
