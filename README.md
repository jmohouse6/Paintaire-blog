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
- The newsletter form POSTs to `PUBLIC_NEWSLETTER_ENDPOINT` when set (submissions
  are simulated locally otherwise). Per the ecosystem advertising-brand pattern,
  lead capture should point at `https://crm.moorhousecoating.com/api/v1/leads`
  with `form_source: "advertising_brand"`.
- Comments (`src/components/Comments.astro`, Giscus) render only once the
  `PUBLIC_GISCUS_REPO` / `PUBLIC_GISCUS_REPO_ID` env vars are configured.
- **Images are missing** — `public/images/` is empty, but posts, authors, and
  `BaseLayout` reference `/images/posts/*`, `/images/authors/*`, and
  `/images/default-og.jpg`. All currently 404; upload real assets via Keystatic
  or add them to `public/images/`.
