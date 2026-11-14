import tempfile
import unittest
from pathlib import Path
from runtime.orchestrator.orchestrator import Identity, ProposedAction, RiskMetadata, LyrOrchestrator, JsonlAuditSink
from tools.free_engine.free_engine import Proposal

GRANT = {"schema":"mc.lyr-authority-grant.v1","version":"test-1","delegate":"lyr",
 "grant":{"capability_scopes":{"site.content.write":{"prefixes":["site/"],"exact":[]}},
 "blocked_data_classes":["private_user_data"],"production_release":{"enabled":False,"required_evidence":[]}}}
class Auth:
 def authenticate(self, credential):
  if credential != "valid": raise ValueError("invalid")
  return Identity("lyr")
class Risk:
 def __init__(self, classification="public"): self.classification=classification
 def inspect(self, proposal): return RiskMetadata(self.classification)
class BrokenSink:
 def append(self, record): raise OSError("disk full")
def free_proposal():
 return Proposal(title="Add page",intervention="Create a static page",baseline="Current inventory",
  accountable_owner="project-owner",authority_confirmed=True,affected_parties=["visitors"],
  outcomes=["Page loads"],stop_conditions=["Broken navigation"],rollback_plan="Revert commit",
  data_plan="No personal data")
class OrchestratorTests(unittest.TestCase):
 def run_action(self, **kwargs):
  with tempfile.TemporaryDirectory() as tmp:
   sink=JsonlAuditSink(Path(tmp)/"audit.jsonl")
   service=LyrOrchestrator(Auth(),Risk(),sink,GRANT)
   proposal=ProposedAction("site.content.write","site/new.html","Add page",free_proposal())
   result=service.dispatch("valid",proposal,**kwargs)
   return result,(Path(tmp)/"audit.jsonl").read_text()
 def test_valid_action_is_dry_run_only_and_audited(self):
  result,audit=self.run_action()
  self.assertEqual(result.status,"dry_run_authorized")
  self.assertIn('"performed": false',audit)
  self.assertTrue(result.receipt_id)
 def test_bad_credentials_block_before_policy(self):
  with tempfile.TemporaryDirectory() as tmp:
   service=LyrOrchestrator(Auth(),Risk(),JsonlAuditSink(Path(tmp)/"a.jsonl"),GRANT)
   p=ProposedAction("site.content.write","site/new.html","Add",free_proposal())
   self.assertEqual(service.dispatch("bad",p).status,"blocked")
 def test_sensitive_classification_comes_from_trusted_inspector(self):
  with tempfile.TemporaryDirectory() as tmp:
   service=LyrOrchestrator(Auth(),Risk("private_user_data"),JsonlAuditSink(Path(tmp)/"a.jsonl"),GRANT)
   p=ProposedAction("site.content.write","site/profile.json","Edit",free_proposal())
   self.assertEqual(service.dispatch("valid",p).status,"approval_required")
 def test_audit_failure_blocks(self):
  service=LyrOrchestrator(Auth(),Risk(),BrokenSink(),GRANT)
  p=ProposedAction("site.content.write","site/new.html","Add",free_proposal())
  self.assertEqual(service.dispatch("valid",p).status,"blocked")
 def test_free_gate_blocks_missing_rollback(self):
  with tempfile.TemporaryDirectory() as tmp:
   service=LyrOrchestrator(Auth(),Risk(),JsonlAuditSink(Path(tmp)/"a.jsonl"),GRANT)
   p=free_proposal();p.rollback_plan=None
   proposal=ProposedAction("site.content.write","site/new.html","Add",p)
   self.assertEqual(service.dispatch("valid",proposal).status,"blocked")
 def test_unresolved_contradictions_require_review(self):
  with tempfile.TemporaryDirectory() as tmp:
   service=LyrOrchestrator(Auth(),Risk(),JsonlAuditSink(Path(tmp)/"a.jsonl"),GRANT)
   p=free_proposal()
   from tools.free_engine.free_engine import Contradiction
   p.add_contradiction(Contradiction("source-a","source-b","Conflicting evidence"))
   proposal=ProposedAction("site.content.write","site/new.html","Add",p)
   self.assertEqual(service.dispatch("valid",proposal).status,"approval_required")
 def test_execution_request_cannot_execute_in_v1(self):
  result,audit=self.run_action(dry_run=False)
  self.assertEqual(result.status,"execution_disabled")
  self.assertIn('"performed": false',audit)
if __name__=="__main__": unittest.main()
