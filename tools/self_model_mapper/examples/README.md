# Verification fixtures and observations

- `valid_self_map.json` is synthetic and contains no personal records.
- `platform_limit.json` records a redacted runtime observation from 2026-10-14: local shell attempts to resolve `github.com` failed, while the connected GitHub repository tool could read repository files. No credentials or private records are included.

The GitHub Actions workflow validates both packet schemas and compiles the validator. This checks the record format; it does not independently reproduce the local DNS condition. The observation is scoped to the execution environment used for this investigation, and its underlying cause remains unknown.

Future reports should preserve command outcomes, distinguish observed symptoms from root-cause hypotheses, and use synthetic or redacted data.