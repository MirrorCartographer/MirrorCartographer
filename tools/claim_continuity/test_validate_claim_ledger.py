import copy
import unittest

from validate_claim_ledger import validate_ledger


def valid_ledger():
    return {
        "schema_version": "mc.claim-ledger.v1",
        "ledger_id": "test-ledger",
        "privacy_scope": "synthetic_public",
        "claims": [{
            "claim_id": "c1",
            "statement": "A synthetic test passed.",
            "kind": "observation",
            "status": "supported",
            "scope": "local fixture only",
            "temporal": {"state": "anchored", "valid_from": "2026-01-01T00:00:00Z", "valid_to": "2026-01-01T00:00:00Z"},
            "recorded_at": "2026-01-01T00:01:00Z",
            "perspective": "test runner",
            "revision_reason": "Initial synthetic observation.",
            "sources": [{"source_id": "s1", "relation": "supports", "availability": "available", "locator": "synthetic://test/1"}]
        }],
        "relations": []
    }


class ClaimLedgerTests(unittest.TestCase):
    def test_accepts_bounded_synthetic_claim(self):
        self.assertEqual(validate_ledger(valid_ledger()), [])

    def test_unknown_is_not_zero_or_absence(self):
        ledger = valid_ledger()
        ledger["claims"][0]["status"] = "unknown"
        ledger["claims"][0]["temporal"] = {"state": "unknown", "valid_from": None, "valid_to": None}
        ledger["claims"][0]["sources"] = [{"source_id": "s1", "relation": "context_only", "availability": "not_collected"}]
        self.assertEqual(validate_ledger(ledger), [])

    def test_available_source_requires_locator_or_digest(self):
        ledger = valid_ledger()
        ledger["claims"][0]["sources"][0].pop("locator")
        self.assertTrue(any("requires locator or digest" in e for e in validate_ledger(ledger)))

    def test_supported_claim_requires_available_support(self):
        ledger = valid_ledger()
        ledger["claims"][0]["sources"][0]["availability"] = "unavailable"
        self.assertTrue(any("supported status requires" in e for e in validate_ledger(ledger)))

    def test_disputed_claim_requires_evidence_both_ways(self):
        ledger = valid_ledger()
        ledger["claims"][0]["status"] = "disputed"
        self.assertTrue(any("disputed status requires" in e for e in validate_ledger(ledger)))

    def test_rejects_dangling_relation(self):
        ledger = valid_ledger()
        ledger["relations"] = [{"from_claim": "c1", "to_claim": "missing", "type": "contradicts", "rationale": "synthetic"}]
        self.assertTrue(any("unknown claim" in e for e in validate_ledger(ledger)))

    def test_rejects_supersession_cycle(self):
        ledger = valid_ledger()
        ledger["claims"].append(copy.deepcopy(ledger["claims"][0]))
        ledger["claims"][1]["claim_id"] = "c2"
        ledger["claims"][1]["statement"] = "A later synthetic claim."
        ledger["claims"][1]["relations"] = []
        ledger["relations"] = [
            {"from_claim": "c1", "to_claim": "c2", "type": "supersedes", "rationale": "newer version"},
            {"from_claim": "c2", "to_claim": "c1", "type": "supersedes", "rationale": "cycle fixture"}
        ]
        self.assertTrue(any("supersedes cycle" in e for e in validate_ledger(ledger)))


if __name__ == "__main__":
    unittest.main()
