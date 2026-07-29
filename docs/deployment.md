# Deployment Guide — Paintaire Blog

Deployment guide for the Paintaire Blog (Astro 4, `output: 'hybrid'`) at paintaire.com.

## Overview

| Item                | Value                                              |
| ------------------- | -------------------------------------------------- |
| Framework           | Astro 4 (`astro@^4.5.0`)                           |
| Output mode         | `hybrid` (all pages SSR via `prerender = false`)   |
| Adapter (current)   | `@astrojs/node` (standalone)                       |
| Package manager     | pnpm                                               |
| Build command       | `pnpm build` → outputs to `./dist/`                |
| Start command       | `node ./dist/server/entry.mjs` (SSR server)        |
| Canonical site URL  | `https://paintaire.com` (set in `astro.config.mjs`) |
| Sitemap             | Generated at build; excludes `/admin` and `/keystatic` paths |
| RSS feed            | `/rss.xml` (server-rendered per request)           |
| CMS                 | Keystatic, `storage: 'local'` (git-based, local)   |
| Hosting (current)   | Railway — project/service `paintaire-blog` (production) |

## The adapter caveat

`output: 'hybrid'` means pages are prerendered to static HTML by default, but any route that opts into SSR (`export const prerender = false`) needs a **server adapter** at runtime. Astro will not build hybrid/SSR output without one.

**Every page route in this repo sets `prerender = false`.** Prerendered pages are
served as static files by the adapter and bypass Astro middleware — and our
middleware (`src/middleware.ts`) applies the www→apex redirect and security
headers (HSTS, CSP, X-Frame-Options, etc.), so all HTML routes are server-rendered
to keep those protections uniform. Only static assets (images, `/_astro/*`,
sitemap XML) are served directly. Keystatic's admin routes also require `hybrid`.

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

## Railway (current production host)

The site is deployed on Railway from the `master` branch of `jmohouse6/Paintaire-blog`
(auto-deploy on push). Configuration:

- **Builder:** Railpack (default) — detects pnpm via `pnpm-lock.yaml`
- **Build command:** `pnpm build`
- **Start command:** `node ./dist/server/entry.mjs`
- **Package manager pin:** `packageManager: pnpm@10.18.3` in `package.json` is **required** —
  Railpack otherwise defaults to pnpm v9, which rejects the v10-style
  `pnpm-workspace.yaml` (`packages field missing or empty` build failure).
- **Preview URL:** https://paintaire-blog-production.up.railway.app
- **Custom domain:** `paintaire.com` (see DNS below)

> **Cutover status (LIVE since 2026-07-28):** DNS is flipped — both `paintaire.com`
> and `www.paintaire.com` serve from Railway (`server: railway-hikari`), domains
> Verified, certificates `VALID`. All routes, RSS, and sitemap smoke-tested 200 on
> both hostnames; `www.paintaire.com/blog` 301s to the apex canonical (expected).
> **Rollback:** repoint both CNAMEs at the Netlify site
> (`fabulous-smakager-3e9d55.netlify.app`), which is left running until the soak
> period (through ~2026-08-04) completes.
>
> **Consolidated (2026-07-26):** a single Railway project (`paintaire-blog`, service
> `paintaire-blog`) now holds both custom domains plus
> `paintaire-blog-production.up.railway.app`. Two duplicate projects created during
> initial setup were deleted.
>
> Each domain also needs its `_railway-verify` TXT record (values in the Railway
> dashboard — they differ per domain). Keep the TXT records in place after cutover —
> they are harmless and speed up re-verification if domains are ever re-added.
>
> **Incident (2026-07-27, resolved 2026-07-28):** the Railway project (id
> `92fcba77-ef0f-418d-8f97-a83d2ce70d88`, service `paintaire-blog`) was accidentally
> soft-deleted during project consolidation — two concurrent automation sessions both
> ran duplicate-project cleanup, and a stale confirmation led to a name-based
> `railway project delete` that resolved to the wrong (canonical) project. It was
> restored within the 2-day purge window via the GraphQL mutation
> `projectScheduleDeleteCancel(id)` against `https://backboard.railway.com/graphql/v2`
> (Bearer token = `accessToken` from `~/.railway/config.json`; there is no CLI/MCP
> restore command). The site is back up; latest deployment is SUCCESS.
> Lesson: never delete Railway projects by name — always by ID, and verify
> `deletedAt` via `railway list --json` before assuming a delete is needed.

### DNS for paintaire.com

Railway requires these DNS records (live status in the Railway dashboard):

| Type  | Name                  | Value                                              |
| ----- | --------------------- | -------------------------------------------------- |
| CNAME | `@`                   | `wql8sgyz.up.railway.app`                          |
| TXT   | `_railway-verify`     | `railway-verify=…` (apex value in Railway dashboard) |
| CNAME | `www`                 | `y9suy4m9.up.railway.app`                          |
| TXT   | `_railway-verify.www` | `railway-verify=…` (www value in Railway dashboard) |

Notes:

- Apex/root domains cannot use a plain CNAME on many DNS providers — use a provider
  with CNAME flattening / ALIAS / ANAME support (e.g. Cloudflare), or delegate to
  Railway's nameservers.
- TLS is provisioned automatically once DNS verifies; certificate status starts at
  `VALIDATING_OWNERSHIP` until the records are in place.

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
- [ ] Sitemap generated at `dist/sitemap-index.xml` and excludes `/admin` and `/keystatic` pages.
- [ ] RSS feed present at `dist/rss.xml`.
- [ ] Images committed under `public/images/` (they are copied verbatim to `dist/`).
- [ ] Blog content committed to git (Keystatic `local` storage — content ships with the repo).
- [ ] If using the Node adapter: host runs `node ./dist/server/entry.mjs` and serves `dist/client/` assets (the standalone server does this itself).
- [ ] If static: `output` switched to `'static'` and no SSR-only routes remain.

## www redirect

`src/middleware.ts` canonicalizes `www.paintaire.com` → `paintaire.com` with a 301 redirect (same path + query preserved). It runs for every request through the Node adapter, so no Railway or edge configuration is needed — just point both `paintaire.com` and `www.paintaire.com` at the same service.
