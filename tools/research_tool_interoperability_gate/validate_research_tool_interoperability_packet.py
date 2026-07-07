#!/usr/bin/env python3
"""Validate Research Tool Interoperability packets.

Run from repository root:
python tools/research_tool_interoperability_gate/validate_research_tool_interoperability_packet.py \
  tools/research_tool_interoperability_gate/fixtures/valid_packet.json
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List

ALLOWED_PRIVACY = {"public_safe_synthetic", "public_sources_only", "restricted_private_data", "unknown"}
ALLOWED_EVIDENCE = {"low", "moderate", "high", "mixed"}
ALLOWED_REPRO = {"open", "documented", "closed", "unknown"}
ALLOWED_RISK = {"none", "low", "moderate", "high", "unknown"}
ALLOWED_IDENTIFIABILITY = {"synthetic", "deidentified", "identified", "unknown"}

REQUIRED_FIELDS = [
    "packet_id",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "evidence_strength",
    "falsification_route",
    "next_executable_action",
    "toolchain_components",
    "data_boundary",
    "execution_environment",
    "provenance_log",
    "human_review_role",
    "blocked_inferences",
]


def _nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and len(value.strip()) >= 3


def _nonempty_list(value: Any) -> bool:
    return isinstance(value, list) and len(value) > 0


def validate_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    errors: List[str] = []

    missing = [field for field in REQUIRED_FIELDS if field not in packet]
    if missing:
        errors.append("missing_required_fields:" + ",".join(missing))

    for field in [
        "packet_id",
        "source_status",
        "claim_status",
        "revision_reason",
        "implementation_status",
        "falsification_route",
        "next_executable_action",
        "human_review_role",
    ]:
        if field in packet and not _nonempty_string(packet[field]):
            errors.append(f"{field}_must_be_nonempty_string")

    if packet.get("privacy_status") not in ALLOWED_PRIVACY:
        errors.append("privacy_status_not_allowed")
    if packet.get("evidence_strength") not in ALLOWED_EVIDENCE:
        errors.append("evidence_strength_not_allowed")

    if not _nonempty_list(packet.get("missingness")):
        errors.append("missingness_must_be_explicit")
    if not _nonempty_list(packet.get("provenance_log")):
        errors.append("provenance_log_required")
    if not _nonempty_list(packet.get("blocked_inferences")):
        errors.append("blocked_inferences_required")

    components = packet.get("toolchain_components")
    if not isinstance(components, list) or len(components) < 2:
        errors.append("toolchain_components_requires_at_least_two_tools")
    else:
        for idx, component in enumerate(components):
            if not isinstance(component, dict):
                errors.append(f"toolchain_component_{idx}_must_be_object")
                continue
            for field in ["name", "role", "reproducibility_status", "privacy_risk"]:
                if field not in component:
                    errors.append(f"toolchain_component_{idx}_missing_{field}")
            if not _nonempty_string(component.get("name")):
                errors.append(f"toolchain_component_{idx}_name_invalid")
            if not _nonempty_string(component.get("role")):
                errors.append(f"toolchain_component_{idx}_role_invalid")
            if component.get("reproducibility_status") not in ALLOWED_REPRO:
                errors.append(f"toolchain_component_{idx}_reproducibility_status_invalid")
            if component.get("privacy_risk") not in ALLOWED_RISK:
                errors.append(f"toolchain_component_{idx}_privacy_risk_invalid")

    boundary = packet.get("data_boundary")
    if not isinstance(boundary, dict):
        errors.append("data_boundary_must_be_object")
    else:
        for field in ["data_type", "species_or_subject", "identifiability", "allowed_use"]:
            if field not in boundary:
                errors.append(f"data_boundary_missing_{field}")
        if boundary.get("identifiability") not in ALLOWED_IDENTIFIABILITY:
            errors.append("data_boundary_identifiability_invalid")
        if not _nonempty_string(boundary.get("allowed_use")):
            errors.append("data_boundary_allowed_use_invalid")

    env = packet.get("execution_environment")
    if not isinstance(env, dict):
        errors.append("execution_environment_must_be_object")
    else:
        for field in ["environment_type", "versioning", "external_dependencies"]:
            if field not in env:
                errors.append(f"execution_environment_missing_{field}")
        if not isinstance(env.get("external_dependencies"), list):
            errors.append("execution_environment_dependencies_must_be_list")

    if packet.get("privacy_status") in {"restricted_private_data", "unknown"}:
        errors.append("privacy_status_blocks_promotion")

    if errors:
        return {"packet_id": packet.get("packet_id", "unknown"), "valid": False, "errors": errors}
    return {"packet_id": packet["packet_id"], "valid": True, "errors": []}


def main(argv: List[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_research_tool_interoperability_packet.py <packet.json>", file=sys.stderr)
        return 2
    packet_path = Path(argv[1])
    packet = json.loads(packet_path.read_text(encoding="utf-8"))
    result = validate_packet(packet)
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
