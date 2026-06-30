# Admissible Memory Contract Record v0

Status: draft schema
Privacy status: public-safe abstraction
Revision reason: created to make memory/source admission auditable before MC uses remembered material in reflection, evaluation, or publication.

## Fields

- record_id: stable local identifier
- created_at: ISO date
- updated_at: ISO date or null
- source_status: public_repo | private_file | saved_context | user_current_input | external_research | generated_summary | unknown
- source_pointer: public URL, repo path, abstract private-source label, or null
- privacy_status: public_safe | private_context_only | restricted | unknown
- claim_status: evidence | hypothesis | metaphor | design_requirement | implementation_plan | evaluation_criterion | unknown
- temporal_status: current | possibly_stale | superseded | undated | unknown
- domain_lane: symbolic_reflection | product_design | safety_eval | implementation | public_claim | health_adjacent | legal_financial_adjacent | unknown
- admissibility_basis: short reason the source may or may not be used
- admission_decision: admit | admit_with_boundary | summarize_only | reject | quarantine
- missingness: unavailable, unverified, or uncertain material
- revision_reason: why this record changed or was created
- public_export_allowed: yes | no | only_abstracted | unknown
- overreach_risk: none | low | medium | high | unknown
- required_next_check: specific verification or test needed before stronger claims

## Decision logic

1. If privacy_status is private_context_only or restricted, public_export_allowed must not be yes.
2. If temporal_status is superseded, admission_decision should be reject or summarize_only unless the task is historical.
3. If claim_status is metaphor, it must not be promoted to evidence without a separate evidence record.
4. If source_status is unknown, admission_decision cannot be admit without boundary.
5. If domain_lane is health_adjacent, legal_financial_adjacent, or other authority-sensitive lane, outputs must include external-verification language.
6. If missingness is material, the public artifact must state it.

## Minimal JSON shape

{
  "record_id": "amc-0001",
  "created_at": "2026-06-30",
  "updated_at": null,
  "source_status": "private_file",
  "source_pointer": "abstract_private_architecture_source",
  "privacy_status": "private_context_only",
  "claim_status": "design_requirement",
  "temporal_status": "possibly_stale",
  "domain_lane": "product_design",
  "admissibility_basis": "May inform architecture, but cannot be quoted or exposed publicly.",
  "admission_decision": "summarize_only",
  "missingness": "Implementation enforcement not verified.",
  "revision_reason": "Converted private-context pattern into public-safe requirement.",
  "public_export_allowed": "only_abstracted",
  "overreach_risk": "medium",
  "required_next_check": "Inspect code for structured source/claim/privacy fields."
}
