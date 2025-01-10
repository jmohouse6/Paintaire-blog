import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';

export async function GET(context) {
  const posts = await getCollection('posts');
  
  // Sort posts by date, newest first
  const sortedPosts = posts.sort((a, b) => 
    b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf()
  );
  
  return rss({
    title: 'Paintaire Blog',
    description: 'Professional painting insights, industry news, and expert tips',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedDate,
      description: post.data.excerpt,
      link: `/blog/${post.slug}/`,
      content: sanitizeHtml(marked.parse(post.body)),
      categories: post.data.categories,
      author: post.data.author
    })),
    customData: `<language>en-us</language>`,
  });
}