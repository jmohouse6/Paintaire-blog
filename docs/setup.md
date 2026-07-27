# Developer Setup

Setup guide for the Paintaire Blog — an Astro 4 site with Keystatic CMS.

## Prerequisites

- **Node.js** 18.17.1+ or 20+ (Astro 4 requirement — use a current LTS)
- **pnpm** (canonical package manager for this repo — `pnpm-lock.yaml`). The repo pins `pnpm@10.18.3` via the `packageManager` field in `package.json`; enable Corepack (`corepack enable`) so the pinned version is used automatically.

## Installation

```bash
git clone <repo-url>
cd Paintaire-blog
pnpm install
```

No environment variables are required. Optional integrations (all off by default):

| Variable                     | Purpose                                                        |
| ---------------------------- | -------------------------------------------------------------- |
| `PUBLIC_GISCUS_REPO`         | Enable Giscus comments — GitHub repo (`owner/name`)            |
| `PUBLIC_GISCUS_REPO_ID`      | Giscus repository ID                                           |
| `PUBLIC_GISCUS_CATEGORY`     | Discussions category name (default `General`)                  |
| `PUBLIC_GISCUS_CATEGORY_ID`  | Giscus category ID                                             |
| `PUBLIC_NEWSLETTER_ENDPOINT` | URL the newsletter form POSTs to; simulated locally when unset |

## Development

```bash
pnpm dev
```

- Site: http://localhost:4321
- Keystatic admin: http://localhost:4321/keystatic (local storage mode — content edits write to local files)

Build and preview a production build:

```bash
pnpm build      # outputs ./dist/
pnpm preview    # serves the production build locally
pnpm start      # runs the standalone production server (node ./dist/server/entry.mjs)
```

## Useful Commands

| Command         | Description                                        |
| --------------- | -------------------------------------------------- |
| `pnpm install`   | Install dependencies                               |
| `pnpm dev`   | Start dev server at `localhost:4321`               |
| `pnpm build` | Build production site to `./dist/`                 |
| `pnpm preview` | Preview the production build locally             |
| `pnpm astro` | Run Astro CLI commands (e.g. `pnpm astro check`) |

## Project Structure

```
Paintaire-blog/
├── astro.config.mjs        # Astro config: site, hybrid output, integrations
├── keystatic.config.ts     # Keystatic CMS config (local storage mode)
├── tailwind.config.mjs     # Tailwind CSS config
├── package.json            # Scripts and dependencies
├── public/                 # Static assets served as-is
├── src/
│   ├── content/            # Content collections (blog posts, etc.)
│   ├── layouts/            # Page layouts
│   ├── pages/              # Routes (file-based routing)
│   └── components/         # Reusable Astro/UI components
└── dist/                   # Build output (generated)
```

### Key configuration (`astro.config.mjs`)

- `site`: `https://paintaire.com`
- `output`: `'hybrid'` (static by default, SSR on demand per page)
- Adapter: `@astrojs/node` (standalone mode)
- Integrations: `tailwind`, `mdx`, `sitemap` (excludes `/admin` and `/keystatic`), `keystatic`
- Markdown syntax highlighting: Shiki with the `github-dark` theme

### Key dependencies

| Package              | Purpose                              |
| -------------------- | ------------------------------------ |
| `astro` (^4.5.0)     | Core framework                       |
| `@keystatic/astro`   | CMS admin UI + content API           |
| `@astrojs/tailwind`  | Tailwind CSS integration             |
| `@astrojs/mdx`       | MDX support                          |
| `@astrojs/rss`       | RSS feed generation                  |
| `@astrojs/sitemap`   | Sitemap generation                   |
| `astro-seo`          | SEO meta tags                        |
| `marked`             | Markdown parsing                     |
| `sanitize-html`      | HTML sanitization                    |
| `zod`                | Schema validation (content collections) |

## Troubleshooting

### Port 4321 already in use

Another process is holding the port. Either stop it or run the dev server on a different port:

```bash
pnpm dev -- --port 3000
```

### Keystatic admin not loading

- Confirm you are visiting `/keystatic` on the **dev server** (`pnpm dev`) — Keystatic in local storage mode only runs during development.
- Check that `@keystatic/astro` and `@keystatic/core` are installed (`pnpm install`).
- If the page is blank or errors persist, clear the build cache and restart:

  ```bash
  rm -rf node_modules/.astro
  pnpm dev
  ```

### Stale `node_modules`

If dependencies behave inconsistently (e.g. after pulling changes), do a clean install:

```bash
rm -rf node_modules
pnpm install
```

### Build errors after upgrading dependencies

Remove generated output and caches, then rebuild:

```bash
rm -rf dist node_modules/.astro
pnpm build
```
