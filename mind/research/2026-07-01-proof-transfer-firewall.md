# MC Proof-Transfer Firewall

Source status: synthesized from available Mirror Cartographer architecture files, implementation notes, and public-safe repository research context. Private-context material was used only to understand architectural intent, not as publishable evidence.

Claim status: design method / implementation requirement / evaluation proposal. Not a clinical, legal, financial, diagnostic, or empirical performance claim.

Privacy status: public-safe abstraction. This note contains no raw transcript detail, personal household detail, health or animal-care detail, financial detail, location detail, relationship detail, private credential, or private lived-event example.

Missingness: no full raw archive was available in this run; no live user study data; no measured benchmark; no deployment audit; no independent privacy review; no complete repository-wide code inspection because code search indexing was unavailable for the public repo.

Revision reason: automation research pass adding a sharper boundary layer after prior notes on runtime-native metadata and meaning integrity.

---

## Finding

Mirror Cartographer needs a **Proof-Transfer Firewall**.

The system can connect meanings across many lanes, but it must not let evidence from one lane become proof in another lane without explicit translation, source labeling, and claim downgrade.

This is the practical rule:

> Meaning may cross lanes. Proof may not cross lanes without revalidation.

---

## Why this matters

Mirror Cartographer handles symbolic, emotional, somatic, aesthetic, narrative, technical, and research material in the same reflective workspace.

That power creates a specific failure mode: a pattern may feel coherent across lanes, and the system may accidentally treat that coherence as factual support.

Examples of lane categories without private details:

- symbolic reflection lane
- user-confirmed memory lane
- source-grounded research lane
- product requirement lane
- code implementation lane
- safety boundary lane
- evaluation result lane
- public communication lane

A connection between lanes can be useful for orientation. It is not automatically evidence.

---

## Firewall rule

Every output claim should pass through three checks:

1. **Lane of origin**
   - Where did this claim begin?
   - Symbolic reflection, user statement, public source, code artifact, measurement, inference, or speculation?

2. **Lane of use**
   - Where is the claim being used now?
   - Reflection, requirements, marketing, safety policy, implementation, evaluation, or factual report?

3. **Transfer permission**
   - Can the claim keep its strength in the new lane?
   - If not, downgrade it to hypothesis, design rationale, question, or metaphor.

---

## Claim downgrade table

| Origin lane | Target lane | Required transformation |
|---|---|---|
| Symbolic reflection | Product requirement | Convert to user-need hypothesis; require repeated support or explicit design rationale. |
| Symbolic reflection | Factual report | Not allowed as proof; can only become a research question or interpretive note. |
| User-confirmed memory | Public artifact | Abstract into method; remove private particulars. |
| Public research | Personal reflection | Present as external context, not personal diagnosis or destiny. |
| Code artifact | Product claim | Verify current deployment behavior before claiming it exists for users. |
| Evaluation result | Marketing copy | Preserve metric, scope, date, and limitation; do not generalize beyond test conditions. |
| Design speculation | Roadmap | Label as proposed, not built. |

---

## Product requirement

Add a claim-routing object to durable MC artifacts.

Required fields:

- `claim_text`
- `origin_lane`
- `target_lane`
- `source_status`
- `claim_status`
- `privacy_status`
- `missingness`
- `revision_reason`
- `transfer_allowed`
- `required_downgrade`
- `public_safe_version`

---

## Evaluation criteria

An MC artifact passes the Proof-Transfer Firewall when:

1. A reader can tell whether each meaningful claim is symbolic, inferred, source-grounded, measured, or speculative.
2. Private material is not needed to understand the public artifact.
3. No medical, diagnostic, legal, financial, identity, or safety claim is supported only by metaphor or emotional coherence.
4. Product claims distinguish built, designed, planned, inferred, and imagined capability.
5. Public writing preserves the method without exposing the private source that inspired it.
6. Missing evidence is explicitly named instead of hidden behind confident language.

---

## Research questions

- What is the smallest claim metadata schema that users will actually tolerate reading?
- Can MC visually show proof boundaries without making the interface feel bureaucratic?
- Can resonance feedback be stored separately from evidence confidence?
- Can the same artifact support three views: human-readable, audit-readable, and machine-checkable?
- What downgrade rules should be automatic versus user-controlled?

---

## Implementation plan

1. Create a `claim_boundary` schema module.
2. Add boundary metadata to reflection cards and exported artifacts.
3. Add a visible label stack: source, claim strength, privacy state, missingness.
4. Add a pre-publication sanitizer that converts private-origin material into public-safe method language.
5. Add a test fixture where symbolic claims are intentionally routed toward factual claims and must be blocked or downgraded.
6. Add repository index pages that separate public methods, private-derived abstractions, implementation plans, and empirical results.

---

## Operating line

**Mirror Cartographer can connect the map. It must not let the map impersonate the territory.**
