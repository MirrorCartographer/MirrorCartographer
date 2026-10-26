from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from validate_proof_gate import find_stale_claims


class ProofGateConsistencyTests(unittest.TestCase):
    def test_detects_stale_claim_when_ci_succeeded(self):
        manifest = {"checks": {"validator_ci": {"status": "success", "stale_phrases": ["hosted CI must independently confirm"]}}}
        findings = find_stale_claims(manifest, "The hosted CI must independently confirm the result.")
        self.assertEqual([item["check"] for item in findings], ["validator_ci"])

    def test_accepts_record_without_stale_claim(self):
        manifest = {"checks": {"validator_ci": {"status": "success", "stale_phrases": ["hosted CI must independently confirm"]}}}
        self.assertEqual(find_stale_claims(manifest, "Hosted run #3 succeeded on the recorded head."), [])

    def test_pending_check_does_not_flag_pending_language(self):
        manifest = {"checks": {"validator_ci": {"status": "pending", "stale_phrases": ["hosted CI must independently confirm"]}}}
        self.assertEqual(find_stale_claims(manifest, "Hosted CI must independently confirm the result."), [])

    def test_matching_is_case_insensitive(self):
        manifest = {"checks": {"validator_ci": {"status": "success", "stale_phrases": ["must be rerun"]}}}
        self.assertEqual(len(find_stale_claims(manifest, "Tests MUST BE RERUN.")), 1)

    def test_rejects_non_object_manifest(self):
        with self.assertRaisesRegex(ValueError, "root must be an object"):
            find_stale_claims([], "record")

    def test_rejects_invalid_status(self):
        manifest = {"checks": {"validator_ci": {"status": "green", "stale_phrases": []}}}
        with self.assertRaisesRegex(ValueError, "status must be one of"):
            find_stale_claims(manifest, "record")

    def test_rejects_malformed_stale_phrases(self):
        manifest = {"checks": {"validator_ci": {"status": "success", "stale_phrases": "not-a-list"}}}
        with self.assertRaisesRegex(ValueError, "must be a list"):
            find_stale_claims(manifest, "record")

    def test_detects_multiple_stale_claims(self):
        manifest = {"checks": {"validator_ci": {"status": "success", "stale_phrases": ["must be rerun", "must independently confirm"]}}}
        findings = find_stale_claims(manifest, "Tests must be rerun; hosted CI must independently confirm.")
        self.assertEqual(len(findings), 2)


if __name__ == "__main__":
    unittest.main()
