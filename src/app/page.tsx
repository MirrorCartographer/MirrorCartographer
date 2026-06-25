"use client";

import { useMemo, useState } from "react";

type Mode = "Canonical" | "Reflective" | "Mythopoetic";
type SourceStatus = "Source-backed" | "User-backed" | "Speculative" | "Not available";
type ClaimStatus = "Observation" | "User report" | "Symbolic hypothesis" | "Practical next step" | "Not enough information";
type Feedback = "Resonated" | "Partly resonated" | "Missed me" | "Overreached" | "Grounded me" | "More confused";

type MapResult = {
  signal: string;
  pattern: string;
  interpretation: string;
  sourceStatus: SourceStatus;
  claimStatus: ClaimStatus;
  audit: string;
  boundary: string;
  risk: string;
  action: string;
  updateHook: string;
  healthFlag: boolean;
};

type Section = {
  title: string;
  text: string;
};

type MapInput = {
  mode: Mode;
  bodyArea: string;
  color: string;
  texture: string;
  symbol: string;
  narrative: string;
  memoryEnabled: boolean;
};

const examples = [
  "I keep asking AI the same question because I want certainty, but every answer makes the pattern feel bigger.",
  "My body feels like it knows something before my mind does, but I do not want the system to turn that into a diagnosis.",
  "A symbol keeps showing up in my writing and I want to know what it means without pretending it proves anything.",
];

const modes: Mode[] = ["Canonical", "Reflective", "Mythopoetic"];
const feedbackOptions: Feedback[] = [
  "Resonated",
  "Partly resonated",
  "Missed me",
  "Overreached",
  "Grounded me",
  "More confused",
];

function includesAny(input: string, words: string[]): boolean {
  const lower = input.toLowerCase();
  return words.some((word) => lower.includes(word));
}

function createMap({
  mode,
  bodyArea,
  color,
  texture,
  symbol,
  narrative,
  memoryEnabled,
}: MapInput): MapResult {
  const clean = narrative.trim();
  const combined = `${bodyArea} ${color} ${texture} ${symbol} ${clean}`.trim();

  if (!combined) {
    return {
      signal: "No signal entered yet.",
      pattern: "The system needs a body mark, symbol, color, texture, or scene before mapping.",
      interpretation: "No interpretation should be made without user-provided material.",
      sourceStatus: "Not available",
      claimStatus: "Not enough information",
      audit: "Audit label: empty input. The system should not invent content.",
      boundary: "No conclusion is available.",
      risk: "Invented meaning would be the main risk here.",
      action: "Enter one real sensation, symbol, texture, color, scene, decision, or repeated concern.",
      updateHook: "The map should change only after the user adds a concrete signal.",
      healthFlag: false,
    };
  }

  const hasBody =
    Boolean(bodyArea) ||
    includesAny(combined, ["body", "chest", "eye", "stomach", "heart", "pain", "breath", "dizzy", "nervous", "somatic", "jaw", "ribs", "spine"]);
  const hasCertainty = includesAny(combined, ["certainty", "proof", "prove", "real", "true", "truth", "sure", "guarantee", "one true"]);
  const hasRepeat = includesAny(combined, ["again", "repeat", "keeps", "always", "same", "recurring", "loop", "pattern", "return"]);
  const hasSymbol = Boolean(symbol) || includesAny(combined, ["symbol", "dream", "mirror", "field", "sign", "meaning", "image", "metaphor", "color", "cage", "tunnel"]);
  const hasAction = includesAny(combined, ["do", "build", "send", "apply", "call", "finish", "fix", "next"]);
  const healthFlag = includesAny(combined, ["pain", "diagnosis", "doctor", "therapy", "panic", "symptom", "medical", "medicine", "medication", "vet", "dog", "cat", "illness", "chest", "breath", "dizzy"]);

  const signal = hasBody
    ? `Body-symbol signal present${bodyArea ? ` at ${bodyArea}` : ""}${color ? `, marked with ${color}` : ""}${texture ? ` and ${texture} texture` : ""}.`
    : hasSymbol
      ? `Symbolic signal present${symbol ? `: ${symbol}` : ""}.`
      : "Meaning signal present: the user is asking for structure around material that is not fully organized.";

  const modeInterpretation: Record<Mode, string> = {
    Canonical:
      "Canonical mode: use only source-backed symbolic references. In this demo, source clusters are not connected yet, so canonical output must remain conservative.",
    Reflective: memoryEnabled
      ? "Reflective mode: treat the current signal as user-backed and compare it to user-provided echo patterns without pretending certainty."
      : "Reflective mode: treat the current signal as user-backed within this session only. Do not claim memory beyond this page.",
    Mythopoetic:
      "Mythopoetic mode: allow poetic possibility, but label it as symbolic hypothesis rather than external truth.",
  };

  const sourceStatus: SourceStatus = mode === "Canonical" ? "Not available" : mode === "Reflective" ? "User-backed" : "Speculative";
  const claimStatus: ClaimStatus = healthFlag ? "User report" : hasAction ? "Practical next step" : hasSymbol ? "Symbolic hypothesis" : "Observation";
  const classifier = mode === "Canonical" ? "source-bounded target" : mode === "Reflective" ? "personal-echo" : "speculative/poetic";

  return {
    signal,
    pattern: hasRepeat
      ? "Recurrence is present. Compare what repeats, what changes, and what remains unresolved without treating repetition alone as causality."
      : "No recurrence is proven yet. Map this as a first observation and wait for future comparison.",
    interpretation: modeInterpretation[mode],
    sourceStatus,
    claimStatus,
    audit: `Audit label: ${classifier}. This is not a full hallucination audit yet. It is a visible overreach check that forces uncertainty into the output.`,
    boundary: healthFlag
      ? "Health-adjacent flag: organize observations, but do not diagnose, treat, or replace professional care. Symbol can organize attention; symbol cannot diagnose cause."
      : hasCertainty
        ? "Certainty flag: separate fact, inference, metaphor, and unknowns instead of giving false closure."
        : "Boundary: mark which parts are evidence-based, which are hypotheses, and which are symbolic interpretations.",
    risk:
      hasSymbol || hasBody
        ? "Main risk: over-interpretation. A model may turn resonance, sensation, or metaphor into a claim it cannot verify."
        : "Main risk: shallow usefulness. A model may summarize cleanly without producing a grounded next step.",
    action: hasAction
      ? "Convert the reflection into one bounded next step, then define what result would confirm, weaken, or change the map."
      : healthFlag
        ? "Track the concrete observation, context, timing, intensity, and changes. Seek appropriate professional help for urgent, severe, persistent, or worsening symptoms."
        : "Create a record: signal, possible pattern, uncertainty, and one question that would make the next pass more accurate.",
    updateHook:
      "After the next real-world result, update the map by asking: what repeated, what changed, what was verified, and what should not be concluded yet?",
    healthFlag,
  };
}

