"""Fail-closed, dry-run-first orchestration for LYR.
No caller-supplied actor or data classification is trusted. Identity and risk
metadata come from injected trusted adapters. v1 has no execution adapter.
"""
from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime, timezone
import json, os
from pathlib import Path
from typing import Any, Protocol
from runtime.authority.authority import ActionRequest, evaluate, load_grant, audit_receipt

@dataclass(frozen=True)
class Identity:
    subject: str

@dataclass(frozen=True)
class ProposedAction:
    capability: str
    resource: str
    purpose: str
    free_proposal: Any
    environment: str = "development"

@dataclass(frozen=True)
class RiskMetadata:
    data_classification: str
    external_effect: bool = False
    irreversible: bool = False
    destructive: bool = False

class Authenticator(Protocol):
    def authenticate(self, credential: Any) -> Identity: ...

class RiskInspector(Protocol):
    def inspect(self, proposal: ProposedAction) -> RiskMetadata: ...

class AuditSink(Protocol):
    def append(self, record: dict[str, Any]) -> None: ...

class JsonlAuditSink:
    """Append-only local JSONL sink. Creates owner-readable files only."""
    def __init__(self, path: str | Path):
        self.path = Path(path)
    def append(self, record: dict[str, Any]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        payload = (json.dumps(record, sort_keys=True, ensure_ascii=False) + "\n").encode("utf-8")
        fd = os.open(self.path, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o600)
        try:
            written = os.write(fd, payload)
            if written != len(payload):
                raise OSError("Incomplete audit receipt write")
            os.fsync(fd)
        finally:
            os.close(fd)

@dataclass(frozen=True)
class DispatchResult:
    status: str
    reason: str
    authority: dict[str, Any] | None = None
    free_gate: dict[str, Any] | None = None
    receipt_id: str | None = None

def _receipt_id(record: dict[str, Any]) -> str:
    import hashlib
    raw = json.dumps(record, sort_keys=True, ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

class LyrOrchestrator:
    """Policy coordinator. v1 supports audited dry-runs only."""
    def __init__(self, authenticator: Authenticator, risk_inspector: RiskInspector,
                 audit_sink: AuditSink, grant: dict[str, Any] | None = None):
        self.authenticator = authenticator
        self.risk_inspector = risk_inspector
        self.audit_sink = audit_sink
        self.grant = grant if grant is not None else load_grant()

    def dispatch(self, credential: Any, proposal: ProposedAction, *, dry_run: bool = True) -> DispatchResult:
        try:
            identity = self.authenticator.authenticate(credential)
            if not isinstance(identity, Identity) or not identity.subject:
                raise ValueError("Authenticator returned no verified subject")
        except Exception:
            return DispatchResult("blocked", "Authentication failed; no action was evaluated.")
        try:
            risk = self.risk_inspector.inspect(proposal)
            if not isinstance(risk, RiskMetadata):
                raise ValueError("Risk inspector returned invalid metadata")
        except Exception:
            return DispatchResult("blocked", "Trusted risk classification unavailable; failed closed.")
        try:
            free_gate = proposal.free_proposal.gate()
            if not isinstance(free_gate, dict):
                raise ValueError("FREE gate returned invalid result")
        except Exception:
            return DispatchResult("blocked", "FREE 2.0 review unavailable; failed closed.")
        if free_gate.get("state") in {"BLOCKED", "RETURN_FOR_REVISION"}:
            return DispatchResult("blocked", "FREE 2.0 gate did not clear the proposal.", free_gate=free_gate)
        request = ActionRequest(
            actor=identity.subject, capability=proposal.capability, resource=proposal.resource,
            purpose=proposal.purpose, environment=proposal.environment,
            data_classification=risk.data_classification, external_effect=risk.external_effect,
            irreversible=risk.irreversible, destructive=risk.destructive,
        )
        try:
            decision = evaluate(request, self.grant)
        except Exception:
            return DispatchResult("blocked", "Authority policy unavailable; failed closed.", free_gate=free_gate)
        record = {
            "schema": "mc.lyr-orchestrator-receipt.v1",
            "recorded_at": datetime.now(timezone.utc).isoformat(),
            "mode": "dry_run" if dry_run else "execution_disabled",
            "free_gate": free_gate,
            "authority": audit_receipt(request, decision),
            "execution": {"performed": False, "reason": "No execution adapter is enabled in orchestrator v1."},
        }
        rid = _receipt_id(record)
        record["receipt_id"] = rid
        try:
            self.audit_sink.append(record)
        except Exception:
            return DispatchResult("blocked", "Audit persistence failed; failed closed.", decision.to_dict(), free_gate)
        if decision.status != "authorized":
            status = "approval_required" if decision.status == "approval_required" else "blocked"
            return DispatchResult(status, decision.reason, decision.to_dict(), free_gate, rid)
        if not dry_run:
            return DispatchResult("execution_disabled", "Policy passed, but v1 has no execution adapter. No mutation occurred.",
                                  decision.to_dict(), free_gate, rid)
        return DispatchResult("dry_run_authorized", "FREE 2.0 and delegated authority passed. No mutation occurred.",
                              decision.to_dict(), free_gate, rid)
