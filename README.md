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

| Command           | Action                                      |
| ----------------- | ------------------------------------------- |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start dev server at `localhost:4321`        |
| `npm run build`   | Build production site to `./dist/`          |
| `npm run preview` | Preview the production build locally        |

## Content Editing

Keystatic's admin UI is available at `/keystatic` when running the dev server.
Posts live in `src/content/posts/`, authors in `src/content/authors/`, and site
settings in `src/content/settings/`.

## Status / TODO

- `site` is set to `https://paintaire.com` in `astro.config.mjs`, but **no deploy
  config exists in this repo** (no Netlify/Vercel/Cloudflare config) — hosting is
  not yet wired up.
- The newsletter form (`src/components/NewsletterForm.astro`) is a **stub** — it
  logs to the console and does not submit anywhere. Per the ecosystem
  advertising-brand pattern, lead capture should POST to
  `https://crm.moorhousecoating.com/api/v1/leads` with `form_source: "advertising_brand"`.
- Comments component (`src/components/Comments.astro`) has no backing service.
