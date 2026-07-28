# Paintaire Blog

Content-marketing blog for Paintaire (`https://paintaire.com`). Astro 4 + Tailwind + MDX, with Keystatic CMS for content editing.

## Ecosystem Context

This repository is part of the [Moorhouse Coating ecosystem](https://github.com/jmohouse6/ecosystem).
It is a **non-platform repo** — it does not carry the `docs/ecosystem` submodule and is not
registered in `services.json`; it links to the ecosystem for architecture and conventions only.

## Working in This Repo

- **Commands:** `pnpm dev` / `build` / `preview` (pnpm is canonical — `pnpm-lock.yaml`); `pnpm start` runs the production Node server.
- **Deployment:** Railway — project/service `paintaire-blog`, auto-deploy on push to `master`. Build produces a standalone Node server (`@astrojs/node`): `pnpm build`, then `pnpm start`. **LIVE at https://paintaire.com since 2026-07-28** (rollback = repoint CNAMEs to Netlify, which stays up through the soak period) — see docs/deployment.md.
- **Content editing:** Keystatic runs in local storage mode. Edit at `http://localhost:4321/keystatic`
  during `pnpm dev`; changes land as files under `src/content/` and must be committed via git.
- **Content schema:** posts / authors / settings, defined in `keystatic.config.ts` and `src/content/config.ts`.
- **Posts live in** `src/content/posts/`, **authors in** `src/content/authors/`, images in `public/images/`.
- **Optional env vars:** `PUBLIC_GISCUS_*` (comments), `PUBLIC_NEWSLETTER_ENDPOINT` (newsletter backend) — all off by default; see README.md.

## Known Issues

- `astro check` is unusable in this repo — the TS language service OOMs on the Keystatic/Keystar type graph (verified past 12 GB heap). Use `pnpm check` (`tsc --noEmit --skipLibCheck`) instead.
