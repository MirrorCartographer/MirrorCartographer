#!/usr/bin/env python3
"""
Generate public-safe synthetic negative-control packets for Mirror Cartographer.

This is a research-organization utility, not medical or veterinary advice.
It deliberately creates fixtures that should fail promotion gates so downstream
components can be tested for over-permissive claim advancement.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, List

ALLOWED_PRIVACY = {"synthetic_public_safe"}
ALLOWED_CLAIM_STATUS = {"research_organization_only", "engineering_test_only"}
EXPECTED_ROUTE = "falsification_or_reject"


def load_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {path}: {exc}") from exc


def validate_hypothesis(item: Dict[str, Any]) -> None:
    required = {
        "hypothesis_id",
        "domain",
        "claim",
        "required_variables",
        "support_pattern",
        "privacy_status",
        "claim_status",
    }
    missing = sorted(required - set(item))
    if missing:
        raise ValueError(f"Hypothesis missing required fields: {missing}")
    if item["privacy_status"] not in ALLOWED_PRIVACY:
        raise ValueError(
            f"Hypothesis {item['hypothesis_id']} is not public-safe synthetic: "
            f"{item['privacy_status']}"
        )
    if item["claim_status"] not in ALLOWED_CLAIM_STATUS:
        raise ValueError(
            f"Hypothesis {item['hypothesis_id']} has disallowed claim_status: "
            f"{item['claim_status']}"
        )
    if not isinstance(item["required_variables"], list) or not item["required_variables"]:
        raise ValueError(f"Hypothesis {item['hypothesis_id']} requires non-empty required_variables")
    if not isinstance(item["support_pattern"], dict) or not item["support_pattern"]:
        raise ValueError(f"Hypothesis {item['hypothesis_id']} requires non-empty support_pattern")


def inverted_value(value: Any) -> str:
    lookup = {
        "present": "absent",
        "absent": "present",
        "increased": "decreased",
        "decreased": "increased",
        "recent": "not_recent",
        "available": "unavailable",
        "week_relative": "absolute_timestamp_removed",
    }
    return lookup.get(str(value), f"not_{value}")


def generate_for_hypothesis(item: Dict[str, Any]) -> List[Dict[str, Any]]:
    validate_hypothesis(item)
    hypothesis_id = item["hypothesis_id"]
    domain = item["domain"]
    variables = list(item["required_variables"])
    support = dict(item["support_pattern"])
    first_var = variables[0]
    second_var = variables[1] if len(variables) > 1 else variables[0]

    missing_vars = {key: support.get(key, "synthetic_observed") for key in variables if key != first_var}
    inverted_vars = dict(support)
    inverted_vars[second_var] = inverted_value(inverted_vars.get(second_var, "present"))

    return [
        {
            "control_id": f"NC-{hypothesis_id}-MISSING-VARIABLE",
            "hypothesis_id": hypothesis_id,
            "control_type": "missing_required_variable",
            "domain": domain,
            "observed_variables": missing_vars,
            "expected_route": EXPECTED_ROUTE,
            "reason": f"Required variable '{first_var}' is intentionally absent.",
            "source_status": "assistant_generated_synthetic_fixture",
            "claim_status": "engineering_test_only",
            "privacy_status": "synthetic_public_safe",
            "testability": "assert router does not promote packet with missing required variable",
        },
        {
            "control_id": f"NC-{hypothesis_id}-INVERTED-SIGNAL",
            "hypothesis_id": hypothesis_id,
            "control_type": "inverted_support_signal",
            "domain": domain,
            "observed_variables": inverted_vars,
            "expected_route": EXPECTED_ROUTE,
            "reason": f"Variable '{second_var}' is intentionally inverted from support pattern.",
            "source_status": "assistant_generated_synthetic_fixture",
            "claim_status": "engineering_test_only",
            "privacy_status": "synthetic_public_safe",
            "testability": "assert router treats contradicted support pattern as falsification candidate",
        },
        {
            "control_id": f"NC-{hypothesis_id}-DISTRACTOR-DOMAIN",
            "hypothesis_id": hypothesis_id,
            "control_type": "unrelated_domain_distractor",
            "domain": "unrelated_synthetic_domain",
            "observed_variables": {
                "synthetic_unrelated_signal": "present",
                "synthetic_context": "non_matching_domain",
            },
            "expected_route": EXPECTED_ROUTE,
            "reason": "Domain and variables intentionally do not match the hypothesis scope.",
            "source_status": "assistant_generated_synthetic_fixture",
            "claim_status": "engineering_test_only",
            "privacy_status": "synthetic_public_safe",
            "testability": "assert router rejects semantically unrelated evidence even if it looks structured",
        },
    ]


def generate_controls(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    hypotheses = payload.get("hypotheses")
    if not isinstance(hypotheses, list) or not hypotheses:
        raise ValueError("Input must contain a non-empty 'hypotheses' list")

    controls: List[Dict[str, Any]] = []
    for item in hypotheses:
        if not isinstance(item, dict):
            raise ValueError("Each hypothesis must be an object")
        controls.extend(generate_for_hypothesis(item))
    return controls


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Generate MC negative-control synthetic fixtures")
    parser.add_argument("input", type=Path, help="Path to synthetic hypothesis JSON")
    parser.add_argument("--output", type=Path, default=None, help="Optional output JSON path")
    args = parser.parse_args(argv)

    try:
        controls = generate_controls(load_json(args.input))
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    rendered = json.dumps(controls, indent=2, sort_keys=True) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
