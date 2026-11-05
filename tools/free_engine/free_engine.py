"""FREE 2.0 deterministic decision workflow core.

Standard-library only. This is a traceability and gate engine, not an autonomous
ethics judge. Human review remains mandatory for consequential decisions.
"""
from __future__ import annotations
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from typing import Any
import json
import uuid


class Decision(str, Enum):
    CONTINUE = "CONTINUE"
    MODIFY = "MODIFY"
    PAUSE = "PAUSE"
    REVERSE = "REVERSE"
    REJECT = "REJECT"
    ESCALATE = "ESCALATE"


class Status(str, Enum):
    PROPOSED = "PROPOSED"
    REGISTERED = "REGISTERED"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"
    APPROVED_FOR_TEST = "APPROVED_FOR_TEST"
    ACTIVE = "ACTIVE"
    REVIEW_DUE = "REVIEW_DUE"
    CLOSED = "CLOSED"


@dataclass
class Consequence:
    description: str
    parent_id: str | None = None
    affected_parties: list[str] = field(default_factory=list)
    severity: str = "unknown"
    likelihood: str = "unknown"
    horizon: str = "unspecified"
    evidence_refs: list[str] = field(default_factory=list)
    owner: str | None = None
    monitoring_method: str | None = None
    status: str = "OPEN"
    id: str = field(default_factory=lambda: str(uuid.uuid4()))


@dataclass
class Contradiction:
    left_ref: str
    right_ref: str
    description: str
    resolution: str = "UNRESOLVED"
    notes: str = ""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))


@dataclass
class Proposal:
    title: str
    intervention: str
    baseline: str
    accountable_owner: str | None
    authority_confirmed: bool
    affected_parties: list[str]
    outcomes: list[str]
    stop_conditions: list[str]
    rollback_plan: str | None
    data_plan: str | None
    high_impact: bool = False
    model_makes_decision: bool = False
    severe_unmitigated_harm: bool = False
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    version: int = 1
    status: str = Status.PROPOSED.value
    assumptions: list[str] = field(default_factory=list)
    impacts: list[dict[str, Any]] = field(default_factory=list)
    consequences: list[Consequence] = field(default_factory=list)
    contradictions: list[Contradiction] = field(default_factory=list)
    decisions: list[dict[str, Any]] = field(default_factory=list)
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def add_consequence(self, consequence: Consequence) -> None:
        if consequence.parent_id is not None:
            known = {c.id for c in self.consequences}
            if consequence.parent_id not in known and consequence.parent_id != self.id:
                raise ValueError("parent_id must reference this proposal or an existing consequence")
        self.consequences.append(consequence)

    def add_contradiction(self, contradiction: Contradiction) -> None:
        # Contradictions are retained, not silently reconciled.
        self.contradictions.append(contradiction)

    def gate(self) -> dict[str, Any]:
        blockers: list[str] = []
        revisions: list[str] = []
        if not self.authority_confirmed:
            blockers.append("AUTHORITY_NOT_CONFIRMED")
        if not self.accountable_owner:
            blockers.append("NO_ACCOUNTABLE_OWNER")
        if self.severe_unmitigated_harm:
            blockers.append("SEVERE_UNMITIGATED_HARM")
        if self.high_impact and self.model_makes_decision:
            blockers.append("MODEL_DELEGATED_HIGH_IMPACT_DECISION")
        if not self.baseline.strip():
            revisions.append("BASELINE_MISSING")
        if not self.outcomes:
            revisions.append("MEASURABLE_OUTCOMES_MISSING")
        if not self.stop_conditions:
            revisions.append("STOP_CONDITIONS_MISSING")
        if not self.rollback_plan:
            revisions.append("ROLLBACK_PLAN_MISSING")
        if not self.data_plan:
            revisions.append("DATA_HANDLING_PLAN_MISSING")
        open_unowned = [c.id for c in self.consequences if c.status == "OPEN" and (not c.owner or not c.monitoring_method)]
        if open_unowned:
            revisions.append("OPEN_CONSEQUENCES_WITHOUT_OWNER_OR_MONITOR:" + ",".join(open_unowned))
        if blockers:
            state = "BLOCKED"
        elif revisions:
            state = "RETURN_FOR_REVISION"
        elif self.contradictions:
            state = "REVIEW_REQUIRED"
        else:
            state = "ELIGIBLE_FOR_HUMAN_REVIEW"
        return {"state": state, "blockers": blockers, "revisions": revisions,
                "contradictions_preserved": len(self.contradictions)}

    def record_decision(self, decision: Decision, rationale: str, reviewer: str,
                        evidence_refs: list[str] | None = None) -> dict[str, Any]:
        if not reviewer.strip():
            raise ValueError("A named human reviewer is required")
        record = {"decision": decision.value, "rationale": rationale,
                  "reviewer": reviewer, "evidence_refs": evidence_refs or [],
                  "timestamp": datetime.now(timezone.utc).isoformat(),
                  "proposal_version": self.version}
        self.decisions.append(record)
        return record

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    def to_json(self) -> str:
        return json.dumps(self.to_dict(), indent=2, ensure_ascii=False)


def consequence_tree(proposal: Proposal) -> dict[str, Any]:
    """Return a nested view while preserving the original flat, linked records."""
    nodes = {c.id: {"record": asdict(c), "children": []} for c in proposal.consequences}
    roots = []
    for c in proposal.consequences:
        node = nodes[c.id]
        if c.parent_id == proposal.id or c.parent_id is None:
            roots.append(node)
        elif c.parent_id in nodes:
            nodes[c.parent_id]["children"].append(node)
        else:
            roots.append(node)
    return {"proposal_id": proposal.id, "consequences": roots}


def export_audit(proposal: Proposal) -> str:
    return json.dumps({"schema": "free-2.0", "proposal": proposal.to_dict(),
                       "gate": proposal.gate(), "consequence_tree": consequence_tree(proposal)},
                      indent=2, ensure_ascii=False)
