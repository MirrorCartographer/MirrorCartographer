#!/usr/bin/env python3
"""Regression tests for route_animal_care_evidence.py."""

from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("route_animal_care_evidence.py")
spec = importlib.util.spec_from_file_location("route_animal_care_evidence", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def test_urgent_boundary_for_eye_or_breathing_signal() -> None:
    packet = {
        "packet_id": "p1",
        "species": "dog",
        "observation_date": "2026-07-01",
        "signals": ["eye swelling", "restlessness"],
        "context": [],
        "source_status": "synthetic_observation",
        "claim_status": "observation_only",
        "privacy_status": "public_safe_synthetic",
        "missingness": [],
    }
    routed = module.route_packet(packet).to_dict()
    assert routed["route"] == "urgent_boundary"
    assert "safety_boundary" in routed["evidence_boundary"]
    assert "treatment" not in routed["safe_summary"].lower()


def test_sparse_vague_packet_is_insufficient_data() -> None:
    packet = {
        "packet_id": "p2",
        "species": "cat",
        "observation_date": "2026-07-01",
        "signals": ["off"],
        "context": [],
        "source_status": "synthetic_observation",
        "claim_status": "unclear",
        "privacy_status": "public_safe_synthetic",
        "missingness": ["duration", "severity", "context"],
    }
    routed = module.route_packet(packet).to_dict()
    assert routed["route"] == "insufficient_data"
    assert "high_missingness" in routed["risk_flags"]


def test_review_signal_routes_to_vet_review() -> None:
    packet = {
        "packet_id": "p3",
        "species": "cat",
        "observation_date": "2026-07-01",
        "signals": ["enlarged lymph nodes", "lower appetite"],
        "context": [],
        "source_status": "synthetic_observation",
        "claim_status": "observation_only",
        "privacy_status": "public_safe_synthetic",
        "missingness": [],
    }
    routed = module.route_packet(packet).to_dict()
    assert routed["route"] == "needs_vet_review"
    assert routed["next_executable_action"] == "attach_measurements_timeline_and_questions_for_veterinary_review"


def test_measurable_multi_signal_packet_becomes_hypothesis_candidate() -> None:
    packet = {
        "packet_id": "p4",
        "species": "dog",
        "observation_date": "2026-07-01",
        "signals": ["night restlessness", "posture change"],
        "context": ["heat exposure"],
        "source_status": "synthetic_observation",
        "claim_status": "observation_only",
        "privacy_status": "public_safe_synthetic",
        "missingness": ["severity scale"],
    }
    routed = module.route_packet(packet).to_dict()
    assert routed["route"] == "hypothesis_candidate"
    assert "falsification" in routed["evidence_boundary"]


if __name__ == "__main__":
    test_urgent_boundary_for_eye_or_breathing_signal()
    test_sparse_vague_packet_is_insufficient_data()
    test_review_signal_routes_to_vet_review()
    test_measurable_multi_signal_packet_becomes_hypothesis_candidate()
    print("animal care evidence router tests passed")
