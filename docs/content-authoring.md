# Content Authoring Guide

Guide for writing and publishing content on the Paintaire Blog (Astro 4 + Keystatic CMS).

## Overview

All blog content lives as plain files in the repository and is edited through the Keystatic CMS. Keystatic is configured with `storage: { kind: 'local' }`, which means edits made in the CMS are written directly to files on disk — nothing is published until those files are committed and pushed to git.

There are three collections:

| Collection | Label        | Files location          |
| ---------- | ------------ | ----------------------- |
| `posts`    | Blog Posts   | `src/content/posts/*`   |
| `authors`  | Authors      | `src/content/authors/*` |
| `settings` | Site Settings | `src/content/settings/*` |

> **Note:** Site Settings entries already exist (`src/content/settings/site.md`, `paintaire.md`) and are consumed site-wide via `src/utils/settings.ts` (layout description, footer title/description/social links), with a hardcoded fallback when no entry is found.

In addition to the Keystatic schema (`keystatic.config.ts`), all three collections (`posts`, `authors`, `settings`) are also declared as Astro content collections in `src/content/config.ts` with Zod schemas. Astro validates frontmatter against those schemas at build time, so an entry with missing/invalid frontmatter will fail `pnpm build`.

## Accessing the CMS

1. Start the dev server:

   ```bash
   pnpm dev
   ```

2. Open the Keystatic admin UI at `http://localhost:4321/keystatic` (adjust the port if Astro reports a different one).

3. Select a collection from the sidebar (**Blog Posts**, **Authors**, or **Site Settings**) to create or edit entries. Click **Save** to write your changes to the files on disk.

Because storage is local, the CMS only works while `pnpm dev` is running on your machine — there is no hosted editing UI.

## Writing a Blog Post

1. In the Keystatic UI, open **Blog Posts** and click **Create**.
2. Fill in the fields:

   | Field            | Notes                                                                                  |
   | ---------------- | -------------------------------------------------------------------------------------- |
   | **Title**        | Post title. Keystatic generates the URL slug (and filename) from this.                 |
   | **Published Date** | Date the post goes live.                                                             |
   | **Author**       | Pick from the Authors collection. Create the author first if they don't exist.         |
   | **Featured Post**| Checkbox. Featured posts are highlighted on the site.                                  |
   | **Featured Image** | Uploaded to `public/images/posts/` and referenced as `/images/posts/<filename>`.     |
   | **YouTube Video URL** | Optional. If set, the video is embedded in the post.                              |
   | **Categories**   | Multiselect: `painting-tips`, `industry-news`, `how-to-guides`, `product-reviews`.     |
   | **Excerpt**      | Short summary shown in post listings and used for SEO.                                 |
   | **Content**      | Rich document editor supporting formatting, dividers, links, and inline images.        |

3. Click **Save**. Keystatic writes a new markdown file to `src/content/posts/<slug>.md`.
4. Commit and push the new file (plus any uploaded images) to publish — see [Publishing workflow](#publishing-workflow).

## Adding an Author

1. Open **Authors** in the Keystatic UI and click **Create**.
2. Fill in:
   - **Name** — full name; the slug becomes the author ID referenced by posts (e.g. `john-smith`).
   - **Avatar** — uploaded to `public/images/authors/`, referenced as `/images/authors/<filename>`.
   - **Bio** — short biography, stored on the author entry (not currently rendered on the site — bylines show the author name only).
3. Save, then select the new author when writing posts.

Example (`src/content/authors/john-smith.md`):

```yaml
---
name: John Smith
avatar: /images/authors/john-smith.jpg
bio: John Smith is a professional painter with over 15 years of experience in both residential and commercial projects. He specializes in modern painting techniques and sustainable practices.
---
```

## Site Settings

The **Site Settings** collection stores global site metadata:

- **Site Title** — the slug of this field becomes the filename (e.g. `src/content/settings/site.md`).
- **Site Description** — used for SEO meta tags.
- **Social Links** — an array of `{ platform, url }` entries. Platform is one of `twitter`, `linkedin`, or `facebook`.

Example entry (`src/content/settings/site.md`):

```yaml
---
title: Paintaire Blog
description: Tips, guides, and news from the painting experts at Paintaire.
socialLinks:
  - platform: twitter
    url: https://twitter.com/paintaire
  - platform: linkedin
    url: https://linkedin.com/company/paintaire
  - platform: facebook
    url: https://facebook.com/paintaire
---
```

## Image Guidelines

| Use               | Directory               | Public path          |
| ----------------- | ----------------------- | -------------------- |
| Post featured image | `public/images/posts/` | `/images/posts/`     |
| Author avatar     | `public/images/authors/` | `/images/authors/`  |

- Upload images through the Keystatic fields whenever possible — it places them in the correct directory and writes the correct public path automatically.
- Use descriptive, lowercase, hyphenated filenames (e.g. `painting-tips.jpg`).
- Images are served statically from `public/`; they must be committed to git along with the content that references them.
- Prefer compressed formats (JPEG/WebP) to keep page weight down.

## Publishing Workflow

Because Keystatic writes to local files, publishing is just a git commit:

```bash
git status                                  # review new/changed files
git add src/content public/images           # stage content and uploaded images
git commit -m "Add post: <post title>"
git push
```

Once pushed, your normal build/deploy pipeline rebuilds the Astro site with the new content.

## Markdown / Frontmatter Reference

Posts are standard markdown files with YAML frontmatter matching the posts schema. Real example from `src/content/posts/essential-painting-tips-for-beginners.md`:

```yaml
---
title: Essential Painting Tips for Beginners
publishedDate: 2024-03-14
author: john-smith
featured: true
image: /images/posts/painting-tips.jpg
categories:
  - painting-tips
  - how-to-guides
excerpt: Master the basics of painting with these essential tips that every beginner should know. From preparation to cleanup, we've got you covered.
---

# Essential Painting Tips for Beginners

Getting started with painting can be overwhelming, but with the right knowledge and preparation, you can achieve professional-looking results.
```

Field notes:

- `title` — string; the filename is the slug derived from it (`essential-painting-tips-for-beginners.md`).
- `publishedDate` — `YYYY-MM-DD`.
- `author` — author slug (filename of an entry in `src/content/authors/` without the `.md`).
- `featured` — `true` or `false`.
- `image` — public path to the featured image in `public/images/posts/`.
- `youtubeUrl` — optional; omit the key entirely when not used.
- `categories` — YAML list; values must be one of `painting-tips`, `industry-news`, `how-to-guides`, `product-reviews`.
- `excerpt` — plain string summary.
- Everything below the second `---` is the post body (markdown), stored in the `content` field.

You can edit these files directly in a text editor as an alternative to the CMS — just keep the frontmatter keys and values consistent with both schemas (`keystatic.config.ts` for editing, `src/content/config.ts` for build-time validation).
