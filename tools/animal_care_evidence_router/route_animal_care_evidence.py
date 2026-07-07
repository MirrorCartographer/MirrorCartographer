#!/usr/bin/env python3
"""Route synthetic animal-care observation packets into evidence-boundary queues.

This tool is intentionally conservative. It does not diagnose or advise treatment.
It only classifies whether an observation packet is structured enough for tracking,
hypothesis work, veterinary review, or urgent-boundary escalation.
"""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

URGENT_TERMS = {
    "breathing effort",
    "trouble breathing",
    "collapse",
    "seizure",
    "unable to walk",
    "eye swelling",
    "bloody eye",
    "severe pain",
}
REVIEW_TERMS = {
    "enlarged lymph nodes",
    "medication exposure noted",
    "reduced appetite",
    "lower appetite",
    "vomiting",
    "glaucoma",
    "heart murmur",
}
VAGUE_TERMS = {"off", "weird", "not right", "different"}


@dataclass(frozen=True)
class RoutedPacket:
    packet_id: str
    route: str
    risk_flags: list[str]
    evidence_boundary: str
    safe_summary: str
    next_executable_action: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "packet_id": self.packet_id,
            "route": self.route,
            "risk_flags": self.risk_flags,
            "evidence_boundary": self.evidence_boundary,
            "safe_summary": self.safe_summary,
            "next_executable_action": self.next_executable_action,
        }


def _require_fields(packet: dict[str, Any]) -> list[str]:
    required = [
        "packet_id",
        "species",
        "observation_date",
        "signals",
        "context",
        "source_status",
        "claim_status",
        "privacy_status",
        "missingness",
    ]
    return [field for field in required if field not in packet]


def route_packet(packet: dict[str, Any]) -> RoutedPacket:
    missing_required = _require_fields(packet)
    packet_id = str(packet.get("packet_id", "unknown-packet"))
    if missing_required:
        return RoutedPacket(
            packet_id=packet_id,
            route="insufficient_data",
            risk_flags=[f"missing_required:{field}" for field in missing_required],
            evidence_boundary="cannot_route_without_required_schema",
            safe_summary="Packet is missing required routing fields.",
            next_executable_action="repair_schema_and_revalidate_packet",
        )

    signals = [str(s).strip().lower() for s in packet.get("signals", [])]
    context = [str(c).strip().lower() for c in packet.get("context", [])]
    missingness = [str(m).strip().lower() for m in packet.get("missingness", [])]
    species = str(packet.get("species", "other"))

    urgent_hits = sorted(set(signals) & URGENT_TERMS)
    review_hits = sorted((set(signals) | set(context)) & REVIEW_TERMS)
    vague_hits = sorted(set(signals) & VAGUE_TERMS)

    if urgent_hits:
        route = "urgent_boundary"
        boundary = "safety_boundary_only_no_diagnosis_or_treatment_advice"
        action = "prepare_public_safe_observation_summary_for_veterinary_review"
        flags = [f"urgent_signal:{hit}" for hit in urgent_hits]
    elif len(signals) < 2 or vague_hits or len(missingness) >= 3:
        route = "insufficient_data"
        boundary = "too_sparse_for_pattern_or_hypothesis"
        action = "collect_duration_severity_frequency_context_and_measurements"
        flags = [f"vague_signal:{hit}" for hit in vague_hits] + ["high_missingness"]
    elif review_hits:
        route = "needs_vet_review"
        boundary = "clinician_review_queue_not_advice"
        action = "attach_measurements_timeline_and_questions_for_veterinary_review"
        flags = [f"review_signal:{hit}" for hit in review_hits]
    elif len(signals) >= 2 and len(missingness) <= 2:
        route = "hypothesis_candidate"
        boundary = "hypothesis_queue_requires_falsification_before_claim"
        action = "send_to_longitudinal_window_validator_and_falsification_runner"
        flags = ["measurable_multi_signal_packet"]
    else:
        route = "track"
        boundary = "observation_tracking_only"
        action = "append_to_longitudinal_observation_log"
        flags = []

    safe_summary = (
        f"{species} packet contains {len(signals)} observable signal(s), "
        f"{len(context)} context tag(s), and {len(missingness)} missingness item(s)."
    )
    return RoutedPacket(packet_id, route, flags, boundary, safe_summary, action)


def route_packets(packets: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [route_packet(packet).to_dict() for packet in packets]


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: route_animal_care_evidence.py <packets.json>", file=sys.stderr)
        return 2
    input_path = Path(argv[1])
    packets = json.loads(input_path.read_text(encoding="utf-8"))
    if not isinstance(packets, list):
        raise ValueError("input must be a JSON array of packets")
    print(json.dumps(route_packets(packets), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
