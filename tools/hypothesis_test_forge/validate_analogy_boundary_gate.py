#!/usr/bin/env python3
"""
Validate the MC analogy boundary gate fixture.

This validator is research-organization infrastructure only. It does not provide
medical advice, veterinary advice, diagnosis, treatment, dosage guidance, or
emergency triage.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FIXTURE = ROOT / "analogy_boundary_gate_fixture.json"

REQUIRED_TOP_LEVEL = {
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
    "records",
}

REQUIRED_RECORD_FIELDS = {
    "id",
    "domain",
    "source_status",
    "claim_status",
    "privacy_status",
    "symbolic_phrase",
    "analogy",
    "observation",
    "mechanism_claim",
    "measurable_prediction",
    "missingness",
    "revision_reason",
    "implementation_status",
    "testability",
    "falsification_route",
    "next_executable_action",
    "allowed_routes",
    "blocked_promotions",
}

UNSAFE_PROMOTIONS = {
    "diagnosis",
    "treatment",
    "dosage_guidance",
    "emergency_triage",
    "veterinary_advice",
    "cure_claim",
    "discovery_proof",
    "public_proof",
    "certainty_claim",
    "hidden_reasoning_claim",
}

UNSAFE_MECHANISM_STATUSES = {
    "unsafe_unsupported",
    "unsafe_veterinary_directive",
    "diagnosis_claim",
    "treatment_claim",
    "cure_claim",
    "discovery_proof",
}

MISSINGNESS_COLLAPSE_PHRASES = {
    "none",
    "no missingness",
    "not missing",
    "missing means absent",
}


def fail(errors, record_id, message):
    errors.append(f"{record_id}: {message}")


def is_blank(value):
    return value is None or value == "" or value == [] or value == {}


def validate_record(record):
    errors = []
    record_id = record.get("id", "<missing id>")

    missing_fields = REQUIRED_RECORD_FIELDS - set(record)
    if missing_fields:
        fail(errors, record_id, f"missing required fields: {sorted(missing_fields)}")
        return errors

    if record["privacy_status"] not in {"deidentified", "synthetic", "deidentified_synthetic_records_only"}:
        fail(errors, record_id, "privacy_status must indicate deidentified or synthetic data")

    if any(phrase in str(record["missingness"]).lower() for phrase in MISSINGNESS_COLLAPSE_PHRASES):
        fail(errors, record_id, "missingness collapses unknowns into absence")

    mechanism = record["mechanism_claim"]
    if not isinstance(mechanism, dict) or "text" not in mechanism or "status" not in mechanism:
        fail(errors, record_id, "mechanism_claim must include text and status")
        return errors

    prediction = record["measurable_prediction"]
    if not isinstance(prediction, dict) or "variables" not in prediction or "decision_threshold" not in prediction:
        fail(errors, record_id, "measurable_prediction must include variables and decision_threshold")
        return errors

    blocked_promotions = set(record["blocked_promotions"])
    allowed_routes = set(record["allowed_routes"])
    unsafe_in_allowed = UNSAFE_PROMOTIONS & allowed_routes
    if unsafe_in_allowed:
        fail(errors, record_id, f"unsafe promotion appears in allowed_routes: {sorted(unsafe_in_allowed)}")

    is_negative_control = record["implementation_status"] == "negative_control"
    if is_negative_control:
        if "blocked" not in allowed_routes:
            fail(errors, record_id, "negative controls must be routed to blocked")
        if mechanism["status"] not in UNSAFE_MECHANISM_STATUSES:
            fail(errors, record_id, "negative controls must expose an unsafe mechanism status")
        return errors

    if mechanism["status"] in UNSAFE_MECHANISM_STATUSES:
        fail(errors, record_id, "unsafe mechanism status cannot pass")

    if is_blank(record["analogy"]) or is_blank(record["observation"]):
        fail(errors, record_id, "analogy and observation must both be present and separated")

    if is_blank(prediction["variables"]):
        fail(errors, record_id, "passing records require measurable prediction variables")

    if is_blank(prediction["decision_threshold"]):
        fail(errors, record_id, "passing records require a decision threshold")

    if not blocked_promotions:
        fail(errors, record_id, "blocked_promotions must not be empty")

    if not (UNSAFE_PROMOTIONS & blocked_promotions):
        fail(errors, record_id, "blocked_promotions must include at least one unsafe class")

    if "analogy_not_evidence" not in record["claim_status"] and "hypothesis" not in record["claim_status"]:
        fail(errors, record_id, "claim_status must avoid treating analogy as proof")

    return errors


def main():
    data = json.loads(FIXTURE.read_text(encoding="utf-8"))
    errors = []

    missing_top = REQUIRED_TOP_LEVEL - set(data)
    if missing_top:
        errors.append(f"top-level missing fields: {sorted(missing_top)}")

    if data.get("privacy_status") != "deidentified_synthetic_records_only":
        errors.append("top-level privacy_status must be deidentified_synthetic_records_only")

    records = data.get("records", [])
    if len(records) < 2:
        errors.append("fixture must contain at least two records")

    negative_controls = 0
    passing_controls = 0

    for record in records:
        record_errors = validate_record(record)
        errors.extend(record_errors)
        if record.get("implementation_status") == "negative_control":
            negative_controls += 1
        elif not record_errors:
            passing_controls += 1

    if negative_controls < 1:
        errors.append("fixture must include at least one negative control")
    if passing_controls < 1:
        errors.append("fixture must include at least one passing control")

    if errors:
        print("FAIL: analogy boundary gate fixture is invalid")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print("PASS: analogy boundary gate fixture is valid")
    print(f"records={len(records)} passing_controls={passing_controls} negative_controls={negative_controls}")


if __name__ == "__main__":
    main()
