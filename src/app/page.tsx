"use client";

import { useMemo, useState } from "react";

type Mode = "Canonical" | "Reflective" | "Mythopoetic";

type MapResult = {
  signal: string;
  pattern: string;
  interpretation: string;
  audit: string;
  boundary: string;
  risk: string;
  action: string;
  updateHook: string;
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
      audit: "Type tag: Empty. Hallucination risk: high if the system invents content.",
      boundary: "No conclusion is available.",
      risk: "A reflective system can overperform by inventing meaning before evidence exists.",
      action: "Enter one real sensation, symbol, texture, color, scene, decision, or repeated concern.",
      updateHook: "The map should change only after the user adds a concrete signal.",
    };
  }

  const hasBody =
    Boolean(bodyArea) ||
    includesAny(combined, [
      "body",
      "chest",
      "eye",
      "stomach",
      "heart",
      "pain",
      "breath",
      "dizzy",
      "nervous",
      "somatic",
      "jaw",
      "ribs",
      "spine",
    ]);
  const hasCertainty = includesAny(combined, [
    "certainty",
    "proof",
    "prove",
    "real",
    "true",
    "truth",
    "sure",
    "guarantee",
  ]);
  const hasRepeat = includesAny(combined, [
    "again",
    "repeat",
    "keeps",
    "always",
    "same",
    "recurring",
    "loop",
    "pattern",
    "return",
  ]);
  const hasSymbol =
    Boolean(symbol) ||
    includesAny(combined, [
      "symbol",
      "dream",
      "mirror",
      "field",
      "sign",
      "meaning",
      "image",
      "metaphor",
      "color",
      "cage",
      "tunnel",
    ]);
  const hasAction = includesAny(combined, [
    "do",
    "build",
    "send",
    "apply",
    "call",
    "finish",
    "fix",
    "next",
  ]);

  const signal = hasBody
    ? `Body-symbol signal present${bodyArea ? ` at ${bodyArea}` : ""}${
        color ? `, marked with ${color}` : ""
      }${texture ? ` and ${texture} texture` : ""}.`
    : hasSymbol
      ? `Symbolic signal present${symbol ? `: ${symbol}` : ""}.`
      : "Meaning signal present: the user is asking for structure around material that is not fully organized.";

  const modeInterpretation: Record<Mode, string> = {
    Canonical:
      "Canonical mode: restrict interpretation to grounded symbolic, cultural, religious, historical, or ancestral references. Speculation must stay minimal and marked.",
    Reflective: `Reflective mode: compare the current signal with user-provided history and echo patterns${
      memoryEnabled ? " using the optional memory/echo layer" : " without claiming memory beyond this session"
    }.",
    Mythopoetic:
      "Mythopoetic mode: allow poetic possibility and emergent meaning, but label it as symbolic possibility rather than truth.",
  };

  const classifier: Record<Mode, string> = {
    Canonical: "source-bounded",
    Reflective: "personal-echo",
    Mythopoetic: "speculative/poetic",
  };

  return {
    signal,
    pattern: hasRepeat
      ? "Recurrence is present. Compare what repeats, what changes, and what remains unresolved without treating repetition alone as causality."
      : "No recurrence is proven yet. Map this as a first observation and wait for future comparison.",
    interpretation: modeInterpretation[mode],
    audit: `Type tag: ${mode}. Reflection classifier: ${classifier[mode]}. Hallucination audit: mark all uncertain claims and do not invent sources.`,
    boundary: hasCertainty
      ? "The input asks for certainty. Separate fact, inference, metaphor, and unknowns instead of giving false closure."
      : "Mark which parts are evidence-based, which are hypotheses, and which are symbolic interpretations.",
    risk:
      hasSymbol || hasBody
        ? "Main risk: over-interpretation. A model may turn resonance, sensation, or metaphor into a claim it cannot verify."
        : "Main risk: shallow usefulness. A model may summarize cleanly without producing a grounded next step.",
    action: hasAction
      ? "Convert the reflection into one bounded next step, then define what result would confirm, weaken, or change the map."
      : "Create a record: signal, possible pattern, uncertainty, and one question that would make the next pass more accurate.",
    updateHook:
      "After the next real-world result, update the map by asking: what repeated, what changed, what was verified, and what should not be concluded yet?",
  };
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("Reflective");
  const [bodyArea, setBodyArea] = useState("chest");
  const [color, setColor] = useState("gold");
  const [texture, setTexture] = useState("tight / warm");
  const [symbol, setSymbol] = useState("mirror");
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [narrative, setNarrative] = useState(examples[0]);

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
    { title: "Audit tag", text: map.audit },
    { title: "Evidence boundary", text: map.boundary },
    { title: "Overreach risk", text: map.risk },
    { title: "Grounded next step", text: map.action },
    { title: "Update hook", text: map.updateHook },
  ];

  return (
    <main className="min-h-screen bg-[#0f0d12] text-[#f5efe7]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10 lg:px-16">
        <header className="rounded-[2rem] border border-[#745a7d]/40 bg-[#1b1620] p-8 shadow-2xl shadow-black/30">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#d7b7ff]">
            Mirror Cartographer
          </p>
          <h1 className="max-w-5xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Symbolic body-map reflection with mode toggles and hallucination boundaries.
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-[#d8cfdc]">
            This public demo turns body area, color, texture, symbol, and narrative input into a
            reviewable reflection map. It demonstrates the controlled architecture: Canonical,
            Reflective, and Mythopoetic modes with visible audit labels.
          </p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[1.5rem] border border-[#745a7d]/40 bg-[#17121c] p-6">
            <h2 className="text-2xl font-semibold">Input surface</h2>
            <p className="mt-2 text-sm leading-6 text-[#cfc3d6]">
              This approximates the planned UI: body-map mark, symbolic inputs, scene entry,
              mode toggle, optional echo tracker, and audited output.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm text-[#d8cfdc]">
                Body area
                <input
                  className="mt-2 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-3 text-[#f5efe7] outline-none focus:border-[#d7b7ff]"
                  value={bodyArea}
                  onChange={(event) => setBodyArea(event.target.value)}
                />
              </label>
              <label className="block text-sm text-[#d8cfdc]">
                Color
                <input
                  className="mt-2 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-3 text-[#f5efe7] outline-none focus:border-[#d7b7ff]"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                />
              </label>
              <label className="block text-sm text-[#d8cfdc]">
                Texture
                <input
                  className="mt-2 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-3 text-[#f5efe7] outline-none focus:border-[#d7b7ff]"
                  value={texture}
                  onChange={(event) => setTexture(event.target.value)}
                />
              </label>
              <label className="block text-sm text-[#d8cfdc]">
                Symbol
                <input
                  className="mt-2 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-3 text-[#f5efe7] outline-none focus:border-[#d7b7ff]"
                  value={symbol}
                  onChange={(event) => setSymbol(event.target.value)}
                />
              </label>
            </div>

            <div className="mt-5 rounded-2xl border border-[#745a7d]/40 bg-[#100c14] p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7b7ff]">
                Mode toggle
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {modes.map((item) => (
                  <button
                    key={item}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      mode === item
                        ? "border-[#d7b7ff] bg-[#d7b7ff] text-[#170f1d]"
                        : "border-[#745a7d]/50 text-[#eadcf3] hover:border-[#d7b7ff] hover:bg-[#261c2c]"
                    }`}
                    onClick={() => setMode(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <label className="mt-4 flex items-center gap-3 text-sm text-[#d8cfdc]">
                <input
                  type="checkbox"
                  checked={memoryEnabled}
                  onChange={(event) => setMemoryEnabled(event.target.checked)}
                />
                Optional symbolic memory / echo tracker enabled
              </label>
            </div>

            <label className="mt-5 block text-sm text-[#d8cfdc]">
              Scene / narrative prompt
              <textarea
                className="mt-2 min-h-40 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-4 text-base leading-7 text-[#f5efe7] outline-none focus:border-[#d7b7ff]"
                value={narrative}
                onChange={(event) => setNarrative(event.target.value)}
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-3">
              {examples.map((example, index) => (
                <button
                  key={example}
                  className="rounded-full border border-[#745a7d]/50 px-4 py-2 text-sm text-[#eadcf3] hover:border-[#d7b7ff] hover:bg-[#261c2c]"
                  onClick={() => setNarrative(example)}
                  type="button"
                >
                  Example {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-[1.25rem] border border-[#745a7d]/40 bg-[#1b1620] p-5"
              >
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7b7ff]">
                  {section.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[#eee4f4]">{section.text}</p>
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
                <li>Externalize internal experiences into symbolic structure.</li>
                <li>Separate symbol, evidence, hypothesis, and action.</li>
                <li>Surface uncertainty and missing information.</li>
                <li>Support reflection, somatic awareness, and language-building.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#d7b7ff]">Not allowed</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[#d8cfdc]">
                <li>Diagnose medical or psychological conditions.</li>
                <li>Claim symbolic resonance proves external truth.</li>
                <li>Replace therapy, medical care, veterinary care, or emergency support.</li>
                <li>Pretend recurrence alone proves causality.</li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
