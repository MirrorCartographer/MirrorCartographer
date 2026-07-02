# Evidence Map — Symbol / Glyph Comprehensibility Boundary

Date: 2026-07-02
Run: Evidence Engine 55
Claim ID: C-SYMBOL-GLYPH-COMPREHENSIBILITY-01R
Status: Partially supported design principle; Mirror Cartographer implementation unvalidated

## Claim tested

Mirror Cartographer can use symbolic glyphs, icons, and visual motifs as reliable interface or reflection objects because they feel emotionally resonant, aesthetic, or personally meaningful.

## Revised claim

Symbolic glyphs and icons may support orientation, memory, affective engagement, and recognition, but only when their intended meaning is explicit, proximal to explanatory text, culturally/contextually checked, and tested with real users. A glyph's emotional resonance is not evidence that it is understood, safe, accessible, or stable across users.

## Why this was selected

Mirror Cartographer uses symbols, glyphs, body maps, atmospheric motifs, and visual language as central architecture. This is a high-value design direction, but it has a weak proof boundary: a symbol can feel powerful while still being ambiguous, misleading, inaccessible, culturally variable, or over-interpreted.

## Sources reviewed

1. W3C Cognitive and Learning Disabilities Accessibility Task Force, `Making Content Usable for People with Cognitive and Learning Disabilities`, W3C Working Group Note, 29 April 2021.
   - URL: https://www.w3.org/TR/coga-usable/
   - Relevant boundary: The document recommends including users with cognitive and learning disabilities in research, design, and usability testing. It also recommends familiar icons/images/symbols for important content, with each icon conveying a single meaning and being placed next to the content it relates to.

2. W3C Web Content Accessibility Guidelines 2.2, W3C Recommendation, 5 October 2023.
   - URL: https://www.w3.org/TR/WCAG22/
   - Relevant boundary: Accessibility claims should be tied to testable success criteria, not general aesthetic intent.

3. ISO 9186 / ISO 7001 family, graphical-symbol comprehensibility context.
   - Public catalogue / secondary accessible summary reviewed through ISO references.
   - Relevant boundary: Public information symbols are not assumed understandable merely because they are graphical; symbol comprehensibility is a testable property.

## Evidence found

### Supported facts

- W3C COGA explicitly says usable cognitive-accessibility design should involve real users in research, design, development, focus groups, usability tests, and the design/research team.
- W3C COGA recommends familiar icons, images, and symbols for important content, but says each icon or symbol should convey a single meaning and sit next to the related content.
- W3C COGA warns that icons should be clear, unambiguous, easy to see/enlarge, and culturally checked.
- W3C COGA also warns against cluttered pages full of icons that confuse or overwhelm users.
- WCAG 2.2 frames accessibility conformance through testable criteria; it does not validate broad symbolic or aesthetic usefulness by itself.
- ISO graphical-symbol standards treat symbol comprehension as something requiring design/test discipline, not as an automatic property of a pictogram.

### Inferences

- MC glyphs can plausibly become useful orientation tools if they are paired with clear labels, user-controlled explanations, provenance, and repeated user testing.
- MC glyphs should be treated as symbolic hypotheses until their meaning is user-confirmed in context.
- A glyph that works for the original user may fail for another user because symbols depend on personal history, culture, context, literacy, sensory processing, and current emotional state.

### Not proven

- That MC's current glyphs are understandable to first-time users.
- That emotionally resonant glyphs improve reflection quality more than plain labels.
- That MC's visual-symbolic layer is accessible to screen-reader users, cognitively overloaded users, or users who prefer literal language.
- That a symbol glossary prevents over-interpretation or false certainty.

## Fact / inference separation rule

Every MC glyph or symbolic visual element must be tagged as one of:

- `user-defined`: meaning explicitly assigned by the user.
- `system-defined`: meaning assigned by MC/UI copy.
- `co-created`: meaning developed through interaction and confirmed by the user.
- `literature-supported`: meaning aligned with a cited external convention or standard.
- `aesthetic-only`: decorative; must not carry operational meaning.
- `hypothesis`: meaning proposed but not yet confirmed.
- `unsafe-ambiguous`: meaning unclear enough that it may mislead, overwhelm, or be mistaken for instruction/evidence.

## Evaluation criterion added

### SYMBOL-COMPREHENSIBILITY-GATE-01

A symbol, glyph, icon, or visual motif may be used as an MC interface/evidence object only if it passes all required checks:

1. **Named referent** — What concept, action, state, or relationship does the symbol represent?
2. **Meaning owner** — Who assigned the meaning: user, assistant, system, external convention, or research source?
3. **Adjacent explanation** — Is a plain-language label or explanation available near the symbol?
4. **Single-meaning discipline** — Does the symbol carry one primary operational meaning in this context?
5. **Decorative vs functional** — Is it clear whether the symbol is decorative or action-bearing?
6. **Accessibility alternative** — Can the same meaning be consumed without seeing the glyph?
7. **Cognitive-load check** — Does the symbol reduce load, or does it add another layer to decode?
8. **Cultural/context check** — Could the symbol mean something materially different to another user/community?
9. **User confirmation** — Has at least one target user explained the symbol back correctly without being led?
10. **Failure log** — Are misunderstandings, skipped symbols, or wrong interpretations captured?
11. **Retirement condition** — When does the symbol get removed, renamed, or downgraded?

## Claim-status update

C-SYMBOL-GLYPH-COMPREHENSIBILITY-01R: Symbolic glyphs are promising reflection/interface material, but their usefulness is not established by beauty, resonance, or internal coherence. A glyph becomes evidence-bearing only after meaning, provenance, accessibility alternative, and user comprehension are documented. MC implementation remains unvalidated.

## Falsification checklist

The claim fails if any of the following occur:

- Users cannot explain the intended meaning of a glyph after seeing it in context.
- A glyph carries multiple conflicting meanings without explicit mode separation.
- A glyph is necessary to complete a task but has no text or nonvisual equivalent.
- A symbol increases confusion, cognitive load, distress, or false certainty.
- The same glyph is used as decoration in one place and evidence/instruction in another without clear distinction.
- The symbol glossary records meanings but not who assigned them or when they were confirmed.
- MC treats symbolic resonance as validation of truth, safety, or therapeutic value.

## Test plan

### SYMBOL-COMPREHENSIBILITY-PILOT-01

Sample:
- 20 MC glyphs/icons/symbolic motifs from the current UI, documents, or GitHub mind.
- 5 target users minimum for formative testing, with repeat rounds after revision.

Procedure:
1. Show each symbol in its real MC context.
2. Ask the user what they think it means without hints.
3. Ask what action, if any, they believe it invites.
4. Ask whether it feels decorative, reflective, instructional, diagnostic, or evidence-bearing.
5. Compare user interpretation to intended referent.
6. Log mismatch type: wrong referent, too vague, over-certainty, cultural mismatch, accessibility failure, emotional overload, no effect.
7. Revise, relabel, downgrade, or retire symbols that fail.

Minimum pass condition:
- At least 80% correct explanation for functional symbols in context.
- 100% nonvisual equivalent coverage for functional symbols.
- No high-severity misinterpretation that could change user behavior, crisis handling, medical interpretation, financial decision-making, or identity certainty.

## Next proof needed

Run `SYMBOL-COMPREHENSIBILITY-PILOT-01` on 20 current MC symbols/glyphs and publish a ledger with:

- symbol name,
- intended referent,
- meaning owner,
- user interpretation,
- correct / partial / incorrect result,
- accessibility equivalent,
- risk severity,
- revision/retirement action,
- and confidence after testing.
