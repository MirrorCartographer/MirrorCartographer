# Creative Universe System

A durable source system for creative assets, films, documents, tools, references, and production knowledge. It preserves the paths between fragments so that an unfinished work is not mistaken for a forgotten one, and a possibility is not mistaken for a completed artifact.

Storage design:
- GitHub stores schemas, scripts, prompts, docs, catalogs, and reproducible logic.
- External storage stores large binaries such as videos, images, audio, PDFs, and datasets.
- A catalog JSON links every artifact to its storage location, project, tags, checksum, and relationships. Those links describe provenance and lineage; they do not invent meaning where the source is absent.
