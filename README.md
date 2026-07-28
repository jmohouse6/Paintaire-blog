# Paintaire Blog

Content site for the **Paintaire** brand — a planned paint-delivery and
painting-contractor services business (deliver paint to and service painting
contractors). Today it is the brand's blog: painting tips, industry news, how-to
guides, and product reviews. Advertising-brand site in the Moorhouse ecosystem:
independent domain (`paintaire.com`), no platform services, no shared auth. Future
Paintaire platform services get their own repos under the paintaire.com domain.

## Ecosystem Context

This repository is part of the [Moorhouse Coating ecosystem](https://github.com/jmohouse6/ecosystem).
See its `ECOSYSTEM.md` for platform architecture and conventions — specifically the
**Advertising Brand Domains** section for how brand sites like this one are classified.

## Stack

- **Framework:** Astro 4 + Tailwind CSS
- **CMS:** Keystatic (content in `src/content/` — posts, authors, site settings)
- **Extras:** RSS (`/rss.xml`), sitemap, `astro-seo`, MDX

## Commands

| Command        | Action                                                 |
| -------------- | ------------------------------------------------------ |
| `pnpm install` | Install dependencies                                   |
| `pnpm dev`     | Start dev server at `localhost:4321`                   |
| `pnpm build`   | Build production site to `./dist/`                     |
| `pnpm preview` | Preview the production build locally                   |
| `pnpm check`   | Type-check (`tsc --noEmit`; use instead of `astro check`, which OOMs on Keystatic types) |
| `pnpm start`   | Run production server (`node ./dist/server/entry.mjs`) |

This repo is pnpm-only (`packageManager: pnpm@10.18.3`, `pnpm-lock.yaml`). Enable
Corepack (`corepack enable`) so the pinned version is used automatically.

## Documentation

- [Developer setup](docs/setup.md) — prerequisites, install, dev workflow
- [Content authoring](docs/content-authoring.md) — Keystatic CMS and content collections
- [Deployment](docs/deployment.md) — Railway hosting, DNS, and alternative hosts

## Content Editing

Keystatic's admin UI is available at `/keystatic` when running the dev server.
Posts live in `src/content/posts/`, authors in `src/content/authors/`, and site
settings in `src/content/settings/`.

## Status / TODO

- `site` is set to `https://paintaire.com` in `astro.config.mjs`; the site builds
  with the `@astrojs/node` standalone adapter (`pnpm build` → `pnpm start`). See
  `docs/deployment.md` for hosting notes.
- The newsletter and contact forms POST same-origin to `/api/leads`
  (`src/pages/api/leads.ts`), which forwards leads server-side to the URL in
  `CRM_LEADS_ENDPOINT` (server-side env var, not `PUBLIC_`) with
  `form_source: "advertising_brand"` per the ecosystem advertising-brand
  pattern — e.g. `https://crm.moorhousecoating.com/api/v1/leads`. When
  `CRM_LEADS_ENDPOINT` is unset the endpoint returns 503 and the forms show
  their success state (lead capture not wired yet). If ever needed, the
  `PUBLIC_NEWSLETTER_ENDPOINT` / `PUBLIC_CONTACT_ENDPOINT` env vars override
  the proxy with a direct browser POST to the given URL.
- Comments (`src/components/Comments.astro`, Giscus) render only once the
  `PUBLIC_GISCUS_REPO` / `PUBLIC_GISCUS_REPO_ID` env vars are configured.
- **Images are placeholders** — the files under `public/images/` (post heroes,
  author avatars, `default-og.jpg`) are generated brand placeholders so nothing
  404s; replace them with real assets via Keystatic or by overwriting the files
  (keep the same filenames or update the frontmatter references).
