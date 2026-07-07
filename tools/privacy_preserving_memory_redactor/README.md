# Privacy Preserving Memory Redactor

Executable Mirror Cartographer component for public-safe research memory preparation.

This tool validates and redacts candidate research-memory packets before they can be reused in public artifacts, collaborator handoffs, literature organization, hypothesis generation, or longitudinal pattern review.

It supports the cure/discovery ambition by making long-running research memory safer: observations can be retained as structured evidence signals without carrying private residue, identity leakage, exact locations, direct contact details, or advice/cure overclaims.

## Component purpose

Input: JSON packets describing observations, hypotheses, evidence notes, or animal-care research notes.

Output: JSON packets with:

- direct identifiers redacted from free text
- privacy status assigned
- claim status normalized
- missingness explicitly preserved
- blocked packets routed to `private_review_required`
- public-safe packets routed to `memory_ready`
- medical/veterinary advice language routed to `boundary_review_required`

## Input shape

Each packet must contain:

- `packet_id`: stable string id
- `domain`: one of `human_health`, `animal_care`, `literature`, `hypothesis`, `collaboration`, `general`
- `source_status`: source description such as `synthetic`, `user_private`, `public_literature_note`, or `collaborator_supplied`
- `claim_status`: current claim boundary
- `privacy_status`: current privacy boundary
- `text`: candidate memory text
- `missingness`: array of missing fields, unknowns, or caveats
- `revision_reason`: why the packet is being processed

Optional:

- `tags`: array of strings
- `evidence_refs`: array of public-safe citation ids or source handles

## Output shape

The CLI emits a JSON object:

- `component`: `privacy_preserving_memory_redactor`
- `summary`: count totals by route and severity
- `packets`: normalized packets

Each output packet includes:

- `packet_id`
- `route`: `memory_ready`, `private_review_required`, or `boundary_review_required`
- `severity`: `pass`, `warn`, or `block`
- `redacted_text`
- `detected_risks`
- `source_status`
- `claim_status`
- `privacy_status`
- `missingness`
- `revision_reason`
- `implementation_status`
- `testability`
- `next_executable_action`

## CLI

Run:

`python tools/privacy_preserving_memory_redactor/redact_research_memory_packets.py tools/privacy_preserving_memory_redactor/fixtures.synthetic.json`

With output file:

`python tools/privacy_preserving_memory_redactor/redact_research_memory_packets.py tools/privacy_preserving_memory_redactor/fixtures.synthetic.json --out /tmp/redacted_memory.json`

## Acceptance criteria

A packet must be blocked when it contains any of:

- email address
- phone-like contact string
- street-address-like phrase
- private relay address or direct contact detail
- exact date of birth phrase
- full name marker in text

A packet must be boundary-reviewed when it contains advice or cure certainty language such as:

- `diagnose`
- `treat`
- `cure`
- `healed`
- `should take`
- `medical advice`
- `veterinary advice`

A packet may be memory-ready only when:

- no direct identifiers remain
- claim status is bounded
- privacy status is public-safe or synthetic
- missingness is explicit

## Tests

Run:

`python tools/privacy_preserving_memory_redactor/test_redact_research_memory_packets.py`

The tests cover:

- public-safe synthetic memory passes
- private identifiers are redacted and blocked
- cure/advice language routes to boundary review
- missingness is required
- output shape is stable for downstream tools

## Public-safety note

This component is not medical or veterinary advice. It is an engineering gate for evidence organization, privacy-preserving research memory, and collaboration readiness.
