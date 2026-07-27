# Paintaire Blog

Content-marketing blog for Paintaire (`https://paintaire.com`). Astro 4 + Tailwind + MDX, with Keystatic CMS for content editing.

## Ecosystem Context

This repository is part of the [Moorhouse Coating ecosystem](https://github.com/jmohouse6/ecosystem).
It is a **non-platform repo** — it does not carry the `docs/ecosystem` submodule and is not
registered in `services.json`; it links to the ecosystem for architecture and conventions only.

## Working in This Repo

- **Commands:** `npm run dev` / `build` / `preview` (npm is canonical — `package-lock.json`); `npm start` runs the production Node server.
- **Deployment:** no host/CI configured yet (no Railway project exists as of 2026-07-26). The build produces a standalone Node server (`@astrojs/node`) — `npm run build`, then `npm start` — deployable to any Node-capable host. See docs/deployment.md.
- **Content editing:** Keystatic runs in local storage mode. Edit at `http://localhost:4321/keystatic`
  during `npm run dev`; changes land as files under `src/content/` and must be committed via git.
- **Content schema:** posts / authors / settings, defined in `keystatic.config.ts` and `src/content/config.ts`.
- **Posts live in** `src/content/posts/`, **authors in** `src/content/authors/`, images in `public/images/`.
- **Optional env vars:** `PUBLIC_GISCUS_*` (comments), `PUBLIC_NEWSLETTER_ENDPOINT` (newsletter backend) — all off by default; see README.md.

## Known Issues

- The `settings` collection is editable in Keystatic but not yet consumed by any template.
- Build warns that `Astro.request.headers` is unavailable in prerendered blog pages — pre-existing; affected pages should opt into on-demand rendering if headers are needed.
