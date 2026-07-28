import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';

export async function GET(context) {
  const posts = await getCollection('posts');
  const authors = await getCollection('authors');
  const authorNames = new Map(authors.map((a) => [a.slug, a.data.name]));
  
  // Sort posts by date, newest first
  const sortedPosts = posts.sort((a, b) => 
    b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf()
  );
  
  return rss({
    title: 'Paintaire Blog',
    description: 'Professional painting insights, industry news, and expert tips',
    site: context.site,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    items: sortedPosts.map((post) => {
      const postUrl = new URL(`/blog/${post.slug}/`, context.site).toString();
      return {
        title: post.data.title,
        pubDate: post.data.publishedDate,
        description: post.data.excerpt,
        link: postUrl,
        customData: `<guid isPermaLink="true">${postUrl}</guid>`,
        content: sanitizeHtml(marked.parse(post.body)),
        categories: post.data.categories,
        author: authorNames.get(post.data.author) || post.data.author
      };
    }),
    customData: `<language>en-us</language><atom:link rel="self" type="application/rss+xml" href="${new URL('/rss.xml', context.site).toString()}"/>`,
  });
}