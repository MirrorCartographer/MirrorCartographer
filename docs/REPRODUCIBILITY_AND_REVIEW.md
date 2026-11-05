# Reproducibility and independent review guide

**Updated:** 2026-11-05

## How to review this project

1. Start with the [README](../README.md), [Observatory Field Guide](../OBSERVATORY_FIELD_GUIDE.md), and [Cabinet of Real Things](../CABINET_OF_REAL_THINGS.md).
2. Inspect a specific research expedition or demonstration, not just the project thesis.
3. Follow each linked source file and test.
4. Check the repository's commit history and GitHub Actions runs for the exact revision.
5. Separate public source from private implementation; request access only through the project owner.
6. Report the test environment, commit SHA, commands, output, and limitations when reproducing a result.

## Source checkout

```bash
git clone https://github.com/MirrorCartographer/MirrorCartographer.git
cd MirrorCartographer
```

The repository contains a mix of Markdown, HTML, JavaScript, Python, research data, and media. Each experiment's own README or source file is authoritative for its runtime. Do not assume one root-level command runs every artifact.

## Reproduction record template

For each review, record:

- Artifact path and repository.
- Commit SHA.
- Operating system and runtime versions.
- Exact command or browser URL.
- Input data and whether it is synthetic.
- Expected output.
- Actual output.
- Test result.
- Limitations and deviations.

## Independent-review boundaries

- Public repository contents are inspectable without private account access.
- Private repositories C and J are not public evidence endpoints; this guide does not expose their source or data.
- Canvas snapshots are historical artifacts; a recovered snapshot does not guarantee its original runtime is available.
- A deployment URL is not a substitute for source review or a reproducible test.
- A passing source/CI check is not proof of user outcomes or scientific validity.

## Contact and attribution

Project lead: Charity Alessandra Sturgell  
Project: Mirror Cartographer  
Canonical public research repository: https://github.com/MirrorCartographer/MirrorCartographer  
Public interactive repository: https://github.com/MirrorCartographer/mirror-cartographer-ui
