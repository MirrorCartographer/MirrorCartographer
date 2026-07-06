# Symbolic Operational Translator

Public-safe Mirror Cartographer component for converting symbolic, metaphorical, or narrative observations into operational research variables without retaining private source text.

## Cure/discovery role

Breakthrough-oriented reasoning often begins as ambiguous language: a felt pattern, analogy, metaphor, or repeated contextual cue. This component does not interpret private content. It validates whether an already-redacted symbolic packet can be converted into a measurable, falsifiable, evidence-routable research packet.

The translator is designed to sit before hypothesis generation and before provenance packet construction.

## Input contract

A packet must contain:

- `packet_id`: stable public-safe identifier.
- `source_status`: synthetic, public_abstract, literature_derived, or deidentified_user_abstract.
- `privacy_status`: public_safe or deidentified.
- `symbolic_observation`: category-level symbolic statement, not raw transcript.
- `symbolic_terms`: list of non-identifying terms with operational mappings.
- `context_window`: coarse context bucket.
- `candidate_variables`: measurable variables inferred from the symbolic terms.
- `falsification_route`: how the mapping could be shown wrong.
- `missingness`: what information is absent.
- `claim_status`: observation_only, mapping_candidate, test_ready, rejected.

## Acceptance criteria

A packet passes only if:

1. It contains no private identifiers or raw personal/household/medical/veterinary details.
2. Every symbolic term has at least one operational mapping.
3. At least two candidate variables are measurable.
4. The packet includes a falsification route.
5. The packet separates source status from claim status.
6. The packet does not contain advice-like language.

## Test cases

Expected PASS:

- Public-safe metaphor mapped to measurable state-transition variables.
- Synthetic animal-care research abstract mapped to question-prep variables without advice.

Expected FAIL:

- Raw private narrative.
- Symbolic terms without operational mappings.
- Advice-like medical or veterinary language.
- No falsification route.

## CLI

Run:

`python tools/symbolic_operational_translator/validate_symbolic_operational_packets.py tools/symbolic_operational_translator/fixtures.synthetic.json`

Run tests:

`python tools/symbolic_operational_translator/test_validate_symbolic_operational_packets.py`
