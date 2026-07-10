import Link from "next/link";

const principles = [
  "dead ends become compost",
  "the site learns from public interaction capsules",
  "meaning may connect; evidence stays in its lane",
  "the browser never receives the GitHub token",
];

const paths = [
  { href: "/generative", title: "Generative rebuild chamber", text: "A public page that rebuilds its own grammar and records safe interaction capsules when Cloudflare is configured." },
  { href: "/api/interactions", title: "Interaction ingest", text: "Cloudflare-only endpoint that can commit public behavioral capsules back to GitHub." },
  { href: "https://github.com/MirrorCartographer/MirrorCartographer", title: "Repository", text: "The public source and memory substrate for this side of Mirror Cartographer." },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05050b] text-[#fff8ef]">
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-5 py-6 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,226,191,.22),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(145,216,255,.16),transparent_34%),linear-gradient(135deg,#05050b,#09091a_48%,#03030a)]" />
        <div className="pointer-events-none absolute left-[8%] top-[18%] h-[52vh] w-[84%] rotate-[-8deg] rounded-[999px] border border-white/10 shadow-[inset_0_0_90px_rgba(255,255,255,.05),0_0_120px_rgba(145,216,255,.14)]" />

        <header className="relative z-10 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.28em] text-[#ffe2bf]/60">
          <span>Mirror Cartographer</span>
          <span>public organism</span>
        </header>

        <section className="relative z-10 grid gap-8 py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <article>
            <p className="mb-5 text-sm uppercase tracking-[0.32em] text-[#91d8ff]/70">Cloudflare / GitHub learning side</p>
            <h1 className="max-w-5xl font-serif text-[clamp(4rem,13vw,12rem)] font-medium leading-[.78] tracking-[-.1em]">
              A website that rebuilds itself.
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#fff8ef]/72 md:text-2xl md:leading-9">
              This public side is for the generative direction: dead ends, abstractions, interaction capsules, and a reviewed path from user behavior back into the repository.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-full border border-[#ffe2bf]/30 bg-[#ffe2bf]/12 px-5 py-3 text-sm text-[#fff8ef] shadow-[0_0_40px_rgba(255,226,191,.10)] hover:bg-[#ffe2bf]/20" href="/generative">
                enter generative chamber
              </Link>
              <a className="rounded-full border border-white/15 bg-white/[.06] px-5 py-3 text-sm text-[#fff8ef]/75 hover:bg-white/[.10]" href="https://github.com/MirrorCartographer/MirrorCartographer">
                view repository
              </a>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-white/12 bg-white/[.045] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#c4b5fd]/70">current loop</p>
            <ol className="mt-5 grid gap-4 text-sm leading-6 text-[#fff8ef]/72">
              <li><b className="text-[#ffe2bf]">1.</b> visitor enters /generative</li>
              <li><b className="text-[#ffe2bf]">2.</b> page rebuilds its grammar</li>
              <li><b className="text-[#ffe2bf]">3.</b> interaction capsule goes to Cloudflare</li>
              <li><b className="text-[#ffe2bf]">4.</b> Cloudflare commits safe JSON to GitHub</li>
              <li><b className="text-[#ffe2bf]">5.</b> future cycles learn from the public record</li>
            </ol>
          </aside>
        </section>

        <section className="relative z-10 grid gap-4 pb-8 md:grid-cols-2 xl:grid-cols-4">
          {principles.map((item) => (
            <article key={item} className="min-h-32 rounded-[1.5rem] border border-white/10 bg-white/[.045] p-4 text-sm leading-6 text-[#fff8ef]/68">
              {item}
            </article>
          ))}
        </section>

        <section className="relative z-10 grid gap-4 pb-6 md:grid-cols-3">
          {paths.map((item) => (
            item.href.startsWith("http") ? (
              <a key={item.href} className="rounded-[1.5rem] border border-white/10 bg-[#0c0c18] p-5 hover:border-[#ffe2bf]/30" href={item.href}>
                <h2 className="font-serif text-3xl tracking-[-.05em]">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#fff8ef]/58">{item.text}</p>
              </a>
            ) : (
              <Link key={item.href} className="rounded-[1.5rem] border border-white/10 bg-[#0c0c18] p-5 hover:border-[#ffe2bf]/30" href={item.href}>
                <h2 className="font-serif text-3xl tracking-[-.05em]">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#fff8ef]/58">{item.text}</p>
              </Link>
            )
          ))}
        </section>
      </section>
    </main>
  );
}
