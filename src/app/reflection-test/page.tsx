"use client";

import { useState } from "react";

type ReflectResult = {
  ok?: boolean;
  spoken_summary?: string;
  structured_reflection?: string;
  tags?: string[];
  continuation_prompt?: string;
  proof_log?: Record<string, unknown>;
  error?: string;
};

export default function ReflectionTestPage() {
  const [text, setText] = useState("fire in my chest");
  const [mode, setMode] = useState("reflective");
  const [result, setResult] = useState<ReflectResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function runReflection() {
    setLoading(true);
    setResult(null);

    const response = await fetch("/api/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        mode,
        accessibility_mode: "voice_safe",
        consent: {
          symbolic_interpretation: true,
          save_session: false
        }
      })
    });

    const data = await response.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: 24, fontFamily: "system-ui" }}>
      <h1>Mirror Cartographer Reflection Test</h1>
      <p>
        This test page runs the first bounded reflection loop. It is symbolic, not diagnostic.
      </p>

      <label>
        Input
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={4}
          style={{ width: "100%", display: "block", marginTop: 8 }}
        />
      </label>

      <label style={{ display: "block", marginTop: 16 }}>
        Mode
        <select value={mode} onChange={(event) => setMode(event.target.value)} style={{ marginLeft: 8 }}>
          <option value="canonical">Canonical</option>
          <option value="reflective">Reflective</option>
          <option value="mythopoetic">Mythopoetic</option>
        </select>
      </label>

      <button onClick={runReflection} disabled={loading} style={{ marginTop: 16 }}>
        {loading ? "Reflecting..." : "Run reflection"}
      </button>

      {result && (
        <section style={{ marginTop: 24, border: "1px solid #ccc", borderRadius: 12, padding: 16 }}>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <h2>Spoken summary</h2>
              <p>{result.spoken_summary}</p>

              <h2>Structured reflection</h2>
              <p>{result.structured_reflection}</p>

              <h2>Next prompt</h2>
              <p>{result.continuation_prompt}</p>

              <h2>Tags</h2>
              <p>{result.tags?.join(", ")}</p>
            </>
          )}
        </section>
      )}
    </main>
  );
}
