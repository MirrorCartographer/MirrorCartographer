# Abstraction Survivability Record v0

Status: public-safe schema

## Purpose

A compact record for deciding whether a private-context-derived Mirror Cartographer finding may become public method.

## Required fields

- record_id: stable identifier
- title: public-safe title
- date_created: ISO date
- source_status: public_repo / file_library_partial / saved_context_private / raw_transcript_unavailable / external_research / mixed
- claim_status: supported / hypothesis / implementation_proposal / research_question / rejected
- privacy_status: public_safe / needs_revision / quarantine / reject
- missingness: short list of unavailable or partial source conditions
- revision_reason: why this record exists or changed
- private_source_used_for_architecture: yes / no
- private_detail_exposed: none / low / medium / high
- abstraction_type: method / schema / evaluation / product_requirement / research_question / index / implementation_plan
- release_reason: why the abstraction is useful publicly
- redaction_reason: what was intentionally omitted
- survivability_result: pass / revise / quarantine / reject
- reviewer_notes: optional

## Pass conditions

A record can pass only when:

1. private_detail_exposed is none or low;
2. privacy_status is public_safe;
3. claim_status is not overstated;
4. missingness is explicit;
5. release_reason identifies a reusable public method;
6. redaction_reason identifies what was withheld;
7. survivability_result is pass.

## Automatic quarantine triggers

- names or identifying details not already intentionally public in the repo;
- household composition;
- health, animal-care, financial, location, relationship, credential, or raw transcript details;
- claims that imply diagnosis, treatment, legal authority, financial advice, or factual certainty from symbolic recurrence;
- any source text that cannot be meaningfully transformed into method without exposing private context.

## Minimal YAML example

record_id: ast-2026-06-30-001
title: Abstraction Survivability Test
source_status: mixed
claim_status: implementation_proposal
privacy_status: public_safe
missingness:
  - no full raw transcript source available
  - repository code search unavailable
revision_reason: adds release-quality gate after prior boundary records
private_source_used_for_architecture: yes
private_detail_exposed: none
abstraction_type: method
release_reason: gives reviewers a reusable privacy-safe publication test
redaction_reason: removes all private source examples and keeps only the rule
survivability_result: pass
