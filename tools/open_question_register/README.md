# Open Question Register

Executable Mirror Cartographer component for converting research notes into bounded, public-safe open questions that can be routed into hypothesis generation, literature review, or falsification planning.

## Purpose

Discovery work fails when observations jump straight into conclusions. This register forces every unresolved question to carry:

- a bounded domain,
- measurable variables,
- explicit source boundary,
- missingness notes,
- claim-status discipline,
- privacy posture,
- and a next executable action.

It supports the cure/discovery ambition by preserving uncertainty without letting it become vague belief, advice, or private residue.

## Input shape

JSON file containing an array of packets:

```json
[
  {
    "question_id": "oq_synthetic_001",
    "domain": "animal_care_evidence",
    "question": "Does symptom timing change after medication exposure in the synthetic animal timeline?",
    "source_status": "synthetic_fixture",
    "claim_status": "open_question",
    "privacy_status": "public_safe_synthetic",
    "missingness": ["dose timing precision", "baseline comparison window"],
    "variables": ["exposure_window", "symptom_onset_delta", "recovery_duration"],
    "evidence_refs": ["synthetic_case_note_a"],
    "falsification_route": "compare against no-exposure windows and unrelated symptom clusters",
    "next_executable_action": "generate paired positive and negative control fixtures"
  }
]
```

## Usage

```bash
python tools/open_question_register/validate_open_question_register.py tools/open_question_register/fixtures.synthetic.json
```

Expected result: prints a JSON summary and exits with status code `0` when all public-safe packets pass.

## Acceptance criteria

A packet passes only when it:

1. has all required labels,
2. uses an allowed domain,
3. remains public-safe or synthetic,
4. is explicitly an open question rather than a conclusion,
5. contains at least two measurable variables,
6. names at least one missingness item,
7. includes at least one evidence reference,
8. includes a falsification route,
9. includes a next executable action,
10. does not contain forbidden advice/cure certainty language.

## Public-safety constraints

This tool must not admit raw identifiers, exact private dates, addresses, direct medical/veterinary advice, or cure guarantees. It is an uncertainty-routing tool, not an advice engine.
