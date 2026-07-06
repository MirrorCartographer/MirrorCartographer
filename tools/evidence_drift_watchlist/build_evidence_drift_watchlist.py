#!/usr/bin/env python3
"""Build a Mirror Cartographer evidence-drift watchlist.

This component routes public-safe research claims by freshness and boundary risk.
It is discovery infrastructure only; it does not validate medical, veterinary,
legal, or scientific truth.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from typing import Any

ALLOWED_DOMAINS = {
    "medical",
    "veterinary",
    "ai_systems",
    "biology",
    "software",
    "legal_policy",
    "general_science",
}
ALLOWED_SOURCE_STATUS = {
    "synthetic",
    "public",
    "literature_note",
    "preprint",
    "guideline",
    "mixed_public",
}
ALLOWED_CLAIM_STATUS = {
    "hypothesis_only",
    "observational",
    "supported",
    "inconclusive",
    "contradicted",
}
ALLOWED_PRIVACY_STATUS = {"synthetic_only", "public_safe", "deidentified_public"}
FAST_DRIFT_DOMAINS = {"medical", "veterinary", "ai_systems", "software", "legal_policy"}
ADVICE_OR_OVERREACH_RE = re.compile(
    r"\b(diagnose|treat|prescribe|dosage|dose|cure this|guarantee|proves? that)\b",
    re.IGNORECASE,
)
PRIVATE_RESIDUE_RE = [
    re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"),
    re.compile(r"\b\d{3}[-.]\d{3}[-.]\d{4}\b"),
    re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
]


@dataclass(frozen=True)
class DriftResult:
    claim_id: str
    queue: str
    drift_score: int
    age_days: int | None
    reasons: list[str]
    next_executable_action: str


def _flatten_strings(value: Any) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        out: list[str] = []
        for item in value:
            out.extend(_flatten_strings(item))
        return out
    if isinstance(value, dict):
        out: list[str] = []
        for item in value.values():
            out.extend(_flatten_strings(item))
        return out
    return []


def _parse_iso_date(value: Any) -> date | None:
    if not isinstance(value, str):
        return None
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None


def _has_private_residue(claim: dict[str, Any]) -> bool:
    text = "\n".join(_flatten_strings(claim))
    return any(pattern.search(text) for pattern in PRIVATE_RESIDUE_RE)


def _has_advice_or_overreach(claim: dict[str, Any]) -> bool:
    return bool(ADVICE_OR_OVERREACH_RE.search("\n".join(_flatten_strings(claim))))


def _required_shape_errors(claim: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if not isinstance(claim.get("claim_id"), str) or not claim["claim_id"].startswith("edw_"):
        errors.append("claim_id must start with edw_")
    if claim.get("domain") not in ALLOWED_DOMAINS:
        errors.append("domain is not allowed")
    if claim.get("source_status") not in ALLOWED_SOURCE_STATUS:
        errors.append("source_status is not allowed")
    if claim.get("claim_status") not in ALLOWED_CLAIM_STATUS:
        errors.append("claim_status is not allowed")
    if claim.get("privacy_status") not in ALLOWED_PRIVACY_STATUS:
        errors.append("privacy_status is not allowed")
    if _parse_iso_date(claim.get("last_checked")) is None:
        errors.append("last_checked must be YYYY-MM-DD")
    if not isinstance(claim.get("freshness_window_days"), int) or claim["freshness_window_days"] <= 0:
        errors.append("freshness_window_days must be a positive integer")
    for field in ("evidence_refs", "missingness"):
        if not isinstance(claim.get(field), list) or not claim[field]:
            errors.append(f"{field} must be a non-empty list")
    for field in ("claim_text_public", "revision_reason", "next_executable_action"):
        if not isinstance(claim.get(field), str) or len(claim[field]) < 12:
            errors.append(f"{field} must be explicit")
    return errors


def route_claim(claim: dict[str, Any], *, today: date | None = None) -> DriftResult:
    today = today or date.today()
    reasons = _required_shape_errors(claim)
    checked = _parse_iso_date(claim.get("last_checked"))
    age_days = (today - checked).days if checked else None

    if _has_private_residue(claim):
        reasons.append("private residue detected")
    if _has_advice_or_overreach(claim):
        reasons.append("advice or claim-overreach language detected")

    if reasons:
        return DriftResult(
            claim_id=str(claim.get("claim_id", "unknown")),
            queue="blocked_boundary",
            drift_score=100,
            age_days=age_days,
            reasons=reasons,
            next_executable_action=str(claim.get("next_executable_action", "Repair packet boundary and shape.")),
        )

    assert age_days is not None
    window = int(claim["freshness_window_days"])
    domain = str(claim["domain"])
    claim_status = str(claim["claim_status"])
    source_status = str(claim["source_status"])

    drift_score = min(100, round((age_days / window) * 70))
    if domain in FAST_DRIFT_DOMAINS:
        drift_score += 15
        reasons.append("fast-drift domain")
    if source_status == "preprint":
        drift_score += 10
        reasons.append("preprint source")
    if claim_status in {"inconclusive", "contradicted", "hypothesis_only"}:
        drift_score += 15
        reasons.append(f"claim status is {claim_status}")
    drift_score = min(100, drift_score)

    if age_days > window or drift_score >= 75:
        queue = "refresh_before_reuse"
        reasons.append("freshness window exceeded or high drift score")
    elif age_days > int(window * 0.6) or drift_score >= 50:
        queue = "recheck_soon"
        reasons.append("approaching freshness boundary")
    else:
        queue = "current_low_drift"
        reasons.append("within freshness boundary")

    return DriftResult(
        claim_id=str(claim["claim_id"]),
        queue=queue,
        drift_score=drift_score,
        age_days=age_days,
        reasons=reasons,
        next_executable_action=str(claim["next_executable_action"]),
    )


def claims_from_payload(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict) and isinstance(payload.get("claims"), list):
        return payload["claims"]
    if isinstance(payload, dict) and "claim_id" in payload:
        return [payload]
    raise ValueError("Input must be a claim, a claim list, or an object with claims.")


def build_watchlist(claims: list[dict[str, Any]], *, today: date | None = None) -> dict[str, list[dict[str, Any]]]:
    queues: dict[str, list[dict[str, Any]]] = {
        "current_low_drift": [],
        "recheck_soon": [],
        "refresh_before_reuse": [],
        "blocked_boundary": [],
    }
    for claim in claims:
        result = route_claim(claim, today=today)
        queues[result.queue].append(
            {
                "claim_id": result.claim_id,
                "drift_score": result.drift_score,
                "age_days": result.age_days,
                "reasons": result.reasons,
                "next_executable_action": result.next_executable_action,
            }
        )
    return queues


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build MC evidence-drift watchlist.")
    parser.add_argument("path", type=Path, help="JSON claim, claim list, or fixture file")
    parser.add_argument("--today", help="Override current date as YYYY-MM-DD for deterministic tests")
    args = parser.parse_args(argv)

    payload = json.loads(args.path.read_text(encoding="utf-8"))
    today = _parse_iso_date(args.today) if args.today else date.today()
    if today is None:
        raise SystemExit("--today must be YYYY-MM-DD")
    watchlist = build_watchlist(claims_from_payload(payload), today=today)
    print(json.dumps(watchlist, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
