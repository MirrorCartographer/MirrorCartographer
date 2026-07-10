"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DeadEnd = {
  name: string;
  lesson: string;
  metabolizedInto: string;
};

type Grammar = {
  seed: number;
  title: string;
  thesis: string;
  weather: string;
  layout: string;
  motion: string;
  organ: string;
  contradiction: string;
  density: number;
  tilt: number;
};

type InteractionEvent = "manual-rebuild" | "dead-end-selected";

const deadEnds: DeadEnd[] = [
  {
    name: "beautiful wallpaper",
    lesson: "a pleasant surface is not a reason to stay",
    metabolizedInto: "narrative gravity",
  },
  {
    name: "explaining the system",
    lesson: "too many words turn the organism back into a brochure",
    metabolizedInto: "felt proof",
  },
  {
    name: "feature chasing",
    lesson: "more parts do not create aliveness",
    metabolizedInto: "fewer stronger loops",
  },
  {
    name: "mystical overreach",
    lesson: "symbolic resonance is not evidence",
    metabolizedInto: "separate proof lanes",
  },
  {
    name: "deployment theater",
    lesson: "a commit is not a working site",
    metabolizedInto: "runtime gates",
  },
  {
    name: "tap as interaction",
    lesson: "the tap is only permission; the real input is feeling",
    metabolizedInto: "atmospheric response",
  },
];

const abstractions = [
  "user feels, not user taps",
  "website as instrument",
  "archive as landscape",
  "memory as weather",
  "tests as lie detector",
  "GitHub as external nervous system",
  "public doorway / private organism",
  "dead ends as compost",
  "meaning connects; evidence stays domain-specific",
  "the site remembers how it became itself",
  "not app, protocol",
  "re-enchantment layer",
  "living place, not page",
  "future note as intention",
  "past note as survival",
  "first-reading engine",
  "branch as alternate timeline",
  "deployment as proof threshold",
  "beauty is not enough",
  "feeling is not directly measured; it is invited",
  "private raw archive / public capsule",
  "composition before explanation",
  "machine that tells us when we are full of shit",
  "aliveness-first design",
  "return visits reveal recurrence",
  "context switch as new inference",
  "symbol survives into gesture",
  "non-boring world filter",
  "browser as stage",
  "weather API as sky nerve",
  "proof lane controller",
  "recursive symbolic field protocol",
];

const weather = ["murmur", "aurora", "wind", "dawn", "rain", "lightning", "clear", "cloud"];
const organs = ["atlas", "heart", "gate", "thread", "weather", "mirror", "mouth", "comet", "root", "choir"];
const motions = ["spiral", "drift", "pulse", "flicker", "braid", "tilt", "bloom", "collapse", "orbit", "return"];
const layouts = ["constellation", "fault line", "organ map", "weather score", "ritual console", "broken arcade", "field notebook"];
const sessionKey = "mc-generative-session-v1";

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: T[], next: () => number): T {
  return items[Math.floor(next() * items.length) % items.length];
}

function makeGrammar(seed: number): Grammar {
  const next = mulberry32(seed);
  const a = pick(abstractions, next);
  const b = pick(abstractions, next);
  return {
    seed,
    title: `${pick(organs, next)} / ${pick(motions, next)} / ${pick(weather, next)}`,
    thesis: `${a} becomes ${b}`,
    weather: pick(weather, next),
    layout: pick(layouts, next),
    motion: pick(motions, next),
    organ: pick(organs, next),
    contradiction: `${pick(deadEnds, next).name} → ${pick(deadEnds, next).metabolizedInto}`,
    density: 0.32 + next() * 0.68,
    tilt: -14 + next() * 28,
  };
}

function getSessionId() {
  try {
    const existing = window.localStorage.getItem(sessionKey);
    if (existing) return existing;
    const created = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    window.localStorage.setItem(sessionKey, created);
    return created;
  } catch {
    return "storage-blocked";
  }
}

