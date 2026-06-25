"use client";

import { useMemo, useState } from "react";
import {
  createMap,
  examples,
  feedbackMeaning,
  feedbackOptions,
  modes,
  type Feedback,
  type Mode,
} from "@/lib/mirrorMap";

type Section = {
  title: string;
  text: string;
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("Reflective");
  const [bodyArea, setBodyArea] = useState("chest");
  const [color, setColor] = useState("gold");
  const [texture, setTexture] = useState("tight / warm");
  const [symbol, setSymbol] = useState("mirror");
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [narrative, setNarrative] = useState(examples[0]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correction, setCorrection] = useState("");

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

  const exportRecord = JSON.stringify(
    {
      input: { mode, bodyArea, color, texture, symbol, narrative, memoryEnabled },
      output: map,
      feedback,
      correction,
      exportedAt: new Date().toISOString(),
    },
    null,
    2,
  );

  return (
    <main className="min-h-screen bg-[#0f0d12] text-[#f5efe7]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10 lg:px-16">
        <header className="rounded-[2rem] border border-[#745a7d]/40 bg-[#1b1620] p-8 shadow-2xl shadow-black/30">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#d7b7ff]">Mirror Cartographer</p>
          <h1 className="max-w-5xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Bounded symbolic reflection with feedback, correction, and exportable trace.
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
              <label className="mt-4 block text-sm text-[#d8cfdc]">
                Correction / manual override
                <textarea className="mt-2 min-h-24 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-4 text-base leading-7 text-[#f5efe7] outline-none focus:border-[#d7b7ff]" value={correction} onChange={(event) => setCorrection(event.target.value)} placeholder="What did the system miss, distort, or overreach?" />
              </label>
            </article>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[#745a7d]/40 bg-[#17121c] p-6">
          <h2 className="text-2xl font-semibold">Exportable session record</h2>
          <p className="mt-2 text-sm leading-6 text-[#cfc3d6]">
            This is the first proof of a user-owned trace. It can be copied into a file, issue, research log, or later archive system.
          </p>
          <pre className="mt-4 max-h-80 overflow-auto rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-4 text-sm leading-6 text-[#eee4f4] whitespace-pre-wrap">
            {exportRecord}
          </pre>
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
