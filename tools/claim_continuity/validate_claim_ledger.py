#!/usr/bin/env python3
"""Dependency-free structural validator for competing claim versions.

This checks record integrity only. It does not determine whether any claim is true.
"""
from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

STATUSES = {"unreviewed", "supported", "disputed", "refuted", "superseded", "retracted", "unknown"}
KINDS = {"observation", "interpretation", "hypothesis", "decision", "symbolic"}
TEMPORAL_STATES = {"anchored", "partial", "unknown"}
SOURCE_RELATIONS = {"supports", "refutes", "qualifies", "context_only"}
SOURCE_AVAILABILITY = {"available", "unavailable", "not_collected", "redacted"}
RELATION_TYPES = {"contradicts", "alternative_to", "qualifies", "supersedes", "depends_on"}


def allowed(value: Any, choices: set[str]) -> bool:
    """Membership guard for untrusted JSON values, including arrays/objects."""
    return isinstance(value, str) and value in choices


def parse_instant(value: Any) -> datetime | None:
    """Parse an ISO-8601 instant only when an explicit timezone is present."""
    if not isinstance(value, str) or not value.strip():
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None or parsed.utcoffset() is None:
        return None
    return parsed


def validate_ledger(ledger: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if not isinstance(ledger, dict):
        return ["ledger must be an object"]
    if ledger.get("schema_version") != "mc.claim-ledger.v1":
        errors.append("schema_version must be mc.claim-ledger.v1")
    if not isinstance(ledger.get("ledger_id"), str) or not ledger["ledger_id"].strip():
        errors.append("ledger_id must be a non-empty string")
    if not allowed(ledger.get("privacy_scope"), {"synthetic_public", "reviewed_public", "private"}):
        errors.append("privacy_scope must be synthetic_public, reviewed_public, or private")
    claims = ledger.get("claims")
    relations = ledger.get("relations")
    if not isinstance(claims, list):
        return errors + ["claims must be a list"]
    if not isinstance(relations, list):
        return errors + ["relations must be a list"]

    ids: set[str] = set()
    for i, claim in enumerate(claims):
        prefix = f"claims[{i}]"
        if not isinstance(claim, dict):
            errors.append(f"{prefix} must be an object")
            continue
        claim_id = claim.get("claim_id")
        if not isinstance(claim_id, str) or not claim_id.strip():
            errors.append(f"{prefix}.claim_id must be a non-empty string")
        elif claim_id in ids:
            errors.append(f"duplicate claim_id: {claim_id}")
        else:
            ids.add(claim_id)
        for field in ("statement", "scope", "perspective", "revision_reason", "recorded_at"):
            if not isinstance(claim.get(field), str) or not claim[field].strip():
                errors.append(f"{prefix}.{field} must be a non-empty string")
        recorded_at = parse_instant(claim.get("recorded_at"))
        if recorded_at is None:
            errors.append(f"{prefix}.recorded_at must be ISO-8601 with an explicit timezone")
        if not allowed(claim.get("kind"), KINDS):
            errors.append(f"{prefix}.kind is invalid")
        status = claim.get("status")
        if not allowed(status, STATUSES):
            errors.append(f"{prefix}.status is invalid")

        temporal = claim.get("temporal")
        if not isinstance(temporal, dict):
            errors.append(f"{prefix}.temporal must be an object")
        else:
            state = temporal.get("state")
            start, end = temporal.get("valid_from"), temporal.get("valid_to")
            if not allowed(state, TEMPORAL_STATES):
                errors.append(f"{prefix}.temporal.state is invalid")
            elif state == "unknown" and (start is not None or end is not None):
                errors.append(f"{prefix}: unknown temporal scope cannot assert valid_from/valid_to")
            elif state == "anchored" and start is None and end is None:
                errors.append(f"{prefix}: anchored temporal scope requires at least one boundary")
            parsed_start = parse_instant(start) if start is not None else None
            parsed_end = parse_instant(end) if end is not None else None
            if start is not None and not isinstance(start, str):
                errors.append(f"{prefix}.temporal.valid_from must be a string or null")
            elif start is not None and parsed_start is None:
                errors.append(f"{prefix}.temporal.valid_from must be ISO-8601 with an explicit timezone")
            if end is not None and not isinstance(end, str):
                errors.append(f"{prefix}.temporal.valid_to must be a string or null")
            elif end is not None and parsed_end is None:
                errors.append(f"{prefix}.temporal.valid_to must be ISO-8601 with an explicit timezone")
            if parsed_start is not None and parsed_end is not None and parsed_start > parsed_end:
                errors.append(f"{prefix}: valid_from must not be after valid_to")

        sources = claim.get("sources")
        if not isinstance(sources, list) or not sources:
            errors.append(f"{prefix}.sources must be a non-empty list with explicit availability")
            continue
        seen_sources: set[tuple[str, str]] = set()
        available_relations: set[str] = set()
        for j, source in enumerate(sources):
            sp = f"{prefix}.sources[{j}]"
            if not isinstance(source, dict):
                errors.append(f"{sp} must be an object")
                continue
            source_id = source.get("source_id")
            relation = source.get("relation")
            availability = source.get("availability")
            if not isinstance(source_id, str) or not source_id.strip():
                errors.append(f"{sp}.source_id must be a non-empty string")
            if not allowed(relation, SOURCE_RELATIONS):
                errors.append(f"{sp}.relation is invalid")
            if not allowed(availability, SOURCE_AVAILABILITY):
                errors.append(f"{sp}.availability is invalid")
            key = (str(source_id), str(relation))
            if key in seen_sources:
                errors.append(f"{sp}: duplicate source_id/relation pair")
            seen_sources.add(key)
            if availability == "available":
                if not (isinstance(source.get("locator"), str) and source["locator"].strip()) and not (
                    isinstance(source.get("digest"), str) and source["digest"].strip()
                ):
                    errors.append(f"{sp}: available source requires locator or digest")
                if relation in {"supports", "refutes"}:
                    available_relations.add(relation)
        if status == "supported" and "supports" not in available_relations:
            errors.append(f"{prefix}: supported status requires an available supporting source")
        if status == "refuted" and "refutes" not in available_relations:
            errors.append(f"{prefix}: refuted status requires an available refuting source")
        if status == "disputed" and not {"supports", "refutes"}.issubset(available_relations):
            errors.append(f"{prefix}: disputed status requires available supporting and refuting sources")

    relation_keys: set[tuple[str, str, str]] = set()
    superseded_targets: set[str] = set()
    supersedes: dict[str, list[str]] = {}
    for i, relation in enumerate(relations):
        prefix = f"relations[{i}]"
        if not isinstance(relation, dict):
            errors.append(f"{prefix} must be an object")
            continue
        source, target, kind = relation.get("from_claim"), relation.get("to_claim"), relation.get("type")
        if not isinstance(source, str) or source not in ids:
            errors.append(f"{prefix}.from_claim references unknown claim {source!r}")
        if not isinstance(target, str) or target not in ids:
            errors.append(f"{prefix}.to_claim references unknown claim {target!r}")
        if source == target:
            errors.append(f"{prefix} cannot relate a claim to itself")
        if not allowed(kind, RELATION_TYPES):
            errors.append(f"{prefix}.type is invalid")
        if not isinstance(relation.get("rationale"), str) or not relation["rationale"].strip():
            errors.append(f"{prefix}.rationale must be a non-empty string")
        key = (str(source), str(target), str(kind))
        if key in relation_keys:
            errors.append(f"{prefix}: duplicate relation")
        relation_keys.add(key)
        if kind == "supersedes" and isinstance(source, str) and source in ids and isinstance(target, str) and target in ids:
            supersedes.setdefault(source, []).append(target)
            superseded_targets.add(target)
            target_claim = next((item for item in claims if isinstance(item, dict) and item.get("claim_id") == target), None)
            if target_claim is not None and target_claim.get("status") != "superseded":
                errors.append(f"{prefix}: supersedes target {target} must have status superseded")

    # Reject supersession cycles; cycles would make currentness ambiguous.
    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(node: str) -> None:
        if node in visiting:
            errors.append(f"supersedes cycle includes {node}")
            return
        if node in visited:
            return
        visiting.add(node)
        for target in supersedes.get(node, []):
            visit(target)
        visiting.remove(node)
        visited.add(node)

    for claim in claims:
        if isinstance(claim, dict) and claim.get("status") == "superseded":
            claim_id = claim.get("claim_id")
            if isinstance(claim_id, str) and claim_id in ids and claim_id not in superseded_targets:
                errors.append(f"claim {claim_id}: superseded status requires an incoming supersedes relation")
    for claim_id in ids:
        visit(claim_id)
    return errors


def main(argv: list[str]) -> int:
    path = Path(argv[1]) if len(argv) > 1 else Path(__file__).with_name("fixtures.synthetic.json")
    try:
        ledger = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"cannot load ledger: {exc}")
        return 2
    errors = validate_ledger(ledger)
    if errors:
        print("Claim ledger validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Claim ledger structure passed; factual truth was not evaluated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
