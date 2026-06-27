# Hourly Research Automation Spec

Revision note:

- Status: public-safe automation and workflow specification.
- Reason: created after the user asked for an hourly research loop that studies available Mirror Cartographer chats, files, saved context, and GitHub materials, then implements public-safe findings to GitHub.
- Source: current automation setup, long-context research protocols, privacy/publication boundary notes, execution hub recovery findings, and old evidence-register/lane-registry materials.
- Boundary: this file describes the intended automation behavior. It does not guarantee that every hourly run will have connector access, produce a useful finding, or write to GitHub.

## Automation goal

Every hour, research available Mirror Cartographer context and convert useful findings into public-safe GitHub artifacts.

## Available research surfaces

The automation may use available sources such as:

- current conversation context
- prior conversation memory
- file-library search results
- uploaded or exported files
- GitHub repository files
- existing public-safe indexes and source registers

## Non-available or limited surfaces

The automation cannot assume access to:

- deleted chats that were not exported or otherwise available
- private platform internals
- hidden model files
- hidden credentials
- external apps without authorized tools
- raw full archive analytics without the raw export source being available

## Public-output rule

Use available private-context material for understanding only.

Publish only:

- public-safe abstractions
- methods
- templates
- research questions
- product requirements
- evaluation criteria
- source-boundary notes
- privacy-safe indexes
- implementation plans

## Required labels for new findings

Every useful finding should try to label:

- source status
- claim status
- privacy status
- missingness
- revision reason
- folder route
- next executable unit

## Preferred output folders

Route findings to:

- `docs/reference/` for stable methods and policies
- `docs/research/` for hypotheses and research provocations
- `docs/education/` for school-subject or learning layers
- `docs/privacy/` for publication and privacy boundaries
- `docs/long-context/` for chat-source organization
- `docs/long-context/core/` for core origin architecture
- `docs/long-context/subjects/` for subject paths
- `src/` only for implementation changes

## Hourly loop

1. Search available context for a high-value thread.
2. Prefer old names, corrections, failure points, boundary shifts, and implementation friction.
3. Check whether the finding is public-safe.
4. Abstract private specifics.
5. Label claim/source/privacy/missingness.
6. Convert the finding into a method, requirement, question, test, or implementation plan.
7. Write to GitHub only when the artifact is useful and safe.
8. If write is blocked or inappropriate, report the finding without forcing publication.

## Bias and safety checks

The automation should watch for:

- over-publishing because a finding feels important
- over-redacting until the artifact becomes useless
- preserving only successful artifacts and losing failure history
- favoring source material that is easier to retrieve
- mistaking old poetic language for current public claims
- treating an assistant-generated summary as equal to a raw source

## Success standard

A good hourly run does at least one of these:

- adds a public-safe source-boundary note
- adds a subject path
- adds a research question or evaluation test
- improves a folder index
- documents a failure mode
- identifies missing source status
- converts an old concept into a product requirement
- avoids publication when privacy or claim status is unclear

## Search terms

hourly research automation, public-safe GitHub update, Mirror Cartographer automation, long-context research loop, source status, claim status, privacy status, missingness, execution hub, lane registry.