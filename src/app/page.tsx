import Link from "next/link";

const lanes = [
  { mark: "01", title: "The Archive", tag: "Continuity / memory", text: "Conversations, files, decisions, symbols and unfinished paths become a navigable map instead of disconnected fragments.", href: "https://github.com/MirrorCartographer/MirrorCartographer/tree/main/architecture" },
  { mark: "02", title: "The Mirror", tag: "Reflection / body", text: "A symbolic reflection system for mapping felt experience through language, color, shape and metaphor—without pretending a symbol is a diagnosis.", href: "https://mirrorcartographer.github.io/mirror-cartographer-ui/" },
  { mark: "03", title: "Animal Signals", tag: "Care / advocacy", text: "A continuity approach for symptoms, medication reactions, records, veterinary questions and next steps. Keep private records private.", href: "https://github.com/MirrorCartographer/MirrorCartographer/tree/main" },
  { mark: "04", title: "The Evidence Room", tag: "Research / reality", text: "Separate sourced facts, working hypotheses, symbolic readings, unknowns and experiments. Keep uncertainty visible.", href: "https://github.com/MirrorCartographer/MirrorCartographer/tree/main/tools" },
  { mark: "05", title: "The Art House", tag: "Music / image / film", text: "The creative world: linguistic art, visual identity, animation, sound, symbols, strange rooms and the meaning carried between them.", href: "https://github.com/MirrorCartographer/MirrorCartographer/tree/main/Creative_Universe" },
  { mark: "06", title: "The Workshop", tag: "Code / experiments", text: "Working prototypes, public demonstrations, browser experiments, interaction tests and the tools built around the limits we encounter.", href: "https://github.com/MirrorCartographer/mirror-cartographer-ui" },
  { mark: "07", title: "The Commons", tag: "Public proof / people", text: "Project 101, conversation parallax and public-safe demonstrations: show the work, make claims reviewable, preserve disagreement.", href: "https://github.com/MirrorCartographer/MirrorCartographer/tree/main/demonstrations" },
  { mark: "08", title: "The Future Room", tag: "Value / agency", text: "Turn continuity work into practical value: archive recovery, research maps, symbolic systems, useful packets, collaboration and support.", href: "https://ko-fi.com/mirrorcartographer" },
];

