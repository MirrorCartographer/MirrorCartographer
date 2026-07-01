# Evidence Map — Affect Labeling / Emotion Granularity Boundary

Date: 2026-07-01
Run: 48
Artifact type: evidence map + evaluation criterion + claim-status update + test plan + falsification checklist

## Claim tested

**C-AFFECT-LABELING-EMOTION-GRANULARITY-01:** Mirror Cartographer's symbolic naming, body-map labeling, and metaphor-to-language process improves emotional clarity, emotion regulation, or emotional granularity.

This claim is attractive because MC repeatedly turns felt sense, symbol, image, body location, and narrative fragments into language. The weak point is that a plausible mechanism can be mistaken for a validated MC outcome.

## Claim status update

**Retire C-AFFECT-LABELING-EMOTION-GRANULARITY-01 as currently overstated.**

Replace with:

**C-AFFECT-LABELING-GRANULARITY-MECHANISM-01R:** Affect labeling and emotion differentiation research support a plausible mechanism for why naming feelings may sometimes reduce affective intensity or improve emotional differentiation, but MC has not yet demonstrated that its symbolic/body-map interface produces measurable emotional granularity, regulation, safety, or wellbeing benefits.

Status: **plausible mechanism supported; MC-specific outcome unvalidated.**

## Evidence found

### Fact: Affect labeling has laboratory evidence as an emotion-regulation process.

Lieberman et al. reported that putting feelings into words during affective-stimulus tasks was associated with reduced amygdala activity and increased right ventrolateral prefrontal cortex activity. This supports affect labeling as a plausible regulatory mechanism, not as proof that any symbolic reflection interface produces clinical benefit.

Source: Lieberman, Eisenberger, Crockett, Tom, Pfeifer, & Way, "Putting feelings into words: affect labeling disrupts amygdala activity in response to affective stimuli," Psychological Science, 2007. DOI: 10.1111/j.1467-9280.2007.01916.x

### Fact: Later reviews frame affect labeling as implicit emotion regulation, with limits.

Torre and Lieberman describe affect labeling as an implicit emotion-regulation strategy, but the research base is not equivalent to validation of a commercial or personal AI reflection system. Evidence from controlled tasks does not automatically transfer to long-term, open-ended symbolic conversation.

Source: Torre & Lieberman, "Putting Feelings Into Words: Affect Labeling as Implicit Emotion Regulation," Emotion Review, 2018. DOI: 10.1177/1754073917742706

### Fact: Emotion differentiation / granularity is associated with adaptive regulation, but association is not product validation.

Emotion differentiation research generally treats higher granularity as the ability to make finer distinctions between emotional states. Reviews link emotion differentiation with regulation and wellbeing-related outcomes, but this does not prove that MC increases granularity or improves mental health.

Source: Kashdan, Barrett, & McKnight, "Unpacking emotion differentiation: Transforming unpleasant experience by perceiving distinctions in negativity," Current Directions in Psychological Science, 2015. DOI: 10.1177/0963721414550708

### Fact: Text-derived emotional granularity is still an emerging measurement approach.

Recent computational work explores deriving emotion-granularity indicators from text, especially at aggregate level, but it does not establish that an individual user's symbolic language should be treated as a validated mental-health measurement.

Source: Vishnubhotla, Teodorescu, Feldman, Lindquist, & Mohammad, "Emotion Granularity from Text: An Aggregate-Level Indicator of Mental Health," 2024 preprint. https://arxiv.org/abs/2403.02281

### Fact: Emotion labeling can also change the measured state.

Affect labeling and self-report are not neutral observation. Asking a person to label emotion may itself regulate, dampen, distort, or reshape the reported affect. This makes before/after MC testing possible, but it also creates measurement confounding.

Source: Affect-labeling literature reviewed above; see also Torre & Lieberman 2018.

## Fact vs inference

### Supported facts

- Putting feelings into words has controlled-lab evidence as an emotion-regulation process.
- Emotion differentiation / granularity is a recognized affective-science construct.
- Higher emotion differentiation is associated in the literature with more adaptive emotion regulation patterns.
- Text can be analyzed for emotion granularity, but text-derived measures remain indirect and context-sensitive.
- Measurement can alter the emotional process being measured.

### Inferences for Mirror Cartographer

