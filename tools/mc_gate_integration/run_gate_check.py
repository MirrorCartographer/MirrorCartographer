#!/usr/bin/env python3
from validate_gate_packets import validate_fixture
from pathlib import Path

base = Path(__file__).resolve().parent
exit_code, errors = validate_fixture(base / "gate_registry.json", base / "fixtures.synthetic.json")
for error in errors:
    print(error)
if exit_code == 0:
    print("MC gate integration passed")
raise SystemExit(exit_code)
