#!/usr/bin/env python3
"""
Triage Mirror Cartographer contradiction-ledger records into executable queues.

Purpose
-------
Discovery systems often preserve positive findings and quietly lose failed or
ambiguous results. This runner converts public-safe contradiction records into
ranked next actions so MC can route conflicts toward falsification, replication,
or missingness repair instead of letting claim memory drift.

Input contract
--------------
Accepts the existing contradiction-ledger fixture shape:

{
  "records": [
    {
      "id": "cr-YYYY-MM-DD-slug",
      "contradiction_status": "not_a_contradiction|candidate_contradiction|confirmed_contradiction|ambiguous_missing_data",
      "evidence_strength": "synthetic|weak|moderate|strong|replicated",
      "testability": "high|medium|low",
      "missingness": ["..."],
      "measurable_variables": [{"measurement_status": "measured|proxy|missing|simulated", ...}],
      "falsification_route": "...",
      "next_executable_action": "..."
    }
  ]
}

Output contract
---------------
Emits JSON with ranked queue items. No private data is needed or emitted.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, List
import argparse
import json

STATUS_BASE_SCORE = {
    "confirmed_contradiction": 100,
    "candidate_contradiction": 80,
    "ambiguous_missing_data": 55,
    "not_a_contradiction": 5,
}

EVIDENCE_WEIGHT = {
    "replicated": 30,
    "strong": 24,
    "moderate": 18,
    "weak": 8,
    "synthetic": 3,
}

TESTABILITY_WEIGHT = {
    "high": 20,
    "medium": 10,
    "low": 2,
}

ACTION_BY_STATUS = {
    "confirmed_contradiction": "open_regression_or_downgrade_task",
    "candidate_contradiction": "run_resolution_test",
    "ambiguous_missing_data": "repair_missing_measurement",
    "not_a_contradiction": "retain_as_control_or_archive",
}


@dataclass(frozen=True)
class TriageItem:
    id: str
    queue: str
    priority_score: int
    contradiction_status: str
    evidence_strength: str
    testability: str
    missing_variable_count: int
    missingness_count: int
    falsification_route: str
    next_executable_action: str


def load_records(path: Path) -> List[Dict[str, Any]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, dict) and "records" in payload:
        return payload["records"]
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        return [payload]
    raise ValueError("input must be a JSON object, list, or object with records[]")


def missing_variable_count(record: Dict[str, Any]) -> int:
    count = 0
    for variable in record.get("measurable_variables", []):
        if isinstance(variable, dict) and variable.get("measurement_status") == "missing":
            count += 1
    return count


def score_record(record: Dict[str, Any]) -> TriageItem:
    status = str(record.get("contradiction_status", "unknown"))
    evidence = str(record.get("evidence_strength", "synthetic"))
    testability = str(record.get("testability", "low"))
    missing_vars = missing_variable_count(record)
    missingness = record.get("missingness", [])
    missingness_count = len(missingness) if isinstance(missingness, list) else 1

    score = STATUS_BASE_SCORE.get(status, 0)
    score += EVIDENCE_WEIGHT.get(evidence, 0)
    score += TESTABILITY_WEIGHT.get(testability, 0)
    score += min(missing_vars * 8, 24)
    score += min(missingness_count * 2, 10)

    if not str(record.get("falsification_route", "")).strip():
        score -= 50
    if not str(record.get("next_executable_action", "")).strip():
        score -= 25

    return TriageItem(
        id=str(record.get("id", "unknown")),
        queue=ACTION_BY_STATUS.get(status, "manual_review"),
        priority_score=max(score, 0),
        contradiction_status=status,
        evidence_strength=evidence,
        testability=testability,
        missing_variable_count=missing_vars,
        missingness_count=missingness_count,
        falsification_route=str(record.get("falsification_route", "")),
        next_executable_action=str(record.get("next_executable_action", "")),
    )


def triage(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    items = [score_record(record) for record in records]
    items.sort(key=lambda item: (-item.priority_score, item.id))
    return {
        "schema_version": "1.0.0",
        "record_type": "contradiction_triage_queue",
        "source_status": "repository_internal_public_safe",
        "claim_status": "engineering_triage",
        "privacy_status": "public_safe",
        "implementation_status": "runner_ready",
        "revision_reason": "rank contradiction and missingness records into executable falsification work queues",
        "items": [asdict(item) for item in items],
    }


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Rank MC contradiction records into executable queues.")
    parser.add_argument("input", help="Path to contradiction-ledger JSON records")
    parser.add_argument("--output", "-o", help="Optional path for triage JSON output")
    args = parser.parse_args(argv)

    result = triage(load_records(Path(args.input)))
    rendered = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
