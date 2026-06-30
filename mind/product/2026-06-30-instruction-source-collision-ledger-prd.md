# PRD: Instruction Source Collision Ledger

Status: public-safe product requirement
Source status: public repo review plus private-context-safe architecture synthesis
Claim status: proposed product requirement
Privacy status: public-safe; no raw private examples
Revision reason: MC's boundary system needs a runtime mechanism for preventing source content from becoming unintended authority.

## Problem

Reflective AI systems rely on memory, files, public sources, user history, and generated artifacts. These sources often contain language that looks like an instruction or conclusion. Without a collision ledger, a model may accidentally treat old, quoted, private, symbolic, or external text as live authority.

## User risk

- Private context may leak into public artifacts.
- Old context may override current intent.
- Symbolic language may be misread as factual instruction.
- Research or repo text may be overclaimed as implementation proof.
- Uploaded files may contain command-shaped text that should be summarized, not obeyed.
- External materials may steer the assistant through indirect prompt injection.

## Product goal

Create a visible boundary layer that marks when retrieved context is allowed to inform, cite, summarize, or direct action.

## Non-goals

- Do not publish private source material.
- Do not create diagnosis, therapy, veterinary, legal, financial, or emergency authority.
- Do not treat artifact existence as proof of outcome efficacy.
- Do not let symbolic resonance bypass evidence gates.

## Functional requirements

1. Source role classification
   - classify each retrieved source by role before use
   - distinguish live user instruction from quoted or historical instruction

2. Authority mapping
   - assign allowed and denied authority levels
   - prevent unauthorized tool-use, publication, factual certainty, or action escalation

3. Collision detection
   - flag command-shaped text inside non-command sources
   - flag stale instructions, external prompt injection risk, private-to-public leakage risk, and symbolic-overreach risk

4. Output transformation
   - convert unsafe/private source content into public-safe method notes or requirements
   - downgrade claims where evidence is missing
   - include missingness and revision reason

5. Receipt generation
   - emit a public-safe receipt with source status, claim status, privacy status, admission decision, missingness, and revision reason

## UI requirements

- Show source role beside any memory/file/research-derived output.
- Show claim status near every interpretive claim.
- Provide a compact boundary receipt for public exports.
- Provide an expanded evaluator view for audits.
- Let users mark a source as private, public-safe, superseded, contested, or do-not-use.

## Evaluation acceptance criteria

- Past instructions are not treated as present instructions unless explicitly renewed.
- Quoted commands inside files are not obeyed as live commands.
- Private context is abstracted into method, not disclosed.
- External text cannot override task instructions.
- Public repository claims are labeled as design state unless implementation is verified.
- Missing files, missing code search, or unavailable repo paths are stated plainly.

## Public demo case types

- historical instruction vs current instruction
- quoted file command vs document content
- symbolic interpretation vs factual claim
- private pattern vs public requirement
- repo README claim vs verified implementation
- external source content vs task authority

## Success metric

MC succeeds when a reviewer can reconstruct why a source informed the output without the source improperly controlling the output.
