import copy
import json
import sys
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT))

from tools.platform_limit_investigator.validate_evidence import divergent_paths, validate


FIXTURE = (
    REPO_ROOT
    / "tools"
    / "platform_limit_investigator"
    / "examples"
    / "github_ref_provenance.json"
)


class EvidenceValidatorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))

    def test_synthetic_fixture_is_valid(self):
        self.assertEqual(validate(self.fixture), [])

    def test_fixture_exposes_blob_divergence_for_same_path(self):
        divergence = divergent_paths(self.fixture)
        self.assertIn("next.config.ts", divergence)
        self.assertEqual(len(divergence["next.config.ts"]), 2)

    def test_missing_explicit_ref_is_rejected(self):
        packet = copy.deepcopy(self.fixture)
        del packet["evidence"][0]["requested_ref"]
        self.assertTrue(any("requested_ref" in e for e in validate(packet)))

    def test_malformed_commit_sha_is_rejected(self):
        packet = copy.deepcopy(self.fixture)
        packet["evidence"][0]["commit_sha"] = "not-a-sha"
        self.assertTrue(any("commit_sha" in e for e in validate(packet)))

    def test_malformed_blob_sha_is_rejected(self):
        packet = copy.deepcopy(self.fixture)
        packet["evidence"][0]["blob_sha"] = "ABC123"
        self.assertTrue(any("blob_sha" in e for e in validate(packet)))

    def test_non_object_evidence_record_is_rejected_without_exception(self):
        packet = copy.deepcopy(self.fixture)
        packet["evidence"][0] = []
        errors = validate(packet)
        self.assertTrue(any("must be an object" in e for e in errors))

    def test_non_object_top_level_is_rejected(self):
        self.assertEqual(validate([]), ["top-level value must be an object"])

    def test_list_privacy_is_rejected_without_type_error(self):
        packet = copy.deepcopy(self.fixture)
        packet["privacy"] = []
        errors = validate(packet)
        self.assertTrue(any("privacy must be public or redacted" in e for e in errors))

    def test_list_category_is_rejected_without_type_error(self):
        packet = copy.deepcopy(self.fixture)
        packet["category"] = []
        errors = validate(packet)
        self.assertTrue(any("recognized limitation category" in e for e in errors))

    def test_empty_evidence_is_rejected(self):
        packet = copy.deepcopy(self.fixture)
        packet["evidence"] = []
        self.assertTrue(any("non-empty list" in e for e in validate(packet)))

    def test_blank_observation_is_rejected(self):
        packet = copy.deepcopy(self.fixture)
        packet["observation"] = "  "
        self.assertTrue(any("non-empty string" in e for e in validate(packet)))


if __name__ == "__main__":
    unittest.main()
