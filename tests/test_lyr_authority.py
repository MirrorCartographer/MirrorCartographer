import unittest

from runtime.authority.authority import ActionRequest, evaluate, audit_receipt


GRANT = {
    "schema": "mc.lyr-authority-grant.v1",
    "version": "test-1",
    "delegate": "lyr",
    "grant": {
        "capabilities": ["site.content.write", "network.component.write", "release.deploy"],
        "resource_prefixes": ["site/", "network/"],
        "blocked_data_classes": ["credentials", "private_user_data", "health_data"],
        "human_approval_required_for": ["irreversible", "destructive"],
        "production_release": {
            "enabled": True,
            "target": "owned-production",
            "required_evidence": ["tests_passed", "rollback_available", "artifact_digest", "provenance_ref"]
        }
    }
}


class AuthorityTests(unittest.TestCase):
    def test_lyr_can_change_scoped_site_content(self):
        result = evaluate(ActionRequest("lyr", "site.content.write", "site/rooms/new.html", "Add a room"), GRANT)
        self.assertEqual(result.status, "authorized")

    def test_wrong_actor_is_blocked(self):
        result = evaluate(ActionRequest("visitor", "site.content.write", "site/rooms/new.html", "Add a room"), GRANT)
        self.assertEqual(result.status, "blocked")

    def test_out_of_scope_resource_requires_approval(self):
        result = evaluate(ActionRequest("lyr", "site.content.write", "billing/plan.json", "Change billing"), GRANT)
        self.assertEqual(result.status, "approval_required")

    def test_sensitive_data_requires_approval(self):
        result = evaluate(ActionRequest("lyr", "site.content.write", "site/profile.json", "Update profile", data_classification="private_user_data"), GRANT)
        self.assertEqual(result.status, "approval_required")

    def test_destructive_action_requires_approval(self):
        result = evaluate(ActionRequest("lyr", "site.content.write", "site/rooms/old.html", "Remove old room", destructive=True), GRANT)
        self.assertEqual(result.status, "approval_required")

    def test_production_release_requires_all_evidence(self):
        request = ActionRequest("lyr", "release.deploy", "owned-production", "Publish tested release", environment="production")
        result = evaluate(request, GRANT)
        self.assertEqual(result.status, "blocked")
        self.assertEqual(set(result.required_evidence_missing), {"tests_passed", "rollback_available", "artifact_digest", "provenance_ref"})

    def test_production_release_is_autonomous_when_gates_pass(self):
        evidence = ("tests_passed", "rollback_available", "artifact_digest", "provenance_ref")
        request = ActionRequest("lyr", "release.deploy", "owned-production", "Publish tested release", environment="production", external_effect=True, evidence=evidence)
        result = evaluate(request, GRANT)
        self.assertEqual(result.status, "authorized")

    def test_other_external_effects_require_approval(self):
        request = ActionRequest("lyr", "network.component.write", "network/peers.json", "Connect an external service", external_effect=True)
        result = evaluate(request, GRANT)
        self.assertEqual(result.status, "approval_required")

    def test_receipt_excludes_payload_and_preserves_decision(self):
        request = ActionRequest("lyr", "site.content.write", "site/index.html", "Update homepage")
        result = evaluate(request, GRANT)
        receipt = audit_receipt(request, result)
        self.assertEqual(receipt["decision"]["status"], "authorized")
        self.assertNotIn("payload", str(receipt))


if __name__ == "__main__":
    unittest.main()
