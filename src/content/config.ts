import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishedDate: z.date(),
    author: z.string(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    youtubeUrl: z.string().optional(),
    categories: z.array(
      z.enum(['painting-tips', 'industry-news', 'how-to-guides', 'product-reviews'])
    ),
    excerpt: z.string(),
  }),
});

const authors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
  }),
});

export const collections = { posts, authors };
