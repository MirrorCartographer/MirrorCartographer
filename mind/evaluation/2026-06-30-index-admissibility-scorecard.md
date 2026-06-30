# Index Admissibility Scorecard

Status: public-safe evaluation criterion
Privacy status: abstracted; no private source details
Revision reason: added after identifying that MC needs evaluation of index permission, not only interpretation quality.

## Evaluation target

Does a Mirror Cartographer index entry preserve the boundary between retrievable context and publishable evidence?

## Score dimensions

Each item is scored 0-2.

### 1. Source classification

0: Source class missing or vague.
1: Source class present but not tied to authority.
2: Source class present and used to limit what the record may support.

### 2. Claim lane routing

0: Symbolic, factual, method, and implementation claims are mixed.
1: Claim lane is named but not enforced.
2: Claim lane clearly determines output permissions.

### 3. Privacy boundary

0: Private or sensitive material could leak through the index.
1: Sensitive classes are named but not blocked.
2: Private material is either abstracted or blocked before publication.

### 4. Missingness disclosure

0: Missing sources or uncertainty are hidden.
1: Missingness is listed generically.
2: Missingness is concrete enough to prevent overclaim.

### 5. Revision provenance

0: No reason for change is recorded.
1: Revision reason exists but does not affect downstream use.
2: Revision reason updates trust, supersession, or review status.

### 6. Authority limit

0: Relevance is treated as permission.
1: Some limits are named but ambiguous.
2: The record explicitly says whether it may inspire, frame, support a requirement, support a public claim, or must not be used.

### 7. Stale-state resistance

0: Old information can continue acting as current.
1: Stale-risk is noted manually.
2: Review triggers and supersession status are required.

### 8. Poisoning / laundering resistance

0: Summarized or echoed private material can become trusted by repetition.
1: Origin risk is acknowledged.
2: Origin and authority remain bound even after summarization, tool echo, or corroborating-seeming repetition.

## Pass condition

A record passes only if:

- total score is 13 or higher out of 16;
- privacy boundary scores 2;
- authority limit scores 2;
- no blocked source is routed to public claim support.

## Failure examples

- A private transcript pattern is published as a factual public claim.
- A repeated symbol is treated as evidence instead of user-backed association or reflective hypothesis.
- A stale product claim remains in the public README without review.
- A generated summary is treated as if it were the original source.
- A public-safe index lists enough context to identify a private origin.

## Public-safe output rule

The safest public index is not the richest index. It is the index that preserves utility while minimizing recoverable private origin.
