# Deployment Guide — Paintaire Blog

Deployment guide for the Paintaire Blog (Astro 4, `output: 'hybrid'`) at paintaire.com.

## Overview

| Item                | Value                                              |
| ------------------- | -------------------------------------------------- |
| Framework           | Astro 4 (`astro@^4.5.0`)                           |
| Output mode         | `hybrid` (static by default, SSR on demand)        |
| Adapter (current)   | `@astrojs/node` (standalone)                       |
| Package manager     | pnpm                                               |
| Build command       | `pnpm build` → outputs to `./dist/`                |
| Start command       | `node ./dist/server/entry.mjs` (SSR server)        |
| Canonical site URL  | `https://paintaire.com` (set in `astro.config.mjs`) |
| Sitemap             | Generated at build; excludes `/admin` paths        |
| RSS feed            | `/rss.xml` (static, prerendered at build)          |
| CMS                 | Keystatic, `storage: 'local'` (git-based, local)   |

## The adapter caveat

`output: 'hybrid'` means pages are prerendered to static HTML by default, but any route that opts into SSR (`export const prerender = false`) needs a **server adapter** at runtime. Astro will not build hybrid/SSR output without one.

This repo **already has an adapter installed**: `@astrojs/node` in `standalone` mode (`astro.config.mjs`). That means the build works out of the box and produces a self-contained Node server:

```bash
pnpm build
node ./dist/server/entry.mjs   # also: pnpm start
```

Static assets land in `dist/client/` and the server in `dist/server/`. Deploying to a plain Node host (VM, container, PaaS) works today with no config changes.

If you want a different host, there are two practical paths:

### Path (a): Switch to fully static output

If no route actually needs SSR (typical for a blog), the simplest option is to drop the server entirely:

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://paintaire.com',
  output: 'static',
  // adapter removed
  integrations: [ /* unchanged */ ],
});
```

Then `pnpm build` produces a pure static `dist/` you can host anywhere (see [Static hosting](#static-hosting-any-static-host--s3--cdn)).

Caveat: Keystatic's `/keystatic` admin UI is an SSR route. With `storage: 'local'` it is a local authoring tool anyway (see below), so removing SSR from production is safe if you author locally and commit content.

### Path (b): Install an adapter for your target host

Replace `@astrojs/node` with the platform adapter and update `astro.config.mjs`. See the per-host quickstarts below.

## Vercel

```bash
pnpm add @astrojs/vercel
```

```js
// astro.config.mjs
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://paintaire.com',
  output: 'hybrid',
  adapter: vercel(),
  // integrations unchanged
});
```

- Import the repo in the Vercel dashboard; framework preset **Astro** is auto-detected.
- Build command `pnpm build`, output directory `dist` (defaults work).

## Netlify

```bash
pnpm add @astrojs/netlify
```

```js
// astro.config.mjs
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://paintaire.com',
  output: 'hybrid',
  adapter: netlify(),
  // integrations unchanged
});
```

- Import the repo in the Netlify dashboard; build command `pnpm build`, publish directory `dist`.
- SSR routes run as Netlify Functions automatically.

## Cloudflare Pages

```bash
pnpm add @astrojs/cloudflare
```

```js
// astro.config.mjs
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://paintaire.com',
  output: 'hybrid',
  adapter: cloudflare(),
  // integrations unchanged
});
```

- In the Cloudflare dashboard: build command `pnpm build`, output directory `dist`.
- SSR routes run as Cloudflare Pages Functions (Workers runtime — no Node-only APIs).

## Static hosting (any static host / S3 + CDN)

Applies to path (a) with `output: 'static'`. After `pnpm build`:

- Upload the contents of `dist/` to your host (S3 bucket, object storage, nginx docroot, GitHub Pages, etc.).
- Put a CDN in front (CloudFront, Cloudflare) and point `paintaire.com` at it.
- No server process is required; sitemap and RSS are plain files in `dist/`.

## Keystatic in production

Keystatic is configured with `storage: 'local'`: content lives in this git repository and the Keystatic admin UI reads/writes the local filesystem. It is a **local authoring tool**, not a production editing UI:

- There is no GitHub OAuth / Keystatic Cloud mode configured, so editors cannot authenticate or save changes from a deployed site.
- The intended workflow is: run `pnpm dev` locally, edit content in Keystatic at `/keystatic`, commit the changes, push, redeploy.
- Do not expose `/keystatic` or `/api/keystatic` publicly expecting it to work; on most serverless/static deployments it will be non-functional. The sitemap already excludes admin paths.

If browser-based editing in production is ever needed, switch Keystatic to `storage: 'github'` (or Keystatic Cloud) and keep an SSR adapter deployed.

## Pre-deploy checklist

- [ ] `pnpm build` passes cleanly.
- [ ] `site: 'https://paintaire.com'` is correct in `astro.config.mjs` (drives sitemap, canonical URLs, RSS).
- [ ] Sitemap generated at `dist/sitemap-index.xml` and excludes `/admin` pages.
- [ ] RSS feed present at `dist/rss.xml`.
- [ ] Images committed under `public/images/` (they are copied verbatim to `dist/`).
- [ ] Blog content committed to git (Keystatic `local` storage — content ships with the repo).
- [ ] If using the Node adapter: host runs `node ./dist/server/entry.mjs` and serves `dist/client/` assets (the standalone server does this itself).
- [ ] If static: `output` switched to `'static'` and no SSR-only routes remain.
