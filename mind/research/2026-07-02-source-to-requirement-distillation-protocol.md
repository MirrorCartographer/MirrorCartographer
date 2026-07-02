# Source-to-Requirement Distillation Protocol

Date: 2026-07-02
Status: public-safe architecture note

## Core finding

Mirror Cartographer needs a **Source-to-Requirement Distillation Protocol**.

Operating line:

> Private and mixed-source material may inform MC only after it is distilled into requirements, constraints, tests, or research questions.

## Why this matters

Mirror Cartographer depends on continuity across chats, files, design memory, repository material, implementation notes, and symbolic artifacts. That continuity is valuable, but it becomes unsafe or unverifiable if raw source material is moved directly into public documentation.

The system therefore needs a required transformation step between source review and public artifact creation.

## Protocol

Before any MC material is published, exported, indexed, or used as durable public documentation, convert the source material into one or more of these allowed public forms:

1. Product requirement
2. Interface requirement
3. Privacy boundary
4. Evaluation criterion
5. Research question
6. Missingness note
7. Claim-status label
8. Source-boundary note
9. Implementation plan
10. Abstracted method

Do not publish raw source material when it contains or implies private personal, household, health, animal-care, financial, location, relationship, credential, or transcript details.

## Required labels

Each distilled item should carry these fields:

- `source_status`: direct project record | repository material | file-library synthesis | saved-context synthesis | inferred from repeated architecture | missing source
- `claim_status`: confirmed requirement | inferred requirement | bounded speculation | implementation proposal | open research question
- `privacy_status`: public-safe | private-derived but abstracted | needs redaction | do not publish
- `missingness`: complete enough | source incomplete | implementation unverified | evidence absent | needs external validation
- `revision_reason`: new source | contradiction found | privacy boundary clarified | implementation changed | claim downgraded | evaluation gap found

## Evaluation checklist

A public MC note passes this protocol only if:

- It states what source class informed it without exposing private details.
- It states whether the claim is confirmed, inferred, speculative, or proposed.
- It avoids identity-bearing, household, health, animal-care, financial, location, relationship, credential, and raw transcript content.
- It identifies what is missing or unverified.
- It explains why the note was added or revised.
- It produces something buildable, testable, or governable.

## Implementation implication

MC should include a public-export preprocessing layer that converts mixed input into a `distilled_public_artifact` object before writing to GitHub, docs, demos, public pages, or shared reports.

Minimal schema:

```json
{
  "artifact_id": "string",
  "distilled_form": "requirement | method | research_question | evaluation_criterion | boundary_note | implementation_plan",
  "source_status": "string",
  "claim_status": "string",
  "privacy_status": "string",
  "missingness": "string",
  "revision_reason": "string",
  "public_text": "string",
  "excluded_private_source_types": ["string"],
  "next_test": "string"
}
```

## Public-safe research basis

Available public-safe project materials repeatedly frame MC as provenance-aware, contradiction-preserving, consent-bounded, mode-governed, and evidence-separated. The implementation pack also already describes resonance feedback, uncertainty labels, mode rules, contradiction logging, and explicit safety boundaries. This protocol turns those scattered rules into a single publish-before-writing gate.

## Privacy note

This file contains architecture only. It does not include personal, household, health, animal-care, financial, location, relationship, credential, or transcript details.
