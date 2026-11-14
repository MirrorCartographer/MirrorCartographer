"""Deterministic policy gate for LYR's delegated project authority.

This module authorizes bounded project actions. It is not an identity provider,
an execution adapter, or proof that deployment evidence is genuine. Callers
must authenticate the actor, classify resources, verify evidence independently,
and execute only the exact authorized operation.
"""
from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import PurePosixPath
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
    grant = data.get("grant")
    if not isinstance(grant, dict) or not isinstance(grant.get("capability_scopes"), dict):
        raise ValueError("Authority grant is missing capability scopes")
    return data


def _normalize_resource(resource: str) -> str | None:
    """Reject absolute paths and traversal; return a canonical project-relative path."""
    if not isinstance(resource, str) or not resource or "\x00" in resource:
        return None
    if resource.startswith(("/", "\\")) or (len(resource) > 1 and resource[1] == ":"):
        return None
    normalized = resource.replace("\\", "/")
    parts = normalized.split("/")
    if any(part in {"", ".", ".."} for part in parts):
        return None
    canonical = PurePosixPath(normalized).as_posix()
    return canonical if canonical == normalized else None


def _within_scope(resource: str, scope: dict[str, Any]) -> bool:
    exact = scope.get("exact", [])
    prefixes = scope.get("prefixes", [])
    if resource in exact:
        return True
    return any(resource.startswith(prefix) for prefix in prefixes)


def evaluate(request: ActionRequest, grant: dict[str, Any] | None = None) -> AuthorityDecision:
    grant = grant or load_grant()
    policy = grant["grant"]
    version = grant["version"]

    def decision(status: str, reason: str, missing: tuple[str, ...] = ()) -> AuthorityDecision:
        return AuthorityDecision(status, reason, request.actor, request.capability,
                                 request.resource, version, missing)

    if request.actor != grant["delegate"]:
        return decision("blocked", "Actor is not the delegated authority.")

    normalized = _normalize_resource(request.resource)
    if normalized is None:
        return decision("blocked", "Resource path is invalid, absolute, or contains traversal.")

    scope = policy["capability_scopes"].get(request.capability)
    if scope is None:
        return decision("approval_required", "Capability is outside the owner's delegated grant.")
    if not _within_scope(normalized, scope):
        return decision("approval_required", "Capability cannot modify this resource scope.")
    if request.data_classification in policy["blocked_data_classes"]:
        return decision("approval_required", "This data class is excluded from autonomous access.")
    if request.irreversible or request.destructive:
        return decision("approval_required", "Irreversible or destructive actions require human approval.")

    if request.capability == "release.deploy" and request.environment == "production":
        release = policy["production_release"]
        if not release.get("enabled"):
            return decision("approval_required", "Production release is not enabled until independent CI and rollback attestation is integrated.")
        missing = tuple(item for item in release["required_evidence"] if item not in request.evidence)
        if missing:
            return decision("blocked", "Production release evidence is incomplete.", missing)

    if request.capability == "release.deploy" and request.environment != "production":
        return decision("approval_required", "Only explicitly configured release environments are permitted.")

    if request.external_effect:
        allowed_release = (
            request.capability == "release.deploy"
            and request.environment == "production"
            and policy["production_release"].get("enabled")
        )
        if not allowed_release:
            return decision("approval_required", "External effects are outside the delegated grant.")

    return decision("authorized", "Action is within LYR's delegated authority and capability-specific scope.")


def audit_receipt(request: ActionRequest, result: AuthorityDecision) -> dict[str, Any]:
    """Create a timestamped decision receipt without storing action payloads."""
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
