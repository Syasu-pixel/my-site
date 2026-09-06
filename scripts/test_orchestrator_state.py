#!/usr/bin/env python3
import copy
import unittest
from orchestrator_state import transition

BASE = {
    "schema_version": "0.1", "job_id": "test", "state": "QUEUED", "revision": 0,
    "max_revisions": 3, "human_gate": {"required": True, "status": "pending"}, "events": []
}

class StateTests(unittest.TestCase):
    def test_happy_path_to_gate(self):
        d = copy.deepcopy(BASE)
        for state, actor in [("EDITING","editor"),("BUILDING","builder"),("CHALLENGING","challenger"),("REVIEWING","reviewer"),("PREVIEWING","reviewer"),("HUMAN_GATE","orchestrator")]:
            transition(d, state, actor, "test")
        self.assertEqual(d["state"], "HUMAN_GATE")

    def test_revision_limit_escalates(self):
        d = copy.deepcopy(BASE)
        d["state"] = "REVIEWING"
        d["revision"] = 3
        transition(d, "REVISING", "reviewer", "still blocked")
        self.assertEqual(d["state"], "ESCALATED")
        self.assertEqual(d["revision"], 3)

    def test_illegal_transition_fails(self):
        d = copy.deepcopy(BASE)
        with self.assertRaises(SystemExit):
            transition(d, "PUBLISHING", "builder", "skip gates")

    def test_approval_requires_gate_status(self):
        d = copy.deepcopy(BASE)
        d["state"] = "HUMAN_GATE"
        with self.assertRaises(SystemExit):
            transition(d, "APPROVED", "orchestrator", "not approved")
        d["human_gate"]["status"] = "approved"
        transition(d, "APPROVED", "orchestrator", "owner approved")
        self.assertEqual(d["state"], "APPROVED")

if __name__ == "__main__":
    unittest.main()
