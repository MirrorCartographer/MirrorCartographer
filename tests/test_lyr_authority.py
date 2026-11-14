import unittest

from runtime.authority.authority import ActionRequest, evaluate, audit_receipt


GRANT = {
    "schema": "mc.lyr-authority-grant.v1",
    "version": "test-1",
    "delegate": "lyr",
    "grant": {
        "capability_scopes": {
            "site.content.write": {"prefixes": ["site/", "public/"], "exact": []},
            "network.component.write": {"prefixes": ["network/"], "exact": []},
            "workflow.modify": {"prefixes": [".github/workflows/"], "exact": []},
            "release.deploy": {"prefixes": [], "exact": ["owned-production"]},
        },
        "blocked_data_classes": ["credentials", "private_user_data", "health_data"],
        "production_release": {
            "enabled": False,
            "target": "owned-production",
            "required_evidence": ["tests_passed", "rollback_available", "artifact_digest", "provenance_ref"]
        }
    }
}


class AuthorityTests(unittest.TestCase):
    def test_lyr_can_change_scoped_site_content(self):
        self.assertEqual(evaluate(ActionRequest("lyr", "site.content.write", "site/rooms/new.html", "Add a room"), GRANT).status, "authorized")

    def test_wrong_actor_is_blocked(self):
        self.assertEqual(evaluate(ActionRequest("visitor", "site.content.write", "site/rooms/new.html", "Add a room"), GRANT).status, "blocked")

    def test_capability_cannot_cross_into_workflow_scope(self):
        self.assertEqual(evaluate(ActionRequest("lyr", "site.content.write", ".github/workflows/release.yml", "Change workflow"), GRANT).status, "approval_required")

    def test_out_of_scope_resource_requires_approval(self):
        self.assertEqual(evaluate(ActionRequest("lyr", "site.content.write", "billing/plan.json", "Change billing"), GRANT).status, "approval_required")

    def test_path_traversal_is_blocked(self):
        self.assertEqual(evaluate(ActionRequest("lyr", "site.content.write", "site/../../.github/workflows/release.yml", "Escape scope"), GRANT).status, "blocked")

    def test_absolute_path_is_blocked(self):
        self.assertEqual(evaluate(ActionRequest("lyr", "site.content.write", "/etc/passwd", "Read system file"), GRANT).status, "blocked")

    def test_sensitive_data_requires_approval(self):
        self.assertEqual(evaluate(ActionRequest("lyr", "site.content.write", "site/profile.json", "Update profile", data_classification="private_user_data"), GRANT).status, "approval_required")

    def test_destructive_action_requires_approval(self):
        self.assertEqual(evaluate(ActionRequest("lyr", "site.content.write", "site/rooms/old.html", "Remove old room", destructive=True), GRANT).status, "approval_required")

    def test_production_release_stays_disabled_until_attestation_adapter_exists(self):
        result = evaluate(ActionRequest("lyr", "release.deploy", "owned-production", "Publish", environment="production", external_effect=True, evidence=("tests_passed", "rollback_available", "artifact_digest", "provenance_ref")), GRANT)
        self.assertEqual(result.status, "approval_required")

    def test_other_external_effects_require_approval(self):
        self.assertEqual(evaluate(ActionRequest("lyr", "network.component.write", "network/peers.json", "Connect external service", external_effect=True), GRANT).status, "approval_required")

    def test_receipt_excludes_payload_and_preserves_decision(self):
        request = ActionRequest("lyr", "site.content.write", "site/index.html", "Update homepage")
        receipt = audit_receipt(request, evaluate(request, GRANT))
        self.assertEqual(receipt["decision"]["status"], "authorized")
        self.assertNotIn("payload", str(receipt))


if __name__ == "__main__":
    unittest.main()
