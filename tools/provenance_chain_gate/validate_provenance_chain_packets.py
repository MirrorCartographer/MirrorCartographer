#!/usr/bin/env python3
"""Validate Mirror Cartographer provenance-chain packets.

This validator is intentionally dependency-light. It performs the semantic checks that
JSON Schema alone cannot enforce without a larger validation stack:
- public memory must not admit reject_private chain steps
- missingness must never be interpreted as absence
- supported claims require a measured or external-public evidence step
- provenance step numbers must be contiguous and ordered
- measurable variables must be present
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

ALLOWED_SOURCE_STATUS = {
    "synthetic",
    "primary_public",
    "secondary_public",
    "mixed_public",
    "unverified_public",
}
ALLOWED_CLAIM_STATUS = {
    "hypothesis",
    "test_fixture",
    "supported",
    "contradicted",
    "inconclusive",
    "blocked",
}
ALLOWED_PRIVACY_STATUS = {
    "public_safe",
    "deidentified",
    "reject_private",
    "synthetic_only",
}
ALLOWED_MISSINGNESS = {
    "none_declared",
    "unknown",
    "not_collected",
    "redacted",
    "not_applicable",
}
ALLOWED_IMPLEMENTATION_STATUS = {
    "schema_only",
    "fixtures_only",
    "validator_ready",
    "validated",
    "ci_required",
}
ALLOWED_TESTABILITY = {
    "executable",
    "semi_executable",
    "manual_review",
    "blocked",
}
ALLOWED_ACTORS = {
    "human",
    "assistant",
    "tool",
    "synthetic_fixture",
    "external_public_source",
}
ALLOWED_ARTIFACT_TYPES = {
    "observation",
    "abstraction",
    "hypothesis",
    "schema",
    "fixture",
    "validator",
    "score",
    "evidence_record",
}
ALLOWED_PUBLIC_BOUNDARIES = {
    "public_safe",
    "synthetic",
    "deidentified",
    "reject_private",
}
ALLOWED_CLAIM_BOUNDARIES = {
    "stated",
    "inferred",
    "generated",
    "measured",
    "rejected",
}
ALLOWED_COLLECTION_BOUNDARIES = {
    "synthetic",
    "public_dataset",
    "deidentified_local",
    "manual_review_required",
}


def require(condition: bool, errors: List[str], message: str) -> None:
    if not condition:
        errors.append(message)


def validate_packet(packet: Dict[str, Any]) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    required = [
        "packet_id",
        "claim",
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
        "revision_reason",
        "implementation_status",
        "testability",
        "provenance_chain",
        "measurable_variables",
        "falsification_route",
        "next_executable_action",
    ]
    for key in required:
        require(key in packet, errors, f"missing required field: {key}")

    if errors:
        return False, errors

    require(packet["source_status"] in ALLOWED_SOURCE_STATUS, errors, "invalid source_status")
    require(packet["claim_status"] in ALLOWED_CLAIM_STATUS, errors, "invalid claim_status")
    require(packet["privacy_status"] in ALLOWED_PRIVACY_STATUS, errors, "invalid privacy_status")
    require(packet["implementation_status"] in ALLOWED_IMPLEMENTATION_STATUS, errors, "invalid implementation_status")
    require(packet["testability"] in ALLOWED_TESTABILITY, errors, "invalid testability")
    require(len(str(packet["claim"])) >= 20, errors, "claim too short")
    require(len(str(packet["revision_reason"])) >= 15, errors, "revision_reason too short")
    require(len(str(packet["falsification_route"])) >= 20, errors, "falsification_route too short")
    require(len(str(packet["next_executable_action"])) >= 15, errors, "next_executable_action too short")

    missingness = packet["missingness"]
    require(isinstance(missingness, dict), errors, "missingness must be an object")
    if isinstance(missingness, dict):
        require(missingness.get("state") in ALLOWED_MISSINGNESS, errors, "invalid missingness.state")
        require(missingness.get("does_not_mean_absence") is True, errors, "missingness must not mean absence")

    chain = packet["provenance_chain"]
    require(isinstance(chain, list), errors, "provenance_chain must be a list")
    require(len(chain) >= 2 if isinstance(chain, list) else False, errors, "provenance_chain requires at least two steps")

    has_private_boundary = False
    has_measured_or_external = False
    if isinstance(chain, list):
        expected_steps = list(range(1, len(chain) + 1))
        actual_steps = [step.get("step") for step in chain if isinstance(step, dict)]
        require(actual_steps == expected_steps, errors, "provenance steps must be contiguous and ordered")

        for index, step in enumerate(chain, start=1):
            require(isinstance(step, dict), errors, f"provenance step {index} must be an object")
            if not isinstance(step, dict):
                continue
            require(step.get("actor") in ALLOWED_ACTORS, errors, f"invalid actor at step {index}")
            require(step.get("artifact_type") in ALLOWED_ARTIFACT_TYPES, errors, f"invalid artifact_type at step {index}")
            require(step.get("public_boundary") in ALLOWED_PUBLIC_BOUNDARIES, errors, f"invalid public_boundary at step {index}")
            require(step.get("claim_boundary") in ALLOWED_CLAIM_BOUNDARIES, errors, f"invalid claim_boundary at step {index}")
            if step.get("public_boundary") == "reject_private":
                has_private_boundary = True
            if step.get("claim_boundary") == "measured" or step.get("actor") == "external_public_source":
                has_measured_or_external = True

    variables = packet["measurable_variables"]
    require(isinstance(variables, list), errors, "measurable_variables must be a list")
    require(len(variables) >= 1 if isinstance(variables, list) else False, errors, "at least one measurable variable required")
    if isinstance(variables, list):
        for index, variable in enumerate(variables, start=1):
            require(isinstance(variable, dict), errors, f"variable {index} must be an object")
            if not isinstance(variable, dict):
                continue
            require(bool(variable.get("name")), errors, f"variable {index} requires name")
            require(bool(variable.get("unit_or_scale")), errors, f"variable {index} requires unit_or_scale")
            require(
                variable.get("collection_boundary") in ALLOWED_COLLECTION_BOUNDARIES,
                errors,
                f"variable {index} has invalid collection_boundary",
            )

    if packet["privacy_status"] == "reject_private" or has_private_boundary:
        errors.append("reject_private packets cannot be admitted to public discovery memory")

    if packet["claim_status"] in {"supported", "contradicted"}:
        require(
            has_measured_or_external,
            errors,
            "supported or contradicted claims require measured or external-public provenance",
        )

    return len(errors) == 0, errors


def run_fixture_file(path: Path) -> int:
    payload = json.loads(path.read_text(encoding="utf-8"))
    fixtures = payload.get("fixtures", [])
    failures: List[str] = []

    for fixture in fixtures:
        name = fixture.get("name", "unnamed_fixture")
        expected = fixture.get("expected_valid")
        actual, errors = validate_packet(fixture.get("packet", {}))
        if actual != expected:
            failures.append(f"{name}: expected {expected}, got {actual}; errors={errors}")

    if failures:
        print("FAIL")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"PASS: {len(fixtures)} provenance-chain fixtures behaved as expected")
    return 0


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate_provenance_chain_packets.py <fixtures.synthetic.json>", file=sys.stderr)
        return 2
    return run_fixture_file(Path(argv[1]))


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