function sendInteraction(eventType: InteractionEvent, generation: number, grammar: Grammar, selectedDeadEnd: DeadEnd) {
  const payload = {
    eventType,
    generation,
    grammar,
    selectedDeadEnd,
    sessionId: getSessionId(),
    clientTime: new Date().toISOString(),
    path: window.location.pathname,
  };
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon("/api/interactions", new Blob([body], { type: "application/json" }));
    if (sent) return;
  }

  void fetch("/api/interactions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export default function GenerativePage() {
  const [generation, setGeneration] = useState(1);
  const [history, setHistory] = useState<Grammar[]>([]);
  const [selected, setSelected] = useState<DeadEnd>(deadEnds[0]);
  const timer = useRef<number | null>(null);

  const grammar = useMemo(() => makeGrammar(7309 + generation * 97), [generation]);

  useEffect(() => {
    setHistory((items) => [grammar, ...items].slice(0, 9));
  }, [grammar]);

  useEffect(() => {
    timer.current = window.setInterval(() => {
      setGeneration((value) => value + 1);
    }, 9000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  const nodes = useMemo(() => {
    const next = mulberry32(grammar.seed + 404);
    return Array.from({ length: 34 }, (_, index) => ({
      id: index,
      x: 8 + next() * 84,
      y: 12 + next() * 76,
      s: 0.45 + next() * 1.9,
      d: next() * 9,
      a: 0.16 + next() * 0.7,
    }));
  }, [grammar]);

  const handleRebuild = () => {
    setGeneration((value) => {
      const nextGeneration = value + 1;
      sendInteraction("manual-rebuild", nextGeneration, makeGrammar(7309 + nextGeneration * 97), selected);
      return nextGeneration;
    });
  };

  const handleSelect = (item: DeadEnd) => {
    setSelected(item);
    sendInteraction("dead-end-selected", generation, grammar, item);
  };

  return (
    <main className="shell" data-weather={grammar.weather}>
      <style>{css}</style>
      <section className="hero" style={{ "--tilt": `${grammar.tilt}deg`, "--density": grammar.density } as React.CSSProperties}>
        <div className="sky" aria-hidden="true">
          {nodes.map((node) => (
            <i
              key={`${grammar.seed}-${node.id}`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${node.s}rem`,
                height: `${node.s}rem`,
                opacity: node.a,
                animationDelay: `${node.d}s`,
              }}
            />
          ))}
        </div>
        <div className="spine" aria-hidden="true" />
        <article className="card primary">
          <p className="kicker">public rebuild chamber</p>
          <h1>{grammar.title}</h1>
          <p className="thesis">{grammar.thesis}</p>
          <button onClick={handleRebuild}>rebuild now</button>
        </article>
        <article className="card grammar">
          <p>generation {generation}</p>
          <p>{grammar.layout}</p>
          <p>{grammar.motion}</p>
          <p>{grammar.organ}</p>
          <p>{grammar.contradiction}</p>
        </article>
      </section>

      <section className="grid">
        <article className="panel dead">
          <h2>dead ends</h2>
          <div className="deadList">
            {deadEnds.map((item) => (
              <button key={item.name} onClick={() => handleSelect(item)} className={selected.name === item.name ? "active" : ""}>
                {item.name}
              </button>
            ))}
          </div>
          <div className="selected">
            <p>{selected.lesson}</p>
            <strong>{selected.metabolizedInto}</strong>
          </div>
        </article>

        <article className="panel count">
          <h2>{abstractions.length}</h2>
          <p>working abstractions in this public seed</p>
          <div className="cloud">
            {abstractions.slice(0, 18).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>

        <article className="panel history">
          <h2>site rebuilding itself</h2>
          <ol>
            {history.map((item) => (
              <li key={item.seed}>
                <b>{item.title}</b>
                <span>{item.thesis}</span>
              </li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}

const css = `
:root{color-scheme:dark}*{box-sizing:border-box}html,body{margin:0;background:#05050b;color:#fff8ef}body{overflow-x:hidden}.shell{min-height:100vh;padding:18px;background:radial-gradient(circle at 20% 0%,rgba(255,226,191,.16),transparent 34%),radial-gradient(circle at 80% 18%,rgba(145,216,255,.13),transparent 38%),linear-gradient(135deg,#05050b,#09091a 48%,#03030a);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}.hero{position:relative;min-height:72vh;border:1px solid rgba(255,255,255,.14);border-radius:34px;overflow:hidden;background:linear-gradient(calc(120deg + var(--tilt)),rgba(255,226,191,.08),rgba(145,216,255,.06),rgba(196,181,253,.08));box-shadow:0 30px 120px rgba(0,0,0,.48)}.sky{position:absolute;inset:0;filter:blur(.2px)}.sky i{position:absolute;border-radius:999px;background:rgba(255,248,239,.72);box-shadow:0 0 24px rgba(255,226,191,.55),0 0 80px rgba(145,216,255,.18);animation:float 12s ease-in-out infinite alternate}.spine{position:absolute;inset:8%;border:1px solid rgba(255,255,255,.09);border-radius:999px;transform:rotate(var(--tilt));box-shadow:inset 0 0 80px rgba(255,255,255,.04),0 0 calc(70px * var(--density)) rgba(145,216,255,.18)}.card{position:absolute;border:1px solid rgba(255,255,255,.14);background:rgba(5,5,11,.54);backdrop-filter:blur(20px);border-radius:28px;padding:18px;box-shadow:0 20px 80px rgba(0,0,0,.35)}.primary{left:18px;right:18px;bottom:18px;max-width:760px}.grammar{right:18px;top:18px;max-width:310px;color:rgba(255,248,239,.68)}.kicker{margin:0 0 10px;text-transform:uppercase;letter-spacing:.22em;font-size:11px;color:rgba(255,226,191,.62)}h1{margin:0;font-family:ui-serif,Georgia,Cambria,Times New Roman,serif;font-size:clamp(44px,12vw,132px);line-height:.84;letter-spacing:-.09em;font-weight:500}.thesis{max-width:58ch;font-size:clamp(15px,3vw,22px);line-height:1.35;color:rgba(255,248,239,.76)}button{appearance:none;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,248,239,.08);color:#fff8ef;padding:10px 14px;font:inherit;cursor:pointer}button:hover,.active{background:rgba(255,226,191,.18);box-shadow:0 0 30px rgba(255,226,191,.12)}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:14px}.panel{min-height:260px;border:1px solid rgba(255,255,255,.12);border-radius:28px;background:rgba(255,255,255,.045);padding:18px}.panel h2{margin:0 0 14px;font-family:ui-serif,Georgia,Cambria,Times New Roman,serif;font-size:clamp(28px,6vw,72px);line-height:.9;letter-spacing:-.05em}.deadList{display:flex;flex-wrap:wrap;gap:8px}.selected{margin-top:18px;color:rgba(255,248,239,.72);line-height:1.45}.selected strong{display:block;margin-top:8px;color:#ffe2bf}.count h2{font-size:92px}.cloud{display:flex;flex-wrap:wrap;gap:8px}.cloud span{border:1px solid rgba(255,255,255,.11);border-radius:999px;padding:7px 9px;color:rgba(255,248,239,.62);font-size:12px}.history ol{display:grid;gap:10px;margin:0;padding:0;list-style:none}.history li{display:grid;gap:4px;border-left:1px solid rgba(255,226,191,.22);padding-left:12px}.history span{color:rgba(255,248,239,.56);font-size:12px;line-height:1.35}@keyframes float{from{transform:translate3d(-12px,10px,0) scale(.86)}to{transform:translate3d(18px,-22px,0) scale(1.15)}}@media(max-width:860px){.hero{min-height:78vh}.grammar{display:none}.grid{grid-template-columns:1fr}.primary{left:12px;right:12px;bottom:12px}.panel{min-height:auto}}`;