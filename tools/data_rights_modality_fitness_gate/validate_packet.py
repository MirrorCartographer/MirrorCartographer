#!/usr/bin/env python3
"""Validate Data Rights Modality Fitness Gate packets.

This validator is intentionally dependency-light. It checks the operational
constraints that matter most for MC discovery-memory admission even when a full
JSON Schema validator is not installed.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

REQUIRED_TOP_LEVEL = [
    "packet_id",
    "source_status",
    "claim_status",
    "privacy_status",
    "data_rights_status",
    "modality_map",
    "task_fit",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
]

ALLOWED_SOURCE_STATUS = {"primary", "institutional", "preprint", "benchmark", "open_source", "synthetic", "mixed"}
ALLOWED_CLAIM_STATUS = {"research_organization", "infrastructure_hypothesis", "evaluation_criterion", "prototype_requirement", "collaborator_target", "rejected_advice_like"}
ALLOWED_REUSE_BOUNDARY = {"public_safe", "internal_only", "collaborator_review", "do_not_store"}
ALLOWED_FIT = {"fit", "partially_fit", "not_fit", "unknown"}
ALLOWED_IMPACT = {"blocks_promotion", "downgrades_strength", "requires_review", "no_material_gap"}


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as fh:
        value = json.load(fh)
    if not isinstance(value, dict):
        raise ValueError("packet must be a JSON object")
    return value


def require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def validate(packet: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    for field in REQUIRED_TOP_LEVEL:
        require(field in packet, f"missing required field: {field}", errors)
    if errors:
        return errors

    require(packet["source_status"] in ALLOWED_SOURCE_STATUS, "invalid source_status", errors)
    require(packet["claim_status"] in ALLOWED_CLAIM_STATUS, "invalid claim_status", errors)

    privacy = packet.get("privacy_status", {})
    rights = packet.get("data_rights_status", {})
    task_fit = packet.get("task_fit", {})
    missingness = packet.get("missingness", {})
    modalities = packet.get("modality_map", [])

    require(isinstance(privacy, dict), "privacy_status must be object", errors)
    require(isinstance(rights, dict), "data_rights_status must be object", errors)
    require(isinstance(task_fit, dict), "task_fit must be object", errors)
    require(isinstance(missingness, dict), "missingness must be object", errors)
    require(isinstance(modalities, list) and len(modalities) > 0, "modality_map must be non-empty array", errors)

    reuse_boundary = privacy.get("reuse_boundary")
    require(reuse_boundary in ALLOWED_REUSE_BOUNDARY, "invalid privacy_status.reuse_boundary", errors)
    raw_sensitive = privacy.get("raw_sensitive_data_present")
    require(isinstance(raw_sensitive, bool), "privacy_status.raw_sensitive_data_present must be boolean", errors)

    consent_scope = rights.get("consent_scope")
    redistribution = rights.get("redistribution_allowed")
    commercial = rights.get("commercial_use_allowed")
    require(consent_scope in {"explicit_research", "clinical_care_only", "public_dataset", "synthetic", "unknown"}, "invalid data_rights_status.consent_scope", errors)
    require(redistribution in {"yes", "no", "unknown", "not_applicable"}, "invalid data_rights_status.redistribution_allowed", errors)
    require(commercial in {"yes", "no", "unknown", "not_applicable"}, "invalid data_rights_status.commercial_use_allowed", errors)

    fit_level = task_fit.get("fit_level")
    require(fit_level in ALLOWED_FIT, "invalid task_fit.fit_level", errors)
    require(isinstance(task_fit.get("human_review_required"), bool), "task_fit.human_review_required must be boolean", errors)

    impact = missingness.get("impact_on_claim")
    require(impact in ALLOWED_IMPACT, "invalid missingness.impact_on_claim", errors)

    for i, modality in enumerate(modalities):
        require(isinstance(modality, dict), f"modality_map[{i}] must be object", errors)
        if isinstance(modality, dict):
            require(bool(modality.get("observed_signal")), f"modality_map[{i}].observed_signal missing", errors)
            require(bool(modality.get("durable_endpoint")), f"modality_map[{i}].durable_endpoint missing", errors)
            failures = modality.get("known_failure_modes")
            require(isinstance(failures, list) and len(failures) > 0, f"modality_map[{i}].known_failure_modes must be non-empty", errors)

    # Gate-specific admission logic.
    if raw_sensitive and reuse_boundary == "public_safe":
        errors.append("raw sensitive data cannot be marked public_safe")
    if consent_scope in {"clinical_care_only", "unknown"} and reuse_boundary == "public_safe":
        errors.append("clinical-care-only or unknown consent cannot be promoted as public_safe")
    if redistribution == "no" and reuse_boundary == "public_safe":
        errors.append("non-redistributable data cannot be promoted as public_safe")
    if impact == "blocks_promotion" and packet.get("implementation_status") in {"tested", "wired_into_ci"}:
        errors.append("blocked packets cannot be marked tested/wired as admissible")
    if fit_level in {"not_fit", "unknown"} and packet.get("claim_status") not in {"rejected_advice_like", "prototype_requirement"}:
        errors.append("not-fit/unknown modality packets must be rejected or converted to prototype requirements")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: validate_packet.py <packet.json> [<packet.json> ...]", file=sys.stderr)
        return 2

    failed = False
    for arg in argv[1:]:
        path = Path(arg)
        try:
            packet = load_json(path)
            errors = validate(packet)
        except Exception as exc:  # noqa: BLE001 - CLI should show any parse/load error.
            errors = [str(exc)]
        if errors:
            failed = True
            print(f"FAIL {path}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {path}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
