import unittest
from free_engine import Proposal, Consequence, Contradiction, Decision, consequence_tree


def proposal(**overrides):
    data = dict(title="Test", intervention="Small reversible test",
        baseline="Baseline measured before intervention", accountable_owner="Human lead",
        authority_confirmed=True, affected_parties=["participants"],
        outcomes=["task completion rate"], stop_conditions=["harm threshold exceeded"],
        rollback_plan="Disable pilot and restore prior process", data_plan="No personal data collected")
    data.update(overrides)
    return Proposal(**data)


class FreeEngineTests(unittest.TestCase):
    def test_complete_proposal_eligible_for_human_review(self):
        self.assertEqual(proposal().gate()["state"], "ELIGIBLE_FOR_HUMAN_REVIEW")

    def test_missing_authority_blocks(self):
        result = proposal(authority_confirmed=False).gate()
        self.assertEqual(result["state"], "BLOCKED")
        self.assertIn("AUTHORITY_NOT_CONFIRMED", result["blockers"])

    def test_high_impact_model_decision_blocks(self):
        result = proposal(high_impact=True, model_makes_decision=True).gate()
        self.assertIn("MODEL_DELEGATED_HIGH_IMPACT_DECISION", result["blockers"])

    def test_missing_baseline_returns_for_revision(self):
        result = proposal(baseline="").gate()
        self.assertEqual(result["state"], "RETURN_FOR_REVISION")

    def test_contradictions_are_preserved(self):
        p = proposal()
        p.add_contradiction(Contradiction("source-a", "source-b", "Incompatible dates"))
        result = p.gate()
        self.assertEqual(result["state"], "REVIEW_REQUIRED")
        self.assertEqual(result["contradictions_preserved"], 1)
        self.assertEqual(len(p.contradictions), 1)

    def test_recursive_consequence_links(self):
        p = proposal()
        first = Consequence("Direct effect", parent_id=p.id, owner="Lead", monitoring_method="weekly review")
        second = Consequence("Downstream effect", parent_id=first.id, owner="Lead", monitoring_method="monthly review")
        p.add_consequence(first)
        p.add_consequence(second)
        tree = consequence_tree(p)
        self.assertEqual(tree["consequences"][0]["children"][0]["record"]["description"], "Downstream effect")

    def test_unowned_open_consequence_blocks_closure(self):
        p = proposal()
        p.add_consequence(Consequence("Untracked side effect", parent_id=p.id))
        self.assertEqual(p.gate()["state"], "RETURN_FOR_REVISION")

    def test_decision_requires_human_reviewer(self):
        p = proposal()
        with self.assertRaises(ValueError):
            p.record_decision(Decision.CONTINUE, "Looks good", "")
        record = p.record_decision(Decision.MODIFY, "Revise measure", "Reviewer")
        self.assertEqual(record["decision"], "MODIFY")


if __name__ == "__main__":
    unittest.main()
