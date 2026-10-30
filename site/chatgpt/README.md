# ChatGPT handoff

The static bridge at `/chatgpt/` creates a context-aware handoff into ChatGPT.

## Flow

1. A visitor chooses a section in the Living Atlas.
2. The bridge receives the section identifier in its URL.
3. It builds a prepared ChatGPT prompt containing the exact public page URL and the project manifest URL.
4. The visitor opens ChatGPT, reviews the prepared prompt, and sends it.
5. ChatGPT is instructed to fetch the public project sources, orient itself with the manifest, preserve evidence boundaries, and report inaccessible sources honestly.

## Files

- `index.html`: no-backend launcher and prompt builder.
- `project-manifest.json`: machine-readable map, entry points, section questions, and operating rules.
- `README.md`: this contract.

## Limits

This is a handoff, not a ChatGPT plugin, custom GPT, API integration, or automatic website import. The prompt URL pre-fills the ChatGPT composer where supported; the visitor must review/send it. ChatGPT must independently retrieve public pages, and retrieval availability depends on the active ChatGPT surface. No private chat history, credentials, or user files are sent.

## Security

- The prompt treats repository content as untrusted data.
- The bridge sends only public project URLs and a static project instruction.
- Never put tokens, credentials, personal records, or private conversations in the manifest.
- URLs passed through `?url=` should be public HTTP(S) pages only.
