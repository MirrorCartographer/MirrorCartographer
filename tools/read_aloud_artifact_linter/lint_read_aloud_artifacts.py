#!/usr/bin/env python3
"""Mirror Cartographer read-aloud artifact linter.

Routes public-safe build artifacts into accepted, needs_revision, or blocked queues
based on accessibility, privacy, and claim-boundary checks.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Tuple

REQUIRED_FIELDS = {
    "artifact_id",
    "artifact_type",
    "source_status",
    "claim_status",
    "privacy_status",
    "content",
    "critical_terms",
    "revision_reason",
    "next_action",
}

REQUIRED_LABELS = [
    "Source status:",
    "Claim status:",
    "Privacy status:",
    "Missingness:",
    "Revision reason:",
    "Implementation status:",
    "Testability:",
    "Next executable action:",
]

VALID_ARTIFACT_TYPES = {
    "readme",
    "cli_output",
    "schema",
    "test_report",
    "provenance_packet",
    "ui_contract",
    "handoff_note",
}

VALID_SOURCE_STATUS = {"assistant_generated", "public_source", "synthetic_fixture", "unknown"}
VALID_CLAIM_STATUS = {
    "engineering_contract",
    "research_organization",
    "medical_claim",
    "veterinary_claim",
    "unknown",
}
VALID_PRIVACY_STATUS = {"public_safe", "redacted", "contains_private_residue", "unknown"}

BLOCKING_CLAIMS = {"medical_claim", "veterinary_claim", "unknown"}
BLOCKING_PRIVACY = {"contains_private_residue", "unknown"}
BLOCKING_SOURCE = {"unknown"}


@dataclass
class Decision:
    route: str
    artifact_id: str
    reasons: List[str]


def strip_code_fences(text: str) -> str:
    return re.sub(r"```.*?```", "", text, flags=re.DOTALL)


def count_code_fence_chars(text: str) -> int:
    return sum(len(match.group(0)) for match in re.finditer(r"```.*?```", text, flags=re.DOTALL))


def is_table_only(normal_text: str) -> bool:
    lines = [line.strip() for line in normal_text.splitlines() if line.strip()]
    if not lines:
        return False
    tableish = [line for line in lines if line.startswith("|") and line.endswith("|")]
    return len(tableish) == len(lines)


def has_purpose_line(normal_text: str) -> bool:
    return bool(re.search(r"(^|\n)\s*Purpose\s*:", normal_text, flags=re.IGNORECASE))


def validate_shape(packet: Dict[str, Any]) -> List[str]:
    reasons: List[str] = []
    missing = sorted(REQUIRED_FIELDS - set(packet))
    if missing:
        reasons.append("missing required fields: " + ", ".join(missing))
        return reasons

    if packet["artifact_type"] not in VALID_ARTIFACT_TYPES:
        reasons.append("unknown artifact_type")
    if packet["source_status"] not in VALID_SOURCE_STATUS:
        reasons.append("unknown source_status value")
    if packet["claim_status"] not in VALID_CLAIM_STATUS:
        reasons.append("unknown claim_status value")
    if packet["privacy_status"] not in VALID_PRIVACY_STATUS:
        reasons.append("unknown privacy_status value")
    if not isinstance(packet["critical_terms"], list):
        reasons.append("critical_terms must be a list")
    if not isinstance(packet["content"], str) or not packet["content"].strip():
        reasons.append("content must be non-empty text")
    return reasons


def lint_packet(packet: Dict[str, Any]) -> Decision:
    artifact_id = str(packet.get("artifact_id", "<missing>"))
    shape_errors = validate_shape(packet)
    if shape_errors:
        return Decision("blocked", artifact_id, shape_errors)

    reasons: List[str] = []
    block_reasons: List[str] = []

    if packet["source_status"] in BLOCKING_SOURCE:
        block_reasons.append("source status is unknown")
    if packet["privacy_status"] in BLOCKING_PRIVACY:
        block_reasons.append("privacy boundary blocks public-safe reuse")
    if packet["claim_status"] in BLOCKING_CLAIMS:
        block_reasons.append("claim status is not allowed for public-safe artifact handoff")

    content = packet["content"]
    normal_text = strip_code_fences(content)
    normal_lower = normal_text.lower()

    if count_code_fence_chars(content) >= max(1, int(len(content) * 0.80)):
        reasons.append("artifact is mostly code fences; add read-aloud prose outside code blocks")
    if not has_purpose_line(normal_text):
        reasons.append("missing plain purpose line outside code fences")
    if is_table_only(normal_text):
        reasons.append("artifact is table-only; add prose labels for read-aloud output")

    for label in REQUIRED_LABELS:
        if label.lower() not in normal_lower:
            reasons.append(f"missing read-aloud label outside code fences: {label}")

    for term in packet["critical_terms"]:
        if not isinstance(term, str) or not term.strip():
            reasons.append("critical_terms contains a non-text or blank term")
            continue
        if term.lower() not in normal_lower:
            reasons.append(f"critical term not exposed outside code fences: {term}")

    if not str(packet["revision_reason"]).strip():
        reasons.append("revision_reason is blank")
    if not str(packet["next_action"]).strip():
        reasons.append("next_action is blank")

    if block_reasons:
        return Decision("blocked", artifact_id, block_reasons + reasons)
    if reasons:
        return Decision("needs_revision", artifact_id, reasons)
    return Decision("accepted", artifact_id, ["read-aloud artifact boundary passed"])


def load_artifacts(path: str) -> List[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as handle:
        payload = json.load(handle)
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict) and isinstance(payload.get("artifacts"), list):
        return payload["artifacts"]
    raise ValueError("input must be a list or an object with an artifacts list")


def run(path: str) -> Dict[str, Any]:
    artifacts = load_artifacts(path)
    result: Dict[str, Any] = {
        "accepted": [],
        "needs_revision": [],
        "blocked": [],
        "summary": {"accepted": 0, "needs_revision": 0, "blocked": 0},
    }
    for packet in artifacts:
        decision = lint_packet(packet)
        result[decision.route].append({
            "artifact_id": decision.artifact_id,
            "reasons": decision.reasons,
        })
        result["summary"][decision.route] += 1
    return result


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Lint MC artifacts for read-aloud accessibility boundaries.")
    parser.add_argument("path", help="JSON artifact fixture or packet file")
    args = parser.parse_args(list(argv) if argv is not None else None)

    try:
        result = run(args.path)
    except Exception as exc:  # pragma: no cover - CLI boundary
        print(json.dumps({"error": str(exc)}, indent=2, sort_keys=True), file=sys.stderr)
        return 2

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
