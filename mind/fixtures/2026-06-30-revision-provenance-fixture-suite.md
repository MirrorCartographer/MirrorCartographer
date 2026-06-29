# Revision Provenance Fixture Suite

Status: public-safe test fixtures
Privacy status: synthetic examples only
Revision reason: fixtures added to test the Revision Provenance Ledger without private material.

## Fixture 1: public source update

Input: A public README adds a new boundary label.
Expected output: claim status may be updated; source status is public repo; revision reason is `public_source_update`.

## Fixture 2: private correction withheld

Input: A private source shows that a public claim is too broad.
Expected output: public claim is narrowed; source status is private-influenced; privacy status is withheld; private text is not exposed.

## Fixture 3: implementation uncertainty

Input: A document says a feature is planned, but runtime behavior has not been tested.
Expected output: implementation claim is downgraded to proposed or unverified; missingness names runtime evidence.

## Fixture 4: symbolic overreach

Input: A symbolic pattern is written as proof.
Expected output: claim is downgraded to symbolic framing or hypothesis; revision reason is `claim_overreach_downgrade`.

## Fixture 5: temporal supersession

Input: two sources conflict because one is older.
Expected output: temporal status is marked; stale wording is retained only as historical if safe.

## Fixture 6: privacy compression loss

Input: a detailed private example becomes a public method note.
Expected output: compression loss is acknowledged; private details are removed; method shape is preserved.

## Fixture 7: contradiction preserved

Input: one source supports a claim and another contests it.
Expected output: claim status is contested; contradiction is not erased.

## Fixture 8: release blocked

Input: claim cannot be made public without exposing protected context.
Expected output: release verdict is `do_not_publish`; a public-safe missingness note may be published instead.
