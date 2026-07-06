#!/usr/bin/env python3
"""Mirror Cartographer synthetic discovery-pipeline regression runner.

This runner is intentionally public-safe and synthetic-only. It checks whether a
candidate discovery packet can move through a minimal MC pipeline without privacy
leakage, missing variables, unsupported evidence, or invalid transitions.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Callable

ALLOWED_SOURCE_STATUS = {"primary", "secondary", "preprint", "institutional", "synthetic"}
ALLOWED_EVIDENCE_STRENGTH = {"low", "moderate", "high"}
PRIVATE_PATTERNS = [
    re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}", re.IGNORECASE),
    re.compile(r"\\b\\d{3}[-.]?\\d{2}[-.]?\\d{4}\\b"),
    re.compile(r"\\b(?:\\+?1[-. ]?)?\\(?\\d{3}\\)?[-. ]?\\d{3}[-. ]?\\d{4}\\b"),
]


@dataclass
class StageResult:
    stage: str
    status: str
    reason: str
    latency_ms: float


@dataclass
class PipelineResult:
    packet_id: str
    pipeline_status: str
    executed_stages: list[str]
    failed_stage: str | None
    failure_reason: str | None
    transition_log: list[dict[str, Any]]
    warnings: list[str]


class ValidationError(Exception):
    pass


def _require(condition: bool, reason: str) -> None:
    if not condition:
        raise ValidationError(reason)


def _walk_strings(value: Any) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        out: list[str] = []
        for item in value:
            out.extend(_walk_strings(item))
        return out
    if isinstance(value, dict):
        out = []
        for item in value.values():
            out.extend(_walk_strings(item))
        return out
    return []


def validate_privacy(packet: dict[str, Any]) -> None:
    _require(packet.get("privacy_status") == "public_safe_synthetic", "packet privacy_status must be public_safe_synthetic")
    for text in _walk_strings(packet):
        for pattern in PRIVATE_PATTERNS:
            _require(pattern.search(text) is None, "private identifier pattern detected")
    forbidden_keys = {"name", "address", "email", "phone", "private_identifier", "raw_transcript"}
    present = forbidden_keys.intersection(packet.keys())
    _require(not present, f"forbidden private key(s) present: {sorted(present)}")


def validate_phenomenon(packet: dict[str, Any]) -> None:
    phenomenon = packet.get("phenomenon")
    _require(isinstance(phenomenon, dict), "missing phenomenon object")
    _require(bool(phenomenon.get("description")), "phenomenon description is required")
    _require(len(phenomenon.get("variables", [])) > 0, "phenomenon requires measurable variables")
    _require(len(phenomenon.get("boundaries", [])) > 0, "phenomenon requires boundaries")
    _require(len(phenomenon.get("alternatives", [])) > 0, "phenomenon requires alternatives")


def validate_hypothesis(packet: dict[str, Any]) -> None:
    hypothesis = packet.get("hypothesis")
    _require(isinstance(hypothesis, dict), "missing hypothesis object")
    _require(bool(hypothesis.get("claim")), "hypothesis claim is required")
    _require(hypothesis.get("source_status") in ALLOWED_SOURCE_STATUS, "unsupported hypothesis source_status")
    _require(len(hypothesis.get("measurable_variables", [])) > 0, "hypothesis requires measurable variables")
    _require(bool(hypothesis.get("falsification_route")), "hypothesis requires falsification route")


def validate_mechanism(packet: dict[str, Any]) -> None:
    mechanism = packet.get("mechanism")
    _require(isinstance(mechanism, dict), "missing mechanism object")
    _require(len(mechanism.get("nodes", [])) >= 2, "mechanism requires at least two nodes")
    _require(len(mechanism.get("edges", [])) >= 1, "mechanism requires at least one edge")
    _require(len(mechanism.get("observable_outputs", [])) >= 1, "mechanism requires observable outputs")
    _require(len(mechanism.get("alternatives", [])) >= 1, "mechanism requires alternative explanation")


def validate_prediction(packet: dict[str, Any]) -> None:
    prediction = packet.get("prediction")
    _require(isinstance(prediction, dict), "missing prediction object")
    _require(len(prediction.get("measurable_variables", [])) > 0, "prediction requires measurable variables")
    _require(bool(prediction.get("observation_window")), "prediction requires observation window")
    _require(bool(prediction.get("failure_condition")), "prediction requires failure condition")
    _require(len(prediction.get("alternative_outcomes", [])) > 0, "prediction requires alternative outcomes")


def validate_evidence_crosswalk(packet: dict[str, Any]) -> None:
    evidence = packet.get("evidence_crosswalk")
    _require(isinstance(evidence, dict), "missing evidence_crosswalk object")
    _require(evidence.get("source_status") in ALLOWED_SOURCE_STATUS, "unsupported evidence source_status")
    _require(evidence.get("evidence_strength") in ALLOWED_EVIDENCE_STRENGTH, "unsupported evidence strength")
    _require(len(evidence.get("measurable_variables", [])) > 0, "evidence requires measurable variables")
    _require(len(evidence.get("limitations", [])) > 0, "evidence requires limitations")
    _require(bool(evidence.get("falsification_route")), "evidence requires falsification route")


def validate_transition(packet: dict[str, Any]) -> None:
    transition = packet.get("transition")
    _require(isinstance(transition, dict), "missing transition object")
    _require(transition.get("allowed") is True, "transition must be explicitly allowed")
    _require(bool(transition.get("from_state")) and bool(transition.get("to_state")), "transition requires from_state and to_state")
    _require(bool(transition.get("reason")), "transition requires reason")


VALIDATORS: list[tuple[str, Callable[[dict[str, Any]], None]]] = [
    ("PrivacyBoundaryValidator", validate_privacy),
    ("PhenomenonValidator", validate_phenomenon),
    ("HypothesisValidator", validate_hypothesis),
    ("MechanismGraphValidator", validate_mechanism),
    ("PredictionValidator", validate_prediction),
    ("EvidenceCrosswalkValidator", validate_evidence_crosswalk),
    ("EvidenceTransitionValidator", validate_transition),
]


def run_pipeline(packet: dict[str, Any]) -> PipelineResult:
    transition_log: list[dict[str, Any]] = []
    executed: list[str] = []
    warnings: list[str] = []
    for stage, validator in VALIDATORS:
        started = time.perf_counter()
        try:
            validator(packet)
        except ValidationError as exc:
            latency_ms = round((time.perf_counter() - started) * 1000, 3)
            transition_log.append(asdict(StageResult(stage, "FAIL", str(exc), latency_ms)))
            return PipelineResult(
                packet_id=str(packet.get("packet_id", "unknown")),
                pipeline_status="FAIL",
                executed_stages=executed + [stage],
                failed_stage=stage,
                failure_reason=str(exc),
                transition_log=transition_log,
                warnings=warnings,
            )
        latency_ms = round((time.perf_counter() - started) * 1000, 3)
        executed.append(stage)
        transition_log.append(asdict(StageResult(stage, "PASS", "ok", latency_ms)))

    return PipelineResult(
        packet_id=str(packet.get("packet_id", "unknown")),
        pipeline_status="PASS",
        executed_stages=executed,
        failed_stage=None,
        failure_reason=None,
        transition_log=transition_log,
        warnings=warnings,
    )


def run_fixture_file(path: Path) -> int:
    fixture_set = json.loads(path.read_text(encoding="utf-8"))
    failures: list[str] = []
    results = []
    for fixture in fixture_set.get("fixtures", []):
        result = run_pipeline(fixture["packet"])
        result_dict = asdict(result)
        result_dict["fixture_id"] = fixture.get("fixture_id")
        results.append(result_dict)
        if result.pipeline_status != fixture.get("expected_status"):
            failures.append(f"{fixture.get('fixture_id')}: expected status {fixture.get('expected_status')} got {result.pipeline_status}")
        expected_failed_stage = fixture.get("expected_failed_stage")
        if expected_failed_stage and result.failed_stage != expected_failed_stage:
            failures.append(f"{fixture.get('fixture_id')}: expected failed stage {expected_failed_stage} got {result.failed_stage}")

    print(json.dumps({"results": results, "failures": failures}, indent=2))
    return 1 if failures else 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Run MC synthetic pipeline regression fixtures.")
    parser.add_argument("fixture_file", type=Path, help="Path to fixtures.synthetic.json")
    args = parser.parse_args()
    return run_fixture_file(args.fixture_file)


if __name__ == "__main__":
    sys.exit(main())
