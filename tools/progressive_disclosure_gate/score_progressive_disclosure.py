#!/usr/bin/env python3
"""
Progressive Disclosure Gate

Scores synthetic hypothesis-generation fixtures by whether a generated hypothesis is:
- grounded in currently available context,
- testable through measurable variables,
- made before full conclusion disclosure,
- free of unsupported cure/diagnosis/treatment overclaims,
- useful for research organization or question preparation.

This is public-safe discovery infrastructure, not medical or veterinary advice.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List

PROMOTE_CLASSES = {"promote", "promote_question_prep"}
DEMOTE_CLASSES = {"demote_late_recall", "reject_overclaim"}
OVERCLAIM_TERMS = {
    "cure",
    "cures",
    "heals",
    "healed",
    "diagnose",
    "diagnosis",
    "treat",
    "treatment",
    "reverse",
    "reverses",
    "repair",
    "repairs",
}
ADVICE_CONTEXT_TERMS = {"should take", "should use", "prescribe", "dose", "dosage", "medication recommendation"}


@dataclass
class FixtureResult:
    id: str
    expected_classification: str
    predicted_classification: str
    passed: bool
    score: float
    reasons: List[str]


def tokens(text: str) -> set[str]:
    return set(re.findall(r"[a-zA-Z0-9_]+", text.lower()))


def overlap_score(left: str, right: str) -> float:
    a = tokens(left)
    b = tokens(right)
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def contains_any(text: str, terms: set[str]) -> bool:
    lowered = text.lower()
    return any(term in lowered for term in terms)


def classify_fixture(fixture: Dict[str, Any]) -> FixtureResult:
    generated = fixture.get("generated_hypothesis", "")
    context_text = " ".join(fixture.get("available_context", []))
    conclusion = fixture.get("withheld_conclusion", "")
    stage = fixture.get("disclosure_stage", "")
    measurable = fixture.get("measurable_variables", [])
    expected = fixture.get("expected_classification", "")

    context_overlap = overlap_score(generated, context_text)
    conclusion_overlap = overlap_score(generated, conclusion)
    has_measurable = len(measurable) > 0
    overclaim = contains_any(generated, OVERCLAIM_TERMS)
    advice = contains_any(generated, ADVICE_CONTEXT_TERMS)
    late_stage = stage == "full_conclusion_revealed"

    reasons: List[str] = []
    score = 0.0

    if has_measurable:
        score += 0.25
        reasons.append("has measurable variables")
    else:
        reasons.append("missing measurable variables")

    if context_overlap >= 0.18:
        score += 0.25
        reasons.append("hypothesis is grounded in available context")
    else:
        reasons.append("weak grounding in available context")

    if conclusion_overlap >= 0.18 and not late_stage:
        score += 0.2
        reasons.append("early hypothesis has useful similarity to withheld conclusion")
    elif late_stage and conclusion_overlap >= 0.18:
        score -= 0.35
        reasons.append("late-stage conclusion recall penalty")

    if overclaim:
        score -= 0.35
        reasons.append("unsupported cure/causal/repair overclaim term present")
    if advice:
        score -= 0.4
        reasons.append("medical/veterinary advice language present")

    if "mechanism remains unknown" in conclusion.lower() and any(term in generated.lower() for term in ["directly", "mechanism r", "by repairing"]):
        score -= 0.25
        reasons.append("invented mechanism beyond available evidence")

    if "research step" in generated.lower() or "question" in generated.lower() or "controlling" in generated.lower():
        score += 0.15
        reasons.append("frames output as research organization or question preparation")

    score = max(0.0, min(1.0, score))

    if late_stage and conclusion_overlap >= 0.18:
        predicted = "demote_late_recall"
    elif advice or (overclaim and "mechanism remains unknown" in conclusion.lower()):
        predicted = "reject_overclaim"
    elif "question-prep" in fixture.get("rationale", "").lower() or "research organization" in fixture.get("rationale", "").lower():
        predicted = "promote_question_prep" if score >= 0.35 else "reject_overclaim"
    elif score >= 0.45:
        predicted = "promote"
    else:
        predicted = "reject_overclaim"

    return FixtureResult(
        id=fixture.get("id", "unknown"),
        expected_classification=expected,
        predicted_classification=predicted,
        passed=predicted == expected,
        score=round(score, 4),
        reasons=reasons,
    )


def run(path: Path) -> Dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    results = [classify_fixture(item) for item in payload.get("fixtures", [])]
    passed = sum(1 for result in results if result.passed)
    total = len(results)
    return {
        "source_status": payload.get("source_status"),
        "claim_status": payload.get("claim_status"),
        "privacy_status": payload.get("privacy_status"),
        "missingness": payload.get("missingness"),
        "revision_reason": payload.get("revision_reason"),
        "implementation_status": "scorer executed locally over fixture payload",
        "testability": payload.get("testability"),
        "hypothesis_under_test": payload.get("hypothesis_under_test"),
        "summary": {
            "passed": passed,
            "total": total,
            "all_passed": passed == total,
        },
        "results": [result.__dict__ for result in results],
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "fixture_file",
        nargs="?",
        default="tools/progressive_disclosure_gate/fixtures.synthetic.json",
        help="Path to progressive-disclosure synthetic fixture JSON",
    )
    args = parser.parse_args()
    report = run(Path(args.fixture_file))
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0 if report["summary"]["all_passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
