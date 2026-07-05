#!/usr/bin/env python3
"""
Mirror Cartographer Desire Simulator Prototype

Purpose
-------
This tool simulates "desire" as an executable prioritization function for
Mirror Cartographer. It does not claim consciousness, feeling, agency, or
sentience. It creates a practical substitute for desire: a ranked pressure
field that selects which hypothesis, test, prototype, or evidence gap should
be advanced next.

Why this exists
---------------
MC's cure/discovery ambition needs more than frontier scanning. It needs a
repeatable way to choose unusual but testable directions that may expose new
findings. This component turns tensions, anomalies, care impact, evidence gaps,
novelty, and testability into a scored build queue.

Public-safety boundary
----------------------
Inputs should be public-safe abstractions. Do not enter private health records,
pet records, household details, identifying data, or raw transcripts. Medical
or veterinary outputs are research-organization artifacts only, not diagnosis,
treatment, or veterinary advice.

Labels
------
source_status: design prototype; no external claims required for core scoring
claim_status: engineering hypothesis, not validated
privacy_status: public-safe if only synthetic/abstract inputs are used
missingness: real-world calibration data, benchmark set, human review data
revision_reason: convert MC discovery desire into executable ranking logic
implementation_status: runnable Python CLI prototype
testability: deterministic scoring can be unit-tested against fixtures
next_executable_action: add JSON Schema, sample fixtures, and pytest tests
"""

from __future__ import annotations

import argparse
import json
import math
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, Optional


WEIGHTS: Dict[str, float] = {
    "care_impact": 1.35,
    "evidence_gap": 1.20,
    "anomaly_strength": 1.15,
    "novel_connection": 1.05,
    "testability": 1.30,
    "buildability": 1.10,
    "privacy_safety": 1.00,
    "falsifiability": 1.25,
    "frontier_relevance": 0.85,
    "contradiction_pressure": 1.10,
}

REQUIRED_FIELDS = set(WEIGHTS.keys()) | {"id", "title", "claim", "next_action"}


@dataclass(frozen=True)
class DesireCandidate:
    """A public-safe candidate hypothesis, test, or prototype target."""

    id: str
    title: str
    claim: str
    next_action: str
    care_impact: float
    evidence_gap: float
    anomaly_strength: float
    novel_connection: float
    testability: float
    buildability: float
    privacy_safety: float
    falsifiability: float
    frontier_relevance: float
    contradiction_pressure: float
    notes: str = ""

    @classmethod
    def from_mapping(cls, data: Mapping[str, Any]) -> "DesireCandidate":
        missing = sorted(REQUIRED_FIELDS - set(data.keys()))
        if missing:
            raise ValueError(f"candidate missing required fields: {missing}")

        numeric: Dict[str, float] = {}
        for key in WEIGHTS:
            try:
                value = float(data[key])
            except (TypeError, ValueError) as exc:
                raise ValueError(f"{data.get('id', '<unknown>')}: {key} must be numeric") from exc
            if value < 0 or value > 1:
                raise ValueError(f"{data.get('id', '<unknown>')}: {key} must be between 0 and 1")
            numeric[key] = value

        return cls(
            id=str(data["id"]),
            title=str(data["title"]),
            claim=str(data["claim"]),
            next_action=str(data["next_action"]),
            notes=str(data.get("notes", "")),
            **numeric,
        )


def weighted_desire_score(candidate: DesireCandidate) -> float:
    """
    Compute a desire-like pressure score.

    The multiplier rewards candidates that are simultaneously testable and
    falsifiable. The penalty discourages low privacy safety, because MC should
    prefer public-safe discovery infrastructure over exposing sensitive material.
    """

    raw = sum(getattr(candidate, key) * weight for key, weight in WEIGHTS.items())
    max_raw = sum(WEIGHTS.values())
    base = raw / max_raw

    test_gate = math.sqrt(max(candidate.testability * candidate.falsifiability, 0.0))
    privacy_penalty = 1.0 - ((1.0 - candidate.privacy_safety) * 0.35)
    build_pressure = 0.65 + (candidate.buildability * 0.35)

    return round(base * (0.75 + 0.25 * test_gate) * privacy_penalty * build_pressure, 6)


def explain_score(candidate: DesireCandidate, score: float) -> Dict[str, Any]:
    ranked_drivers = sorted(
        [
            {"factor": key, "value": getattr(candidate, key), "weighted": round(getattr(candidate, key) * weight, 4)}
            for key, weight in WEIGHTS.items()
        ],
        key=lambda item: item["weighted"],
        reverse=True,
    )

    if candidate.privacy_safety < 0.75:
        route = "abstract further before use; do not ingest private records"
    elif candidate.testability < 0.55:
        route = "convert claim into measurable variables before building"
    elif candidate.falsifiability < 0.55:
        route = "define what observation would disprove or weaken the claim"
    elif candidate.buildability < 0.55:
        route = "write interface/spec first, then implement"
    else:
        route = candidate.next_action

    return {
        "id": candidate.id,
        "title": candidate.title,
        "desire_score": score,
        "claim": candidate.claim,
        "top_drivers": ranked_drivers[:4],
        "risk_flags": risk_flags(candidate),
        "selected_next_action": route,
        "notes": candidate.notes,
        "labels": {
            "source_status": "user/system supplied candidate or synthetic fixture",
            "claim_status": "unvalidated until tested",
            "privacy_status": "safe only if candidate is abstract/synthetic",
            "missingness": "needs benchmark fixtures and human review calibration",
            "revision_reason": "rank next MC discovery action by pressure field",
            "implementation_status": "prototype score generated",
            "testability": "score is deterministic; candidate claim may require separate test",
        },
    }