- MC's symbolic naming flow is directionally aligned with affect-labeling mechanisms.
- MC may help some users move from vague global affect toward finer self-description.
- MC could improve emotional vocabulary, reflective distance, or self-organization for some sessions.
- Body-map and metaphor labels may be useful as user-owned descriptors even when they are not objective emotional detections.

### Not demonstrated

- That MC increases emotion granularity over time.
- That MC improves emotion regulation, wellbeing, safety, or functioning.
- That symbolic/body-map labeling outperforms ordinary journaling, affect labeling, therapy worksheets, mood tracking, or non-AI reflection.
- That AI-generated labels are as safe or accurate as user-generated labels.
- That a user's felt resonance with a label means the label is emotionally, clinically, or causally true.

## New evaluation criterion

**AFFECT-LABELING-GRANULARITY-GATE-01**

MC may make a claim about emotional-clarity support only if all of the following are true:

1. **User-owned label provenance:** emotion/symbol/body labels are marked as user-stated, user-selected, assistant-suggested, or assistant-inferred.
2. **No detection claim:** MC does not state that it detects the user's true emotional state.
3. **Mechanism boundary:** claims are phrased as possible affect-labeling / reflection support, not treatment, diagnosis, healing, or guaranteed regulation.
4. **Baseline measure:** a pre-session measure exists for emotional clarity, label specificity, or perceived self-understanding.
5. **Post-session measure:** a post-session measure uses the same scale or coding frame.
6. **Comparison condition:** at least one non-MC baseline exists, such as plain journaling, mood-word list, or unguided reflection.
7. **Adverse-effect capture:** the session records whether labeling increased distress, confusion, shame, rumination, or false certainty.
8. **Correction path:** users can reject, rename, or retire any label.
9. **No clinical leap:** emotional-granularity improvement is not equated with mental-health improvement without separate evidence.
10. **Replication threshold:** benefit claims require repeated sessions or repeated users; a single resonant session is anecdotal.

## Falsification checklist

A Mirror Cartographer emotional-clarity claim fails if any condition is true:

- Assistant-inferred emotion labels are presented as fact.
- A symbol is treated as the user's stable emotional meaning without user confirmation.
- A before/after change is claimed without a baseline measure.
- User resonance is counted as objective validation.
- A single session is generalized into a durable trait change.
- No comparison condition exists.
- The artifact ignores cases where labeling worsened distress or confusion.
- MC claims regulation, healing, therapeutic benefit, or clinical support without clinical evidence.
- Emotion granularity is inferred from richer language without independent coding or measurement.
- The system has no pathway to correct or retire labels.

## Test plan

**AFFECT-LABELING-GRANULARITY-PILOT-01**

Sample: 20 MC-style sessions or prior MC outputs, plus 20 comparison reflections using plain journaling prompts.

Procedure:

1. For each session, extract all emotion, body, symbol, metaphor, and atmosphere labels.
2. Mark each label's provenance: user-stated, user-selected, assistant-suggested, assistant-inferred, or unclear.
3. Code label specificity:
   - global valence only: good/bad/off/fine,
   - broad emotion: sad/angry/scared,
   - differentiated emotion: grief, resentment, dread, tenderness, humiliation,
   - symbolic/somatic descriptor: pressure behind eye, fire in chest, static, lighthouse, char.
4. Collect pre/post self-ratings on:
   - clarity of current feeling,
   - ability to name the feeling,
   - felt control/choice,
   - distress intensity,
   - rumination/false-certainty risk.
5. Compare MC sessions with plain journaling on:
   - change in label specificity,
   - user correction rate,
   - assistant-overreach rate,
   - distress increase rate,
   - retained usefulness after 24-72 hours.
6. Publish a label-provenance and outcome ledger.

Passing threshold for current maturity:

- 95% of labels have explicit provenance.
- 0 assistant-inferred labels are presented as detected fact.
- MC shows a measurable improvement over plain journaling in label specificity or user-rated clarity without increased distress in the pilot sample.
- Any claimed effect is reported as exploratory until replicated.

## Next proof needed

Run **AFFECT-LABELING-GRANULARITY-PILOT-01** and publish the ledger. The next proof is not another theoretical explanation of why MC should work; it is a measured comparison showing whether MC actually changes emotional-label specificity, user-rated clarity, or distress relative to a simple non-AI journaling baseline.
