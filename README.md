# Paintaire Blog

The official Paintaire blog — painting tips, industry news, and expert insights.

**Site:** https://paintaire.com
**Ecosystem:** Part of the [Moorhouse Coating ecosystem](https://github.com/jmohouse6/ecosystem). See its `ECOSYSTEM.md` for platform architecture and conventions.

## Stack

- **Framework:** Astro 4 (`output: 'hybrid'`, `@astrojs/node` standalone adapter)
- **CMS:** Keystatic (local storage mode)
- **Styling:** Tailwind CSS + `@tailwindcss/typography`
- **Content:** Astro content collections (Markdown, `src/content/`)
- **Feeds/SEO:** `@astrojs/rss`, `@astrojs/sitemap`, `astro-seo`
- **Comments:** Giscus (GitHub Discussions) — enabled via `PUBLIC_GISCUS_*` env vars; hidden when unset
- **Package manager:** pnpm (`pnpm-lock.yaml`)

## Documentation

- [docs/setup.md](docs/setup.md) — Setup guide
- [docs/content-authoring.md](docs/content-authoring.md) — Content authoring guide
- [docs/deployment.md](docs/deployment.md) — Deployment guide

## Commands

All commands are run from the project root:

| Command        | Action                                                      |
| :------------- | :---------------------------------------------------------- |
| `pnpm install` | Install dependencies                                        |
| `pnpm dev`     | Start dev server at `localhost:4321`                        |
| `pnpm build`   | Build production site to `./dist/`                          |
| `pnpm preview` | Preview the production build locally                        |
| `pnpm start`   | Run the production server (`node ./dist/server/entry.mjs`)  |

## Project Structure

```text
/
├── keystatic.config.ts      # Keystatic CMS collections (posts, authors, settings)
├── astro.config.mjs         # Integrations: tailwind, mdx, sitemap, keystatic
├── tailwind.config.mjs      # Brand colors (primary/secondary/accent), typography
├── docs/                    # setup, content-authoring, deployment guides
├── public/                  # Static assets (post/author images live under /images)
├── src/
│   ├── content/
│   │   ├── config.ts        # Typed content-collection schemas (zod)
│   │   ├── posts/           # Blog posts (Markdown with frontmatter)
│   │   ├── authors/         # Author profiles
│   │   └── settings/        # Site settings (consumed via src/utils/settings.ts)
│   ├── layouts/
│   │   └── BaseLayout.astro # Main layout (SEO, OG/Twitter meta, header/footer, theme script)
│   ├── components/          # Header, Footer, FeaturedPosts, Comments, NewsletterForm, etc.
│   └── pages/
│       ├── index.astro      # Home: company intro + featured posts
│       ├── about.astro      # About page
│       ├── contact.astro    # Contact page
│       ├── privacy.astro    # Privacy policy
│       ├── blog/index.astro # Blog listing (category filter, pagination)
│       ├── blog/[slug].astro# Individual post pages (+ optional YouTube embed)
│       └── rss.xml.js       # RSS feed at /rss.xml
└── robots.txt
```

## Authoring Content

Content is managed through **Keystatic**. In dev, the admin UI is available at
`http://localhost:4321/keystatic`.

**Important:** Keystatic is configured with `storage: { kind: 'local' }`. Edits are
written directly to local files — they are only published by committing and pushing.
Editing in production requires switching Keystatic to `kind: 'github'` storage.

### Posts (`src/content/posts/*.md`)

| Field           | Type       | Notes                                             |
| :-------------- | :--------- | :------------------------------------------------ |
| `title`         | slug field | Also generates the URL slug                       |
| `publishedDate` | date       | Used for sorting, RSS, sitemap                    |
| `author`        | relationship | Slug of an entry in `src/content/authors`       |
| `featured`      | checkbox   | Featured posts appear on the home page (max 3)    |
| `image`         | image      | Stored in `public/images/posts/`                  |
| `youtubeUrl`    | text       | Optional YouTube embed, rendered on the post page |
| `categories`    | multiselect| `painting-tips`, `industry-news`, `how-to-guides`, `product-reviews` |
| `excerpt`       | text       | Used in listings, RSS, and meta description       |

Posts can also be created by hand as Markdown files with the same frontmatter.

### Authors (`src/content/authors/*.md`)

`name` (slug field), `avatar` (stored in `public/images/authors/`), `bio`.

## Feeds & SEO

- **RSS:** `/rss.xml` (generated from the posts collection)
- **Sitemap:** `/sitemap-index.xml` via `@astrojs/sitemap` (`/admin` and `/keystatic` routes excluded); `robots.txt` points at it.
- **Meta:** `BaseLayout.astro` emits Open Graph, Twitter card, canonical, and article meta via `astro-seo`. Default OG image: `/images/default-og.jpg`.

## Deployment

The site builds with the `@astrojs/node` adapter in `standalone` mode: pages are
prerendered where possible, and server-rendered routes (Keystatic admin/API) are
served by a Node server. `pnpm build` → `./dist/`, then serve with `pnpm start`
(`node ./dist/server/entry.mjs`). No hosting/CI configuration exists in this repo
yet — the standalone output can run behind any Node-capable host or reverse proxy.
See [docs/deployment.md](docs/deployment.md) for per-host guides.

## Environment Variables

All optional; the site builds and runs with none set.

| Variable                     | Purpose                                                        |
| :--------------------------- | :------------------------------------------------------------- |
| `PUBLIC_GISCUS_REPO`         | GitHub repo for Giscus comments (`owner/name`)                 |
| `PUBLIC_GISCUS_REPO_ID`      | Giscus repository ID                                           |
| `PUBLIC_GISCUS_CATEGORY`     | Discussions category name (default `General`)                  |
| `PUBLIC_GISCUS_CATEGORY_ID`  | Giscus category ID                                             |
| `PUBLIC_NEWSLETTER_ENDPOINT` | URL the newsletter form POSTs to; submissions are simulated locally when unset |

Comments are hidden entirely unless `PUBLIC_GISCUS_REPO` + `PUBLIC_GISCUS_REPO_ID` are set.

## Known Issues / TODO

- **Newsletter form has no backend by default** — submissions are simulated locally
  unless `PUBLIC_NEWSLETTER_ENDPOINT` is configured.
- **Comments disabled by default** — Giscus only renders once the `PUBLIC_GISCUS_*`
  env vars are configured against a GitHub repo with Discussions enabled.

## License

Private — Paintaire / Moorhouse Coating