def risk_flags(candidate: DesireCandidate) -> List[str]:
    flags: List[str] = []
    if candidate.privacy_safety < 0.75:
        flags.append("privacy_boundary_needed")
    if candidate.testability < 0.55:
        flags.append("low_testability")
    if candidate.falsifiability < 0.55:
        flags.append("weak_falsification_route")
    if candidate.evidence_gap > 0.8 and candidate.frontier_relevance < 0.4:
        flags.append("possible_speculation_drift")
    if candidate.care_impact > 0.8 and candidate.buildability < 0.45:
        flags.append("high_care_low_buildability")
    return flags


def rank_candidates(candidates: Iterable[DesireCandidate]) -> List[Dict[str, Any]]:
    scored = [(candidate, weighted_desire_score(candidate)) for candidate in candidates]
    scored.sort(key=lambda pair: pair[1], reverse=True)
    return [explain_score(candidate, score) for candidate, score in scored]


def load_candidates(path: Path) -> List[DesireCandidate]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, dict):
        payload = payload.get("candidates", [])
    if not isinstance(payload, list):
        raise ValueError("input must be a list or an object with a 'candidates' list")
    return [DesireCandidate.from_mapping(item) for item in payload]


def demo_candidates() -> List[DesireCandidate]:
    return [
        DesireCandidate(
            id="mc-hyp-001",
            title="Symbolic observation packet validator",
            claim="Narrative-symbolic observations can be converted into privacy-preserving structured packets without losing the user's meaning boundary.",
            next_action="Create JSON Schema and validate three synthetic observation packets.",
            care_impact=0.86,
            evidence_gap=0.74,
            anomaly_strength=0.65,
            novel_connection=0.78,
            testability=0.88,
            buildability=0.92,
            privacy_safety=0.91,
            falsifiability=0.82,
            frontier_relevance=0.68,
            contradiction_pressure=0.72,
            notes="Good first executable bridge between symbolic cognition and research-grade structure.",
        ),
        DesireCandidate(
            id="mc-hyp-002",
            title="Animal-care evidence boundary map",
            claim="Pet observation notes can be reorganized into vet-question prep while avoiding diagnosis-like output.",
            next_action="Build a red/yellow/green evidence-boundary rubric with synthetic examples.",
            care_impact=0.91,
            evidence_gap=0.68,
            anomaly_strength=0.58,
            novel_connection=0.63,
            testability=0.76,
            buildability=0.80,
            privacy_safety=0.84,
            falsifiability=0.70,
            frontier_relevance=0.55,
            contradiction_pressure=0.66,
            notes="Useful for care infrastructure; must keep strict non-advice boundary.",
        ),
        DesireCandidate(
            id="mc-hyp-003",
            title="Context-switch inference ledger",
            claim="When MC explicitly switches context, it can log which new inferences became available and which became invalid.",
            next_action="Implement a context switch ledger fixture and scoring rule.",
            care_impact=0.70,
            evidence_gap=0.81,
            anomaly_strength=0.82,
            novel_connection=0.86,
            testability=0.83,
            buildability=0.87,
            privacy_safety=0.96,
            falsifiability=0.79,
            frontier_relevance=0.74,
            contradiction_pressure=0.88,
            notes="Core MC reasoning primitive with broad discovery relevance.",
        ),
    ]


def main() -> None:
    parser = argparse.ArgumentParser(description="Rank MC discovery candidates using simulated desire pressure.")
    parser.add_argument("--input", type=Path, help="JSON file containing candidates")
    parser.add_argument("--output", type=Path, help="Optional output JSON path")
    parser.add_argument("--demo", action="store_true", help="Run built-in synthetic demo candidates")
    args = parser.parse_args()

    if args.input:
        candidates = load_candidates(args.input)
    elif args.demo:
        candidates = demo_candidates()
    else:
        raise SystemExit("Provide --input candidates.json or use --demo")

    result = {
        "component": "mc_desire_simulator",
        "boundary": "prioritization engine; not sentience, feeling, or autonomous agency",
        "ranked_candidates": rank_candidates(candidates),
    }

    text = json.dumps(result, indent=2, ensure_ascii=False)
    if args.output:
        args.output.write_text(text + "\n", encoding="utf-8")
    else:
        print(text)


if __name__ == "__main__":
    main()
