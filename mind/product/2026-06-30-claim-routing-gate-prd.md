# PRD: Claim Routing Gate

## Source status
Public-safe synthesis from available Mirror Cartographer architecture materials, repository history, and current AI memory trust research.

## Claim status
Product requirement proposal. Not a shipped-feature claim.

## Privacy status
Public-safe. No personal, household, health, animal-care, financial, location, relationship, credential, or transcript details.

## Missingness
No verified runtime audit confirms this gate exists in the application. Treat as implementation plan until code and tests exist.

## Revision reason
The boundary stack needs a routing control so claims do not drift from reflection into proof, or from private-derived abstraction into public authority.

## Goal
Prevent unauthorized claim migration across artifact types.

## User value
A reader can inspect any public Mirror Cartographer artifact and know:
- what kind of claim it contains,
- what source boundary it came from,
- what it is allowed to prove,
- what it is not allowed to prove,
- what evidence would be needed to upgrade it.

## Non-goals
- Do not expose raw private context.
- Do not convert symbolic reflection into empirical proof.
- Do not claim implementation completion without code evidence.
- Do not treat privacy redaction as sufficient evidence quality.

## Functional requirements
1. Every generated public artifact must include source status, claim status, privacy status, missingness, and revision reason.
2. Every major claim must be assigned a proof lane before publication.
3. Claims with private-derived origins must be either abstracted into method language or blocked.
4. Claims based on external research must not imply the product implements the research unless implementation evidence exists.
5. Claims based on repository commits must distinguish activity from efficacy.
6. Claims based on prompt contracts must distinguish intended behavior from runtime behavior.
7. Claims without adequate evidence must be routed to research question, evaluation criterion, or implementation plan.
8. Any claim reused across artifacts must preserve or lower its authority level unless a new source justifies upgrade.

## UX requirements
- The gate should produce plain-language labels, not only machine-readable metadata.
- The reader should see the boundary without needing to inspect private context.
- Blocked claims should be useful: explain what is missing and what would make the claim admissible.

## Acceptance criteria
- A symbolic claim cannot appear in a public proof packet as empirical evidence without relabeling.
- A private-derived method insight can appear as an abstract requirement without private details.
- A GitHub write can be cited as repository activity but not product effectiveness.
- A missing implementation file produces missingness, not invented implementation status.
- A reviewer can contest each routing decision.

## Key phrase
The route is part of the claim.
