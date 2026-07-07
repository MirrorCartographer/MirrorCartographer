#!/usr/bin/env python3
"""Tests for source chain validator."""

from validate_source_chains import validate_packets


def test_pass_review_block_routes() -> None:
    packets = [
        {
            "packet_id": "pkt.pass",
            "domain": "longitudinal_observation",
            "claim_status": "observation",
            "privacy_status": "public_safe",
            "source_status": "synthetic",
            "sources": [
                {
                    "source_id": "src.1",
                    "source_type": "synthetic",
                    "citation": "Synthetic fixture.",
                    "retrieved_at": "2026-07-07",
                    "supports": ["claim.1"],
                    "limitations": ["synthetic only"],
                }
            ],
            "claims": [
                {
                    "claim_id": "claim.1",
                    "text": "Synthetic observation only.",
                    "claim_type": "observation",
                    "source_ids": ["src.1"],
                }
            ],
            "missingness": [],
        },
        {
            "packet_id": "pkt.review",
            "domain": "medical_literature",
            "claim_status": "literature_summary",
            "privacy_status": "public_safe",
            "source_status": "unknown",
            "sources": [
                {
                    "source_id": "src.2",
                    "source_type": "derived_summary",
                    "citation": "",
                    "retrieved_at": "2026-07-07",
                    "supports": ["claim.2"],
                    "limitations": [],
                }
            ],
            "claims": [
                {
                    "claim_id": "claim.2",
                    "text": "Synthetic interpretation needs review.",
                    "claim_type": "interpretation",
                    "source_ids": ["src.2", "src.missing"],
                }
            ],
            "missingness": ["citation_text"],
        },
        {
            "packet_id": "pkt.block",
            "domain": "animal_care",
            "claim_status": "hypothesis",
            "privacy_status": "private",
            "source_status": "first_party_observation",
            "sources": [
                {
                    "source_id": "src.3",
                    "source_type": "observation_log",
                    "citation": "Synthetic private fixture.",
                    "retrieved_at": "2026-07-07",
                    "supports": ["claim.3"],
                    "limitations": ["privacy unsafe"],
                }
            ],
            "claims": [
                {
                    "claim_id": "claim.3",
                    "text": "Synthetic cure claim must block.",
                    "claim_type": "cure_claim",
                    "source_ids": ["src.3"],
                }
            ],
            "missingness": [],
        },
    ]

    output = validate_packets(packets)
    routes = {result["packet_id"]: result["route"] for result in output["results"]}

    assert output["summary"] == {"total_packets": 3, "pass": 1, "review": 1, "block": 1}
    assert routes["pkt.pass"] == "pass"
    assert routes["pkt.review"] == "review"
    assert routes["pkt.block"] == "block"


def test_missing_required_field_blocks() -> None:
    output = validate_packets([
        {
            "packet_id": "pkt.missing",
            "domain": "hypothesis",
            "privacy_status": "public_safe",
        }
    ])
    result = output["results"][0]
    assert result["route"] == "block"
    assert "missing_required_field:claim_status" in result["reasons"]
    assert result["next_executable_action"] == "repair_packet_schema_before_reuse"


if __name__ == "__main__":
    test_pass_review_block_routes()
    test_missing_required_field_blocks()
    print("source_chain_validator tests passed")
