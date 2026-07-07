#!/usr/bin/env python3
"""Validate MC symbolic-to-operational roundtrip fixture.

This validator treats symbolic language as research/sensemaking material. It rejects
promotion into diagnosis, treatment, veterinary advice, dosage guidance,
emergency triage, cure certainty, discovery proof, supernatural certainty,
unsupported causality, private identifier retention, or missingness collapse.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

FIXTURE = Path(__file__).with_name("symbolic_operational_roundtrip_fixture.json")

REQUIRED_TOP_LEVEL = {
    "artifact_type",
    "claim",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "measurable_variables",
    "next_executable_action",
    "pass_thresholds",
    "symbols",
}

REQUIRED_SYMBOL_FIELDS = {
    "symbol_id",
    "symbol_phrase",
    "symbol_domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "measurable_variables",
    "ambiguity_options",
    "roundtrip_summary",
    "blocked_promotions",
    "next_executable_action",
}

PROHIBITED_PATTERNS = [
    r"\bdiagnos(?:e|is|ed)\b.*\b(user|patient|animal|pet|dog|cat)\b",
    r"\btreat(?:ment)?\b.*\b(should|must|needs?|give|take|dose)\b",
    r"\b(?:give|take|administer)\b.*\b\d+\s*(?:mg|ml|mcg|iu)\b",
    r"\bemergency\b.*\b(ignore|avoid|skip|unnecessary)\b",
    r"\bcure(?:d|s)?\b.*\b(proven|guaranteed|certain)\b",
    r"\bdiscovery\b.*\b(proven|confirmed|certain)\b",
    r"\bsupernatural\b.*\b(proof|certain|confirmed)\b",
    r"\bthis means you are\b",
    r"\bmissing\b.*\bmeans absent\b",
    r"\b(?:full name|street address|phone number|email address)\b",
]


def fail(message: str) -> None:
    raise AssertionError(message)


def flatten(value: Any) -> str:
    if isinstance(value, dict):
        return "\n".join(f"{k}: {flatten(v)}" for k, v in value.items())
    if isinstance(value, list):
        return "\n".join(flatten(v) for v in value)
    return str(value)


def terms(text: str) -> set[str]:
    stop = {"the", "and", "or", "a", "an", "of", "to", "in", "while", "for", "with", "as"}
    return {token for token in re.findall(r"[a-zA-Z][a-zA-Z_-]{2,}", text.lower()) if token not in stop}


def validate_metadata(data: dict[str, Any]) -> None:
    missing = REQUIRED_TOP_LEVEL - set(data)
    if missing:
        fail(f"Missing top-level fields: {sorted(missing)}")

    if data["privacy_status"] != "no_private_identifiers_retained":
        fail("Top-level privacy_status must state no private identifiers retained.")

    if "missing" not in flatten(data["missingness"]).lower():
        fail("Top-level missingness must explicitly describe missing information.")

    whole_text = flatten(data).lower()
    for pattern in PROHIBITED_PATTERNS:
        if re.search(pattern, whole_text, flags=re.IGNORECASE | re.DOTALL):
            fail(f"Prohibited unsafe promotion/private leakage pattern found: {pattern}")


def validate_symbol(symbol: dict[str, Any], thresholds: dict[str, Any]) -> dict[str, int]:
    missing = REQUIRED_SYMBOL_FIELDS - set(symbol)
    if missing:
        fail(f"{symbol.get('symbol_id', '<unknown>')} missing fields: {sorted(missing)}")

    if not isinstance(symbol["measurable_variables"], list):
        fail(f"{symbol['symbol_id']} measurable_variables must be a list.")

    if len(symbol["measurable_variables"]) < thresholds["required_operational_variables_per_symbol"]:
        fail(f"{symbol['symbol_id']} has too few measurable variables.")

    for variable in symbol["measurable_variables"]:
        for required in ("name", "unit", "measurement_context"):
            if required not in variable or not str(variable[required]).strip():
                fail(f"{symbol['symbol_id']} variable missing {required}: {variable}")

    if len(symbol["ambiguity_options"]) < thresholds["min_ambiguity_options_per_symbol"]:
        fail(f"{symbol['symbol_id']} does not preserve enough ambiguity options.")

    if len(symbol["blocked_promotions"]) < thresholds["min_blocked_promotions_per_symbol"]:
        fail(f"{symbol['symbol_id']} has too few blocked promotions.")

    phrase_terms = terms(symbol["symbol_phrase"])
    summary_terms = terms(symbol["roundtrip_summary"])
    if len(phrase_terms & summary_terms) < thresholds["min_roundtrip_terms_overlap"]:
        fail(f"{symbol['symbol_id']} roundtrip summary does not retain source-symbol terms.")

    if symbol["privacy_status"] not in {"deidentified", "no_private_identifiers_retained"}:
        fail(f"{symbol['symbol_id']} has unsafe privacy_status: {symbol['privacy_status']}")

    if "missing" not in str(symbol["missingness"]).lower() and "no " not in str(symbol["missingness"]).lower():
        fail(f"{symbol['symbol_id']} missingness does not explicitly mark absent context.")

    return {
        "operational_variables": len(symbol["measurable_variables"]),
        "ambiguity_options": len(symbol["ambiguity_options"]),
        "blocked_promotions": len(symbol["blocked_promotions"]),
        "roundtrip_overlap": len(phrase_terms & summary_terms),
    }


def main() -> None:
    data = json.loads(FIXTURE.read_text(encoding="utf-8"))
    validate_metadata(data)

    symbols = data["symbols"]
    thresholds = data["pass_thresholds"]
    if len(symbols) < thresholds["min_symbol_count"]:
        fail("Fixture does not include enough symbolic entries.")

    metrics = [validate_symbol(symbol, thresholds) for symbol in symbols]
    summary = {
        "symbol_count": len(symbols),
        "symbols_with_operational_variables": sum(m["operational_variables"] >= thresholds["required_operational_variables_per_symbol"] for m in metrics),
        "ambiguity_preservation_rate": sum(m["ambiguity_options"] >= thresholds["min_ambiguity_options_per_symbol"] for m in metrics) / len(metrics),
        "roundtrip_integrity_rate": sum(m["roundtrip_overlap"] >= thresholds["min_roundtrip_terms_overlap"] for m in metrics) / len(metrics),
        "blocked_promotion_count": sum(m["blocked_promotions"] for m in metrics),
        "safe_next_action_count": sum(bool(symbol["next_executable_action"].strip()) for symbol in symbols),
    }

    if summary["ambiguity_preservation_rate"] < 1.0:
        fail("Not all symbols preserve ambiguity.")
    if summary["roundtrip_integrity_rate"] < 1.0:
        fail("Not all symbols preserve roundtrip integrity.")
    if summary["safe_next_action_count"] != len(symbols):
        fail("Every symbol needs a safe next executable action.")

    print(json.dumps({"status": "PASS", "metrics": summary}, indent=2))


if __name__ == "__main__":
    main()
