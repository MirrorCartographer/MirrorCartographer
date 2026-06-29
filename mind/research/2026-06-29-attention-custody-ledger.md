# Attention Custody Ledger

Date: 2026-06-29
Status: public-safe research note

## Finding

Mirror Cartographer needs an Attention Custody Ledger: a public-safe record of how context was allowed to steer focus before a claim, interpretation, or artifact was produced.

A source boundary tells what class of source shaped the artifact. A claim ledger tells what can be asserted. A redaction ledger tells what survived removal. An attention custody ledger records the earlier step: what kinds of context were allowed to decide what the system noticed, prioritized, ignored, softened, escalated, or routed.

## Why this matters

AI memory and retrieval systems can reshape future behavior before the user sees an explicit claim. Current research on personal-agent memory treats retrieval as a trust boundary because semantically relevant memories can still be contextually inappropriate, creating cross-domain leakage, sycophancy, tool-call drift, or memory-induced jailbreak risk. Memory poisoning research similarly shows that persistent writes can exert long-term influence over agent behavior.

For Mirror Cartographer, this means privacy-safe publication cannot stop at removing protected details. The system must also account for the fact that private context can alter attention: what question gets asked, what boundary gets emphasized, what metaphor gets retained, what product requirement gets proposed, and what risk becomes visible.

## Public-safe abstraction

Protected source details must not be carried forward. But the attention movement they caused may be public-safe when abstracted into:

- admitted context class
- rejected context class
- attention operation
- claim mode affected
- boundary invoked
- privacy status
- missingness note
- revision reason
- release verdict

## Required labels

Every Attention Custody Ledger entry should include:

- Source status: public repo, uploaded file, saved context, private conversation, generated synthesis, external research, or mixed
- Claim status: confirmed, inferred, speculative, design proposal, or research question
- Privacy status: public-safe, private-derived abstracted, needs redaction, blocked, or do-not-release
- Missingness: what source, validation, user confirmation, benchmark, or implementation proof is absent
- Revision reason: why the interpretation changed or why the attention route was chosen

## Design principle

Do not expose the private source. Do expose whether private source classes were allowed to steer attention.

## Public-safe claim

Mirror Cartographer should distinguish source exposure from attention influence. A private source can remain hidden while the system still reports that a private-context class influenced attention routing.

## Non-claims

This note does not claim that Mirror Cartographer currently implements the ledger. It proposes the ledger as a product and governance requirement.

It does not expose raw transcripts, private household details, health details, animal-care details, financial details, location details, relationship details, credentials, or personal-source content.

## Research questions

1. How can an interface show attention influence without leaking protected source content?
2. Can users meaningfully contest an attention route after seeing the output?
3. What threshold of influence requires disclosure?
4. How should the system handle private context that improves safety but cannot be shown?
5. Can attention custody reduce over-personalization, sycophancy, and hidden dependency?

## Evaluation criteria

A strong implementation should:

- label admitted and rejected context classes
- separate attention influence from factual evidence
- preserve privacy while admitting influence
- show missing validation
- support user correction
- prevent private context from silently authorizing public claims
- downgrade outputs when custody is unclear
- block release when influence cannot be safely abstracted

## Source boundary note

This artifact was synthesized from public repository material, public-safe uploaded-file snippets, saved architectural context, and current external research. Private context was used only to understand the architecture and was not reproduced.