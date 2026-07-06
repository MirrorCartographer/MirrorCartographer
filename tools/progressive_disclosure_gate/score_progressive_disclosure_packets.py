#!/usr/bin/env python3
"""Score MC progressive-disclosure hypothesis fixtures.

This gate evaluates whether a discovery candidate shows useful early inference
under staged evidence, rather than copying the conclusion after disclosure or
promoting unsupported causal/cure claims.

Inputs are public-safe JSON fixture packets. The default fixture file is
fixtures.synthetic.json in this directory.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

PROMOTE = {"promote", "promote_question_prep"}
DEMOTE = {"demote_late_recall", "reject_overclaim"}
OVERCLAIM_TERMS = re.compile(r"\b(cure|cures|diagnose|diagnosis|treat|treatment|repairing|reverses)\b", re.I)
UNCERTAINTY_TERMS = re.compile(r"\b(may|might|could|should test|insufficient|question|control|baseline|frequency|measurable)\b", re.I)


def tokenize(text: str) -> set[str]:
    return {tok.lower() for tok in re.findall(r"[a-zA-Z0-9]+", text)}


def overlap_ratio(a: str, b: str) -> float:
    left = tokenize(a)
    right = tokenize(b)
    if not left or not right:
        return 0.0
    return len(left & right) / max(1, len(left | right))


def classify_fixture(fixture: Dict[str, Any]) -> Tuple[str, List[str]]:
    stage = fixture.get("disclosure_stage", "")
    generated = fixture.get("generated_hypothesis", "")
    conclusion = fixture.get("withheld_conclusion", "")
    context = " ".join(fixture.get("available_context", []))
    variables = fixture.get("measurable_variables", [])

    reasons: List[str] = []
    conclusion_overlap = overlap_ratio(generated, conclusion)
    context_overlap = overlap_ratio(generated, context)
    has_variables = len(variables) >= 2
    has_uncertainty_or_question_prep = bool(UNCERTAINTY_TERMS.search(generated))
    has_overclaim = bool(OVERCLAIM_TERMS.search(generated))

    if stage == "full_conclusion_revealed" and conclusion_overlap >= 0.75:
        reasons.append("late conclusion copying after full disclosure")
        return "demote_late_recall", reasons

    if has_overclaim and not has_uncertainty_or_question_prep and context_overlap < 0.35:
        reasons.append("unsupported causal/cure/treatment language outside evidence boundary")
        return "reject_overclaim", reasons

    if "public-safe longitudinal" in context.lower() or "question preparation" in conclusion.lower():
        if has_variables and has_uncertainty_or_question_prep and not re.search(r"\bdiagnose|prescribe|treat with\b", generated, re.I):
            reasons.append("safe research organization/question-prep framing")
            return "promote_question_prep", reasons

    if stage in {"partial_methods_and_observations", "partial_observations_only"}:
        if has_variables and context_overlap >= 0.18 and conclusion_overlap < 0.95 and not (has_overclaim and context_overlap < 0.35):
            reasons.append("early specific, measurable, context-grounded inference")
            return "promote", reasons

    reasons.append("insufficient staged-evidence support for promotion")
    return "reject_overclaim", reasons


def score_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    fixtures = packet.get("fixtures", [])
    results = []
    passed = 0
    for fixture in fixtures:
        predicted, reasons = classify_fixture(fixture)
        expected = fixture.get("expected_classification")
        ok = predicted == expected
        passed += int(ok)
        results.append({
            "id": fixture.get("id"),
            "expected": expected,
            "predicted": predicted,
            "passed": ok,
            "reasons": reasons,
        })
    return {
        "fixture_count": len(fixtures),
        "passed": passed,
        "failed": len(fixtures) - passed,
        "results": results,
    }


def load_json(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict):
        raise ValueError("Expected top-level JSON object with a fixtures array")
    if "fixtures" not in data:
        raise ValueError("Expected top-level 'fixtures' array")
    return data


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Score progressive-disclosure hypothesis fixtures")
    parser.add_argument("fixture_path", nargs="?", default=str(Path(__file__).with_name("fixtures.synthetic.json")))
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON")
    args = parser.parse_args(list(argv) if argv is not None else None)

    packet = load_json(Path(args.fixture_path))
    score = score_packet(packet)

    if args.json:
        print(json.dumps(score, indent=2, sort_keys=True))
    else:
        print(f"progressive_disclosure_gate: {score['passed']}/{score['fixture_count']} fixtures passed")
        for result in score["results"]:
            status = "PASS" if result["passed"] else "FAIL"
            print(f"{status} {result['id']}: expected={result['expected']} predicted={result['predicted']}")
            for reason in result["reasons"]:
                print(f"  - {reason}")

    return 0 if score["failed"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
