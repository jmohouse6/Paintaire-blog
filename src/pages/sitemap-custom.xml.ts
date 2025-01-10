import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const baseUrl = 'https://paintaire.com';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');
  const authors = await getCollection('authors');

  // Sort posts by date, newest first
  const sortedPosts = posts.sort((a, b) => 
    b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf()
  );

  // Create XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Blog posts -->
  ${sortedPosts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${formatDate(post.data.publishedDate)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}

  <!-- Author pages -->
  ${authors.map(author => `
  <url>
    <loc>${baseUrl}/authors/${author.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  `).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};