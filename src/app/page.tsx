"use client";

import { useMemo, useState } from "react";

type MapResult = {
  signal: string;
  pattern: string;
  boundary: string;
  risk: string;
  action: string;
  updateHook: string;
};

const examples = [
  "I keep asking AI the same question because I want certainty, but every answer makes the pattern feel bigger.",
  "My body feels like it knows something before my mind does, but I do not want the system to turn that into a diagnosis.",
  "A symbol keeps showing up in my writing and I want to know what it means without pretending it proves anything.",
];

function includesAny(input: string, words: string[]) {
  const lower = input.toLowerCase();
  return words.some((word) => lower.includes(word));
}

function createMap(input: string): MapResult {
  const clean = input.trim();

  if (!clean) {
    return {
      signal: "No signal entered yet.",
      pattern: "The system needs the user's actual language before mapping.",
      boundary: "No interpretation should be made without input.",
      risk: "A reflective system can overperform by inventing meaning before evidence exists.",
      action: "Enter one real question, symbol, body description, decision, or repeated concern.",
      updateHook: "The map should change only after the user adds a concrete signal.",
    };
  }

  const hasBody = includesAny(clean, ["body", "chest", "eye", "stomach", "heart", "pain", "breath", "dizzy", "nervous", "somatic"]);
  const hasCertainty = includesAny(clean, ["certainty", "proof", "prove", "real", "true", "truth", "sure", "guarantee"]);
  const hasRepeat = includesAny(clean, ["again", "repeat", "keeps", "always", "same", "recurring", "loop", "pattern"]);
  const hasSymbol = includesAny(clean, ["symbol", "dream", "mirror", "field", "sign", "meaning", "image", "metaphor", "color"]);
  const hasAction = includesAny(clean, ["do", "build", "send", "apply", "call", "finish", "fix", "next"]);

  return {
    signal: hasBody
      ? "The input carries a body-linked signal: the user is describing experience through sensation, pressure, or physical awareness."
      : hasSymbol
      ? "The input carries a symbolic signal: the user is trying to preserve meaning that may not fit literal language."
      : "The input carries a meaning signal: the user is asking for structure around something that feels important but not fully organized.",
    pattern: hasRepeat
      ? "Recurrence is present. The system should compare what repeats, what changes, and what remains unresolved without claiming causality from repetition alone."
      : "No recurrence is proven yet. The system can map this as a first observation and wait for future comparison.",
    boundary: hasCertainty
      ? "The input asks for certainty. The response should separate fact, inference, metaphor, and unknowns instead of giving false closure."
      : "The response should mark which parts are evidence-based, which are hypotheses, and which are symbolic interpretations.",
    risk: hasSymbol || hasBody
      ? "Main risk: over-interpretation. A model may turn resonance, sensation, or metaphor into a claim it cannot verify."
      : "Main risk: shallow usefulness. A model may summarize cleanly without producing a grounded next step.",
    action: hasAction
      ? "Convert the reflection into one bounded next step, then define what result would confirm, weaken, or change the map."
      : "Create a record: signal, possible pattern, uncertainty, and one question that would make the next pass more accurate.",
    updateHook: "After the next real-world result, update the map by asking: what repeated, what changed, what was verified, and what should not be concluded yet?",
  };
}

export default function Home() {
  const [input, setInput] = useState(examples[0]);
  const map = useMemo(() => createMap(input), [input]);

  const sections = [
    ["Signal summary", map.signal],
    ["Pattern map", map.pattern],
    ["Evidence boundary", map.boundary],
    ["Overreach risk", map.risk],
    ["Grounded next step", map.action],
    ["Update hook", map.updateHook],
  ];

  return (
    <main className="min-h-screen bg-[#0f0d12] text-[#f5efe7]">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 lg:px-16">
        <header className="rounded-[2rem] border border-[#745a7d]/40 bg-[#1b1620] p-8 shadow-2xl shadow-black/30">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#d7b7ff]">Mirror Cartographer</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            A bounded demo for reflective human-AI interaction.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#d8cfdc]">
            This prototype maps a user signal into six reviewable layers: signal summary, pattern map, evidence boundary, overreach risk, grounded next step, and update hook.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.5rem] border border-[#745a7d]/40 bg-[#17121c] p-6">
            <h2 className="text-2xl font-semibold">Input</h2>
            <p className="mt-2 text-sm leading-6 text-[#cfc3d6]">
              Enter a messy concern, repeated question, symbol, body-language description, or decision point. The demo is intentionally local and bounded; it does not diagnose, prescribe, or prove symbolic claims.
            </p>
            <textarea
              className="mt-5 min-h-44 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-4 text-base leading-7 text-[#f5efe7] outline-none ring-0 focus:border-[#d7b7ff]"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <div className="mt-4 flex flex-wrap gap-3">
              {examples.map((example, index) => (
                <button
                  key={example}
                  className="rounded-full border border-[#745a7d]/50 px-4 py-2 text-sm text-[#eadcf3] hover:border-[#d7b7ff] hover:bg-[#261c2c]"
                  onClick={() => setInput(example)}
                  type="button"
                >
                  Example {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {sections.map(([title, text]) => (
              <article key={title} className="rounded-[1.25rem] border border-[#745a7d]/40 bg-[#1b1620] p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7b7ff]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#eee4f4]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[#745a7d]/40 bg-[#17121c] p-6">
          <h2 className="text-2xl font-semibold">Claim boundary</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-[#d7b7ff]">Allowed</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[#d8cfdc]">
                <li>Structure reflection.</li>
                <li>Separate symbol, evidence, hypothesis, and action.</li>
                <li>Surface uncertainty and missing information.</li>
                <li>Produce a grounded next step.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#d7b7ff]">Not allowed</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[#d8cfdc]">
                <li>Diagnose medical or psychological conditions.</li>
                <li>Claim symbolic resonance proves truth.</li>
                <li>Replace professional care.</li>
                <li>Pretend recurrence alone proves causality.</li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