const principles = [
  ["Keep the connections", "A file is not the whole story. Preserve why it exists, what it connects to, what changed, and what remains unfinished."],
  ["Separate meaning from proof", "Symbolic resonance can be useful without being evidence. Facts, inference, uncertainty and imagination each get their own lane."],
  ["Protect the private", "Public architecture and reviewed demonstrations belong on the site. Raw conversations and sensitive health, animal or financial records do not."],
  ["Make it usable", "The goal is not a prettier explanation. The goal is a route from scattered material to understanding, choice and a next action."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07080c] text-[#f4eee3] selection:bg-[#c9b88b] selection:text-[#111]">
      <div className="pointer-events-none fixed inset-0 opacity-70" aria-hidden="true">
        <div className="absolute -left-24 top-20 h-[38rem] w-[38rem] rounded-full bg-emerald-950/35 blur-[120px]" />
        <div className="absolute right-[-10rem] top-[28rem] h-[34rem] w-[34rem] rounded-full bg-violet-950/30 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Mirror Cartographer home">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-[#d7c69a]/50 text-xl text-[#e4d5a8] shadow-[0_0_32px_rgba(215,198,154,.14)]">✳</span>
            <span><span className="block text-sm uppercase tracking-[.22em]">Mirror Cartographer</span><span className="mt-1 block text-[10px] uppercase tracking-[.25em] text-white/40">a continuity atlas by Charity Sturgell</span></span>
          </Link>
          <nav className="hidden items-center gap-6 text-xs text-white/60 md:flex">
            <a href="#atlas" className="hover:text-white">Explore</a><a href="#method" className="hover:text-white">Method</a><a href="#work" className="hover:text-white">The work</a>
            <a href="https://github.com/MirrorCartographer/MirrorCartographer" className="rounded-full border border-white/15 px-4 py-2 text-white/80 hover:border-[#d7c69a]/60">Open source ↗</a>
          </nav>
        </header>

        <section className="grid min-h-[78vh] items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[.32em] text-[#cbbb8e]"><span className="h-px w-10 bg-[#cbbb8e]/70" />A living archive of meaning</p>
            <h1 className="max-w-4xl font-serif text-[clamp(3.5rem,9vw,8.8rem)] leading-[.86] tracking-[-.065em]">What if the information survived, <i className="font-normal text-[#cbbb8e]">but the understanding did not?</i></h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 md:text-xl md:leading-9">Mirror Cartographer is an evolving human–AI project for connecting the things that usually get separated: conversations, art, symbols, records, research, code, lived experience and the ideas that keep returning.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#atlas" className="rounded-full bg-[#d8c99d] px-6 py-3 text-sm font-medium text-[#14130f] transition hover:bg-[#eee2bc]">Enter the atlas ↓</a>
              <a href="https://github.com/MirrorCartographer/MirrorCartographer/tree/main/demonstrations" className="rounded-full border border-white/15 px-6 py-3 text-sm text-white/80 transition hover:border-white/40">See public demonstrations ↗</a>
            </div>
            <p className="mt-8 text-xs leading-6 text-white/35">Not a finished monument. A working map: experiments, evidence, art, tools and paths still being built.</p>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[34rem]" aria-label="Abstract orbital map">
            <div className="absolute inset-[4%] rounded-full border border-[#d8c99d]/20" />
            <div className="absolute inset-[14%] rounded-full border border-white/10" />
            <div className="absolute inset-[25%] rounded-full border border-emerald-200/20 shadow-[0_0_90px_rgba(67,111,87,.12)]" />
            <div className="absolute inset-[36%] rounded-full border border-violet-200/20" />
            <div className="absolute left-[7%] top-[25%] h-2 w-2 rounded-full bg-[#d8c99d] shadow-[0_0_22px_#d8c99d]" />
            <div className="absolute right-[15%] top-[18%] h-1.5 w-1.5 rounded-full bg-sky-200 shadow-[0_0_18px_#bae6fd]" />
            <div className="absolute bottom-[16%] left-[27%] h-2 w-2 rounded-full bg-emerald-200 shadow-[0_0_24px_#a7f3d0]" />
            <div className="absolute bottom-[30%] right-[7%] h-1.5 w-1.5 rounded-full bg-violet-200 shadow-[0_0_18px_#ddd6fe]" />
            <div className="absolute inset-0 grid place-items-center"><div className="relative grid aspect-square w-[45%] place-items-center rounded-full border border-[#d8c99d]/45 bg-[#d8c99d]/[.035] shadow-[inset_0_0_60px_rgba(216,201,157,.07),0_0_100px_rgba(216,201,157,.08)]"><div className="absolute inset-[12%] rounded-full border border-white/10" /><span className="font-serif text-7xl text-[#e2d5ad]">✳</span><span className="absolute -bottom-8 text-[9px] uppercase tracking-[.35em] text-white/40">fragments → relations</span></div></div>
            <span className="absolute left-[4%] top-[49%] text-[9px] uppercase tracking-[.25em] text-white/35">memory</span><span className="absolute right-[0%] top-[49%] text-[9px] uppercase tracking-[.25em] text-white/35">meaning</span><span className="absolute left-[42%] top-[2%] text-[9px] uppercase tracking-[.25em] text-white/35">evidence</span><span className="absolute bottom-[2%] left-[43%] text-[9px] uppercase tracking-[.25em] text-white/35">experience</span>
          </div>
        </section>

        <section id="atlas" className="scroll-mt-8 py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[10px] uppercase tracking-[.3em] text-[#cbbb8e]">Navigate by room</p><h2 className="mt-3 font-serif text-4xl tracking-tight md:text-6xl">One world. Many entrances.</h2></div><p className="max-w-md text-sm leading-6 text-white/45">Each room is a different lens on the same larger effort: make what matters findable, connected and useful.</p></div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {lanes.map((lane) => <a key={lane.mark} href={lane.href} className="group flex min-h-[18rem] flex-col rounded-2xl border border-white/10 bg-white/[.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#cbbb8e]/40 hover:bg-white/[.045]"><div className="flex items-center justify-between"><span className="font-mono text-xs text-[#cbbb8e]/80">{lane.mark}</span><span className="text-white/25 transition group-hover:translate-x-1 group-hover:text-[#cbbb8e]">↗</span></div><p className="mt-8 text-[9px] uppercase tracking-[.22em] text-white/35">{lane.tag}</p><h3 className="mt-2 font-serif text-3xl tracking-tight">{lane.title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{lane.text}</p></a>)}
          </div>
        </section>

        <section id="method" className="grid gap-12 border-y border-white/10 py-16 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="text-[10px] uppercase tracking-[.3em] text-[#cbbb8e]">The operating principles</p><h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight md:text-5xl">Meaning can connect. Evidence stays in its lane.</h2><p className="mt-5 max-w-md text-sm leading-7 text-white/50">This is a creative and research-oriented interface—not an oracle, diagnostic authority or replacement for professional care. Its credibility depends on making its limits visible.</p></div>
          <div className="grid gap-0 sm:grid-cols-2">{principles.map(([title,text],i)=><article key={title} className="border-t border-white/10 py-5 sm:px-5"><span className="font-mono text-[10px] text-[#cbbb8e]">0{i+1}</span><h3 className="mt-3 text-lg">{title}</h3><p className="mt-2 text-sm leading-6 text-white/50">{text}</p></article>)}</div>
        </section>

        <section id="work" className="py-16">
          <p className="text-[10px] uppercase tracking-[.3em] text-[#cbbb8e]">Built, not just imagined</p><h2 className="mt-4 font-serif text-4xl tracking-tight md:text-6xl">Follow the work back to its source.</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <a className="rounded-2xl border border-white/10 p-6 transition hover:border-[#cbbb8e]/40" href="https://github.com/MirrorCartographer/MirrorCartographer"><span className="text-xs text-white/35">SOURCE / ARCHITECTURE</span><h3 className="mt-4 font-serif text-2xl">Mirror Cartographer</h3><p className="mt-3 text-sm leading-6 text-white/50">Continuity atlas, research protocols, evidence gates, demonstrations and the system's public foundations.</p><span className="mt-6 inline-block text-sm text-[#d8c99d]">Open repository ↗</span></a>
            <a className="rounded-2xl border border-white/10 p-6 transition hover:border-[#cbbb8e]/40" href="https://github.com/MirrorCartographer/mirror-cartographer-ui"><span className="text-xs text-white/35">INTERACTIVE / EXPERIMENTAL</span><h3 className="mt-4 font-serif text-2xl">Rooms & prototypes</h3><p className="mt-3 text-sm leading-6 text-white/50">The React/Vite experience, movement-and-weather interactions, sound experiments and interface prototypes.</p><span className="mt-6 inline-block text-sm text-[#d8c99d]">Open UI repository ↗</span></a>
            <a className="rounded-2xl border border-white/10 p-6 transition hover:border-[#cbbb8e]/40" href="https://ko-fi.com/mirrorcartographer"><span className="text-xs text-white/35">SUPPORT / COLLABORATION</span><h3 className="mt-4 font-serif text-2xl">Help it become real</h3><p className="mt-3 text-sm leading-6 text-white/50">Support continuity work, creative research, public demos, practical tools and future rooms.</p><span className="mt-6 inline-block text-sm text-[#d8c99d]">Support the project ↗</span></a>
          </div>
        </section>

        <footer className="flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row"><span>Mirror Cartographer · Created by Charity Sturgell</span><span>Keep the fragments. Recover the relations. Leave room for revision.</span><a className="text-white/55 hover:text-white" href="https://github.com/MirrorCartographer/MirrorCartographer">Source ↗</a></footer>
      </div>
    </main>
  );
}
