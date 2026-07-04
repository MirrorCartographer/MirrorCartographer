"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";

type StoredArtifact = {
  id: string;
  name: string;
  filename: string;
  path: string;
  rawUrl: string;
  size: number;
  sha?: string;
  uploadedAt: string | null;
  source: "github";
};

type LocalArtifact = Omit<StoredArtifact, "path" | "source"> & {
  path: string;
  source: "local";
};

type DisplayArtifact = StoredArtifact | LocalArtifact;

type ArchivePayload = {
  configured: boolean;
  artifacts: StoredArtifact[];
  error?: string;
};

type UploadPayload = {
  configured: boolean;
  artifact?: StoredArtifact;
  error?: string;
};

export default function HtmlArchivePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const [artifacts, setArtifacts] = useState<StoredArtifact[]>([]);
  const [localArtifacts, setLocalArtifacts] = useState<LocalArtifact[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Loading public HTML archive...");
  const [storageConfigured, setStorageConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [sourceText, setSourceText] = useState("");

  useEffect(() => {
    void loadArchive();
  }, []);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const displayArtifacts = useMemo(() => [...localArtifacts, ...artifacts], [localArtifacts, artifacts]);

  const filteredArtifacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return displayArtifacts;
    return displayArtifacts.filter((artifact) =>
      [artifact.name, artifact.filename, artifact.path].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [displayArtifacts, query]);

  const selectedArtifact = useMemo(() => {
    return filteredArtifacts.find((artifact) => artifact.id === selectedId) || filteredArtifacts[0] || null;
  }, [filteredArtifacts, selectedId]);

  useEffect(() => {
    if (!selectedId && displayArtifacts.length > 0) {
      setSelectedId(displayArtifacts[0].id);
    }
  }, [displayArtifacts, selectedId]);

  useEffect(() => {
    if (!selectedArtifact) {
      setSourceText("");
      return;
    }

    let cancelled = false;
    setSourceText("Loading source...");

    fetch(selectedArtifact.rawUrl, { cache: "no-store" })
      .then(async (response) => {
        const text = await response.text();
        if (!cancelled) {
          setSourceText(text);
        }
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setSourceText(`Could not read source: ${error.message}`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedArtifact]);

  async function loadArchive() {
    setLoading(true);
    try {
      const response = await fetch("/api/html-artifacts", { cache: "no-store" });
      const payload = (await response.json()) as ArchivePayload;
      setStorageConfigured(payload.configured);
      setArtifacts(payload.artifacts || []);

      if (payload.configured) {
        setStatus(payload.artifacts.length > 0 ? "Public HTML archive loaded." : "Public HTML archive is empty. Drop an HTML file to add the first artifact.");
      } else {
        setStatus(payload.error || "Public storage is not configured yet. Dragged files can still be previewed locally in this browser.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load the public HTML archive.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFiles(files: FileList | File[]) {
    const htmlFiles = Array.from(files).filter((file) => /\.html?$/i.test(file.name));

    if (htmlFiles.length === 0) {
      setStatus("No .html or .htm files found in that drop.");
      return;
    }

    setUploading(true);
    for (const file of htmlFiles) {
      await previewAndUpload(file);
    }
    setUploading(false);
  }

  async function previewAndUpload(file: File) {
    const objectUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(objectUrl);

    const localArtifact: LocalArtifact = {
      id: `local-${crypto.randomUUID()}`,
      name: file.name.replace(/\.html?$/i, ""),
      filename: file.name,
      path: `local://${file.name}`,
      rawUrl: objectUrl,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      source: "local",
    };

    setLocalArtifacts((current) => [localArtifact, ...current]);
    setSelectedId(localArtifact.id);
    setStatus(`Previewing ${file.name} locally. Attempting public archive save...`);

    const form = new FormData();
    form.append("file", file);

    try {
      const response = await fetch("/api/html-artifacts", {
        method: "POST",
        body: form,
      });
      const payload = (await response.json()) as UploadPayload;

      if (!response.ok || !payload.artifact) {
        setStatus(payload.error || "Local preview is active, but public save failed.");
        return;
      }

      setArtifacts((current) => [payload.artifact as StoredArtifact, ...current.filter((artifact) => artifact.path !== payload.artifact?.path)]);
      setLocalArtifacts((current) => current.filter((artifact) => artifact.id !== localArtifact.id));
      setSelectedId(payload.artifact.id);
      setStorageConfigured(true);
      setStatus(`Saved to public archive: ${payload.artifact.filename}`);
      URL.revokeObjectURL(objectUrl);
      objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== objectUrl);
    } catch (error) {
      setStatus(error instanceof Error ? `Local preview is active, but public save failed: ${error.message}` : "Local preview is active, but public save failed.");
    }
  }

  function onFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      void handleFiles(event.target.files);
      event.target.value = "";
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    void handleFiles(event.dataTransfer.files);
  }

  const archiveCount = artifacts.length;
  const localCount = localArtifacts.length;

  return (
    <main className="min-h-screen bg-[#0f0d12] text-[#f5efe7]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 md:px-10 lg:px-16">
        <header className="rounded-[2rem] border border-[#745a7d]/40 bg-[#1b1620] p-7 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#d7b7ff]">Mirror Cartographer HTML archive</p>
              <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                Store, inspect, and run one HTML artifact at a time.
              </h1>
              <p className="mt-5 max-w-4xl text-base leading-7 text-[#d8cfdc]">
                Drop an HTML file to preview it immediately. When public storage is configured, the same file is committed into the archive and becomes selectable from this page. Archived files stay inert until selected.
              </p>
            </div>
            <a className="rounded-full border border-[#745a7d]/60 px-4 py-2 text-sm text-[#eadcf3] hover:border-[#d7b7ff] hover:bg-[#261c2c]" href="/">
              Reflection map
            </a>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.35fr]">
          <aside className="flex flex-col gap-5">
            <div
              className={`rounded-[1.5rem] border p-6 transition ${dragActive ? "border-[#d7b7ff] bg-[#261c2c]" : "border-[#745a7d]/40 bg-[#17121c]"}`}
              onDragEnter={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7b7ff]">Drop zone</p>
              <h2 className="mt-2 text-2xl font-semibold">Add an HTML file</h2>
              <p className="mt-3 text-sm leading-6 text-[#cfc3d6]">
                Accepts .html and .htm. It previews in this browser first, then tries to save into the persistent archive.
              </p>
              <input ref={inputRef} className="hidden" type="file" accept=".html,.htm,text/html" multiple onChange={onFileInputChange} />
              <button className="mt-5 rounded-full border border-[#d7b7ff] bg-[#d7b7ff] px-5 py-2 text-sm font-semibold text-[#170f1d] hover:opacity-90 disabled:opacity-50" disabled={uploading} onClick={() => inputRef.current?.click()} type="button">
                {uploading ? "Adding..." : "Choose HTML files"}
              </button>
              <p className="mt-4 text-sm leading-6 text-[#eee4f4]">{status}</p>
              <div className="mt-4 grid gap-2 text-xs uppercase tracking-[0.18em] text-[#d7b7ff] sm:grid-cols-3">
                <span className="rounded-full border border-[#745a7d]/40 px-3 py-2">Public: {archiveCount}</span>
                <span className="rounded-full border border-[#745a7d]/40 px-3 py-2">Local: {localCount}</span>
                <span className="rounded-full border border-[#745a7d]/40 px-3 py-2">Storage: {storageConfigured ? "on" : "local only"}</span>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#745a7d]/40 bg-[#17121c] p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7b7ff]">Archive index</p>
                  <h2 className="mt-2 text-2xl font-semibold">HTML files</h2>
                </div>
                <button className="rounded-full border border-[#745a7d]/60 px-3 py-2 text-xs text-[#eadcf3] hover:border-[#d7b7ff] hover:bg-[#261c2c]" onClick={() => void loadArchive()} type="button">
                  Refresh
                </button>
              </div>

              <label className="mt-5 block text-sm text-[#d8cfdc]">
                Search archive
                <input className="mt-2 w-full rounded-2xl border border-[#745a7d]/40 bg-[#0f0d12] p-3 text-[#f5efe7] outline-none focus:border-[#d7b7ff]" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="artifact name, filename, path" />
              </label>

              <div className="mt-5 grid max-h-[34rem] gap-3 overflow-auto pr-1">
                {loading ? (
                  <p className="text-sm leading-6 text-[#cfc3d6]">Loading archive files...</p>
                ) : filteredArtifacts.length === 0 ? (
                  <p className="text-sm leading-6 text-[#cfc3d6]">No HTML artifacts match this view.</p>
                ) : (
                  filteredArtifacts.map((artifact) => (
                    <button
                      key={artifact.id}
                      className={`rounded-2xl border p-4 text-left transition ${selectedArtifact?.id === artifact.id ? "border-[#d7b7ff] bg-[#261c2c]" : "border-[#745a7d]/35 bg-[#0f0d12] hover:border-[#d7b7ff]"}`}
                      onClick={() => setSelectedId(artifact.id)}
                      type="button"
                    >
                      <span className="block text-base font-semibold text-[#eee4f4]">{artifact.name}</span>
                      <span className="mt-1 block break-all text-xs text-[#cfc3d6]">{artifact.filename}</span>
                      <span className="mt-3 flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-[#d7b7ff]">
                        <span>{artifact.source === "local" ? "local preview" : "public archive"}</span>
                        <span>{formatBytes(artifact.size)}</span>
                        {artifact.uploadedAt && <span>{formatDate(artifact.uploadedAt)}</span>}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>

          <section className="rounded-[1.5rem] border border-[#745a7d]/40 bg-[#17121c] p-6">
            {selectedArtifact ? (
              <div className="flex h-full flex-col gap-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7b7ff]">Selected artifact</p>
                    <h2 className="mt-2 text-3xl font-semibold">{selectedArtifact.name}</h2>
                    <p className="mt-2 break-all text-sm leading-6 text-[#cfc3d6]">{selectedArtifact.path}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button className="rounded-full border border-[#745a7d]/60 px-4 py-2 text-sm text-[#eadcf3] hover:border-[#d7b7ff] hover:bg-[#261c2c]" onClick={() => setShowSource((current) => !current)} type="button">
                      {showSource ? "Show preview" : "Show source"}
                    </button>
                    <a className="rounded-full border border-[#745a7d]/60 px-4 py-2 text-sm text-[#eadcf3] hover:border-[#d7b7ff] hover:bg-[#261c2c]" href={selectedArtifact.rawUrl} rel="noreferrer" target="_blank">
                      Open alone
                    </a>
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-[#745a7d]/40 bg-[#100c14] p-4">
                  <p className="text-sm leading-6 text-[#cfc3d6]">
                    Preview is sandboxed and only this selected artifact is active. The archive list itself does not execute stored files.
                  </p>
                </div>

                {showSource ? (
                  <textarea className="min-h-[42rem] w-full flex-1 rounded-[1.25rem] border border-[#745a7d]/40 bg-[#0f0d12] p-4 font-mono text-sm leading-6 text-[#eee4f4] outline-none" readOnly value={sourceText} />
                ) : (
                  <iframe className="min-h-[42rem] w-full flex-1 rounded-[1.25rem] border border-[#745a7d]/40 bg-white" key={selectedArtifact.id} sandbox="allow-scripts allow-forms allow-popups allow-modals" src={selectedArtifact.rawUrl} title={`Preview of ${selectedArtifact.name}`} />
                )}
              </div>
            ) : (
              <div className="flex min-h-[42rem] items-center justify-center rounded-[1.25rem] border border-dashed border-[#745a7d]/50 bg-[#100c14] p-8 text-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7b7ff]">No selection</p>
                  <h2 className="mt-2 text-3xl font-semibold">Drop or select an HTML file.</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#cfc3d6]">
                    The page is designed as an artifact shelf, not an auto-runner. A file becomes live only when you choose it.
                  </p>
                </div>
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}

function formatBytes(size: number) {
  if (!Number.isFinite(size) || size <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