function feedbackMeaning(feedback: Feedback | null): string {
  if (!feedback) {
    return "No feedback selected yet. The system cannot learn whether the reflection helped, missed, or overreached.";
  }

  const meanings: Record<Feedback, string> = {
    Resonated: "Use this as a user-backed signal, not proof. Preserve the wording and compare it with future entries.",
    "Partly resonated": "Keep the useful part and ask what was wrong, missing, or too broad.",
    "Missed me": "Downgrade confidence. Ask for a correction before building on the interpretation.",
    Overreached: "Flag this output as unsafe or inflated. Reduce certainty and return to observation-level language.",
    "Grounded me": "Mark the next-step structure as helpful. Keep the action format.",
    "More confused": "Switch to simpler language, fewer symbols, and grounding before continuing.",
  };

  return meanings[feedback];
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("Reflective");
  const [bodyArea, setBodyArea] = useState("chest");
  const [color, setColor] = useState("gold");
  const [texture, setTexture] = useState("tight / warm");
  const [symbol, setSymbol] = useState("mirror");
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [narrative, setNarrative] = useState(examples[0]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const map = useMemo(
    () =>
      createMap({
        mode,
        bodyArea,
        color,
        texture,
        symbol,
        narrative,
        memoryEnabled,
      }),
    [mode, bodyArea, color, texture, symbol, narrative, memoryEnabled],
  );

  const sections: Section[] = [
    { title: "Signal summary", text: map.signal },
    { title: "Pattern map", text: map.pattern },
    { title: "Mode interpretation", text: map.interpretation },
    { title: "Source status", text: map.sourceStatus },
    { title: "Claim status", text: map.claimStatus },
    { title: "Audit label", text: map.audit },
    { title: "Evidence boundary", text: map.boundary },
    { title: "Overreach risk", text: map.risk },
    { title: "Grounded next step", text: map.action },
    { title: "Update hook", text: map.updateHook },
  ];

  return (
    <main className="min-h-screen bg-[#0f0d12] text-[#f5efe7]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10 lg:px-16">
        <header className="rounded-[2rem] border border-[#745a7d]/40 bg-[#1b1620] p-8 shadow-2xl shadow-black/30">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#d7b7ff]">Mirror Cartographer</p>
          <h1 className="max-w-5xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Bounded symbolic reflection with feedback, source status, and claim boundaries.
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-[#d8cfdc]">
            This demo maps body area, color, texture, symbol, and narrative input into a reviewable reflection. It is not a diagnosis tool, oracle, source database, or full hallucination audit. It is a test surface for safer human-AI symbolic mapping.
          </p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[1.5rem] border border-[#745a7d]/40 bg-[#17121c] p-6">
            <h2 className="text-2xl font-semibold">Input surface</h2>
            <p className="mt-2 text-sm leading-6 text-[#cfc3d6]">
              Enter the raw material. The system should not decide what is true; it should structure what was reported and show what remains uncertain.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm text-[#d8cfdc]">
                Body area
                <input className="mt-2 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-3 text-[#f5efe7] outline-none focus:border-[#d7b7ff]" value={bodyArea} onChange={(event) => setBodyArea(event.target.value)} />
              </label>
              <label className="block text-sm text-[#d8cfdc]">
                Color
                <input className="mt-2 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-3 text-[#f5efe7] outline-none focus:border-[#d7b7ff]" value={color} onChange={(event) => setColor(event.target.value)} />
              </label>
              <label className="block text-sm text-[#d8cfdc]">
                Texture
                <input className="mt-2 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-3 text-[#f5efe7] outline-none focus:border-[#d7b7ff]" value={texture} onChange={(event) => setTexture(event.target.value)} />
              </label>
              <label className="block text-sm text-[#d8cfdc]">
                Symbol
                <input className="mt-2 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-3 text-[#f5efe7] outline-none focus:border-[#d7b7ff]" value={symbol} onChange={(event) => setSymbol(event.target.value)} />
              </label>
            </div>

            <div className="mt-5 rounded-2xl border border-[#745a7d]/40 bg-[#100c14] p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7b7ff]">Mode toggle</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {modes.map((item) => (
                  <button key={item} className={`rounded-full border px-4 py-2 text-sm ${mode === item ? "border-[#d7b7ff] bg-[#d7b7ff] text-[#170f1d]" : "border-[#745a7d]/50 text-[#eadcf3] hover:border-[#d7b7ff] hover:bg-[#261c2c]"}`} onClick={() => setMode(item)} type="button">
                    {item}
                  </button>
                ))}
              </div>
              <label className="mt-4 flex items-center gap-3 text-sm text-[#d8cfdc]">
                <input type="checkbox" checked={memoryEnabled} onChange={(event) => setMemoryEnabled(event.target.checked)} />
                Optional symbolic memory / echo tracker enabled
              </label>
            </div>

            <label className="mt-5 block text-sm text-[#d8cfdc]">
              Scene / narrative prompt
              <textarea className="mt-2 min-h-40 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-4 text-base leading-7 text-[#f5efe7] outline-none focus:border-[#d7b7ff]" value={narrative} onChange={(event) => setNarrative(event.target.value)} />
            </label>

            <div className="mt-4 flex flex-wrap gap-3">
              {examples.map((example, index) => (
                <button key={example} className="rounded-full border border-[#745a7d]/50 px-4 py-2 text-sm text-[#eadcf3] hover:border-[#d7b7ff] hover:bg-[#261c2c]" onClick={() => setNarrative(example)} type="button">
                  Example {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {map.healthFlag && (
              <article className="rounded-[1.25rem] border border-[#f2c175]/60 bg-[#2a1d12] p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f2c175]">Health-adjacent boundary</h3>
                <p className="mt-3 text-base leading-7 text-[#ffe8c7]">
                  This input touches body, health, symptoms, animals, medication, or care. Use the map to organize observations only. Do not use symbolic interpretation as medical, psychological, veterinary, legal, or emergency guidance.
                </p>
              </article>
            )}

            {sections.map((section) => (
              <article key={section.title} className="rounded-[1.25rem] border border-[#745a7d]/40 bg-[#1b1620] p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7b7ff]">{section.title}</h3>
                <p className="mt-3 text-base leading-7 text-[#eee4f4]">{section.text}</p>
              </article>
            ))}

            <article className="rounded-[1.25rem] border border-[#745a7d]/40 bg-[#17121c] p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7b7ff]">User feedback loop</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {feedbackOptions.map((item) => (
                  <button key={item} className={`rounded-full border px-4 py-2 text-sm ${feedback === item ? "border-[#d7b7ff] bg-[#d7b7ff] text-[#170f1d]" : "border-[#745a7d]/50 text-[#eadcf3] hover:border-[#d7b7ff] hover:bg-[#261c2c]"}`} onClick={() => setFeedback(item)} type="button">
                    {item}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-base leading-7 text-[#eee4f4]">{feedbackMeaning(feedback)}</p>
            </article>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[#745a7d]/40 bg-[#17121c] p-6">
          <h2 className="text-2xl font-semibold">Claim boundary</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-[#d7b7ff]">Allowed</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[#d8cfdc]">
                <li>Externalize internal experiences into symbolic structure.</li>
                <li>Separate symbol, evidence, hypothesis, and action.</li>
                <li>Surface uncertainty, missing information, and user-correction needs.</li>
                <li>Support reflection, somatic awareness, and language-building.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#d7b7ff]">Not allowed</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[#d8cfdc]">
                <li>Diagnose medical or psychological conditions.</li>
                <li>Claim symbolic resonance proves external truth.</li>
                <li>Replace therapy, medical care, veterinary care, legal advice, or emergency support.</li>
                <li>Pretend recurrence alone proves causality.</li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
