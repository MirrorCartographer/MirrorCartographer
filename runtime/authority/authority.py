"""Deterministic authority gate for LYR's delegated project autonomy.

This module evaluates an action against an owner-issued, versioned grant.
It does not execute the action; callers must record the decision and invoke
only the exact action that was authorized.
"""
from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class ActionRequest:
    actor: str
    capability: str
    resource: str
    purpose: str
    environment: str = "development"
    data_classification: str = "public"
    external_effect: bool = False
    irreversible: bool = False
    destructive: bool = False
    evidence: tuple[str, ...] = ()


@dataclass(frozen=True)
class AuthorityDecision:
    status: str
    reason: str
    actor: str
    capability: str
    resource: str
    grant_version: str
    required_evidence_missing: tuple[str, ...] = ()

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def load_grant(path: str | Path | None = None) -> dict[str, Any]:
    if path is None:
        path = Path(__file__).resolve().parents[2] / "governance" / "lyr-autonomy-authority.v1.json"
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if data.get("schema") != "mc.lyr-authority-grant.v1":
        raise ValueError("Unsupported LYR authority grant schema")
    if not data.get("version") or data.get("delegate") != "lyr":
        raise ValueError("Invalid or unassigned LYR authority grant")
    return data


def _within_scope(resource: str, prefixes: list[str], exact_resources: list[str] | None = None) -> bool:
    normalized = resource.replace("\\", "/").lstrip("/")
    exact_resources = exact_resources or []
    return normalized in exact_resources or any(normalized.startswith(prefix) for prefix in prefixes)


def evaluate(request: ActionRequest, grant: dict[str, Any] | None = None) -> AuthorityDecision:
    grant = grant or load_grant()
    policy = grant["grant"]
    version = grant["version"]

    def decision(status: str, reason: str, missing: tuple[str, ...] = ()) -> AuthorityDecision:
        return AuthorityDecision(status, reason, request.actor, request.capability,
                                request.resource, version, missing)

    if request.actor != grant["delegate"]:
        return decision("blocked", "Actor is not the delegated authority.")
    if request.capability not in policy["capabilities"]:
        return decision("approval_required", "Capability is outside the owner's delegated grant.")
    if not _within_scope(request.resource, policy["resource_prefixes"], policy.get("resource_exact", [])):
        return decision("approval_required", "Resource is outside the delegated project scope.")
    if request.data_classification in policy["blocked_data_classes"]:
        return decision("approval_required", "This data class is excluded from autonomous access.")
    if request.irreversible or request.destructive:
        return decision("approval_required", "Irreversible or destructive actions require human approval.")

    if request.capability == "release.deploy" and request.environment == "production":
        release = policy["production_release"]
        if not release.get("enabled") or request.resource != release["target"]:
            return decision("approval_required", "Production target is not covered by the release grant.")
        missing = tuple(item for item in release["required_evidence"] if item not in request.evidence)
        if missing:
            return decision("blocked", "Production release evidence is incomplete.", missing)

    if request.external_effect:
        allowed_release = (
            request.capability == "release.deploy"
            and request.environment == "production"
            and request.resource == policy["production_release"]["target"]
        )
        if not allowed_release:
            return decision("approval_required", "External effects are outside the autonomous grant.")

    return decision("authorized", "Action is within LYR's delegated authority and policy gates.")


def audit_receipt(request: ActionRequest, result: AuthorityDecision) -> dict[str, Any]:
    """Create a timestamped, inspectable decision receipt; never stores input payloads."""
    return {
        "schema": "mc.lyr-authority-receipt.v1",
        "recorded_at": datetime.now(timezone.utc).isoformat(),
        "request": {
            "actor": request.actor,
            "capability": request.capability,
            "resource": request.resource,
            "purpose": request.purpose,
            "environment": request.environment,
            "data_classification": request.data_classification,
            "external_effect": request.external_effect,
            "irreversible": request.irreversible,
            "destructive": request.destructive,
            "evidence": list(request.evidence),
        },
        "decision": result.to_dict(),
    }
