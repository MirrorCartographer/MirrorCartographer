# Cloudflare Pages setup

Status: public parallel host candidate.

This repository is a Next 15 app configured for static export. Cloudflare Pages should build it as a static site.

## Dashboard settings

Repository: `MirrorCartographer/MirrorCartographer`
Branch: `main`
Build command: `npm run build:cloudflare`
Build output directory: `out`
Root directory: `/`

## Why this path

The private `mirror-cartographer-ui` repo is still the phone-first weather/music prototype. This public repo is safer for Cloudflare preview reliability because it can deploy without exposing private prototype code or records.

Static export reduces runtime risk: no server functions, no edge adapter, and no Cloudflare Worker compatibility layer required.

## Current hosting assessment

- Vercel remains the primary baseline for the private Vite phone-weather app until Cloudflare preview is proven.
- Cloudflare Pages is now prepared on the public repo as a safer public mirror/preview path.
- Netlify would also work for static export, but does not improve the immediate GitHub-to-preview safety as much as Cloudflare Pages.
- GitHub Pages could host the static `out` folder, but Cloudflare gives better preview/deploy ergonomics and future domain/DNS control.

## Testing note

2026-07-08: direct live-site check of `mirror-cartographer-ui.vercel.app` through the available web tool failed because the URL was not accepted unless present in search results. Search returned no indexed result. Treat the live-site state as inconclusive from this tool, not confirmed down.

After Cloudflare creates the pages.dev URL, test:

1. Public URL loads.
2. Mobile viewport does not overflow.
3. Static routes refresh without 404.
4. No private-only details are visible.
5. For the private phone-weather app, preserve no autoplay, tap-to-start audio, low CPU, no visible explanatory words, and phone-first stability.

## Suggested next action

Create the Cloudflare Pages project from the Cloudflare dashboard using `MirrorCartographer/MirrorCartographer`, then paste the generated `*.pages.dev` URL into the next cycle. If deploy fails, inspect the Cloudflare build log first for Next static-export errors, especially font download, dynamic route, or unsupported server runtime warnings.
