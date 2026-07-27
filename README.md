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
- **Comments:** Giscus (GitHub Discussions) — not yet configured, see Known Issues
- **Package manager:** pnpm

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
├── public/                  # Static assets (post/author images live under /images)
├── src/
│   ├── content/
│   │   ├── posts/           # Blog posts (Markdown with frontmatter)
│   │   └── authors/         # Author profiles
│   ├── layouts/
│   │   └── BaseLayout.astro # Main layout (SEO, OG/Twitter meta, header/footer)
│   ├── components/          # Header, Footer, FeaturedPosts, Comments, etc.
│   └── pages/
│       ├── index.astro      # Home: company intro + featured posts
│       ├── blog/index.astro # Blog listing (category filter, pagination)
│       ├── blog/[slug].astro# Individual post pages
│       ├── rss.xml.js       # RSS feed at /rss.xml
│       └── sitemap-custom.xml.ts
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
- **Sitemap:** `/sitemap-index.xml` via `@astrojs/sitemap` (`/admin` and `/keystatic` routes should stay excluded); `robots.txt` points at it. A legacy hand-built sitemap also exists at `/sitemap-custom.xml` (see Known Issues).
- **Meta:** `BaseLayout.astro` emits Open Graph, Twitter card, canonical, and article meta via `astro-seo`. Default OG image: `/images/default-og.jpg`.

## Deployment

The site builds with the `@astrojs/node` adapter in `standalone` mode: pages are
prerendered where possible, and server-rendered routes (Keystatic admin/API) are
served by a Node server. `pnpm build` → `./dist/`, then serve with `pnpm start`
(`node ./dist/server/entry.mjs`). No hosting/CI configuration exists in this repo
yet — the standalone output can run behind any Node-capable host or reverse proxy.

## Known Issues / TODO

- **Giscus comments not configured** — `src/components/Comments.astro` still has
  `[REPO-NAME]` / `[REPO-ID]` / `[CATEGORY-ID]` placeholders, and stray HTML comments
  inside the `<script>` tag attributes break the embed. Needs real Giscus config.
- **Newsletter form has no backend** — `src/components/NewsletterForm.astro` only logs
  to the console; its privacy-policy link points to `/privacy`, which doesn't exist.
- **`sitemap-custom.xml.ts` is stale** — advertises `/about`, `/contact`, and
  `/authors/[slug]` pages that don't exist, duplicates the official sitemap
  integration, and hardcodes the base URL. Candidate for deletion.
- **YouTube embeds never rendered** — `youtubeUrl` is collected in the schema but
  `blog/[slug].astro` doesn't output it.
- **Dark mode incomplete** — the inline theme script in `BaseLayout.astro` is a stub;
  `blog/[slug].astro` reads a `theme` cookie that can't work on prerendered pages
  (and the value is never passed to the Comments component).
- **Missing content config** — no `src/content/config.ts`, so collections are untyped
  at build time despite `zod` being a dependency.
- **Referenced-but-missing pages** — header nav links to `/about` and `/contact`;
  neither exists.
- **Settings collection unconsumed** — `src/content/settings/` now has content
  (`site.md`, `paintaire.md`), but no layout/page reads it yet.
- **Repo hygiene** — starter leftovers (`src/layouts/Layout.astro`,
  `src/components/Card.astro`) are unused.

## License

Private — Paintaire / Moorhouse Coating
