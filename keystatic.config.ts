import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        publishedDate: fields.date({ label: 'Published Date' }),
        author: fields.relationship({
          label: 'Author',
          collection: 'authors',
        }),
        featured: fields.checkbox({ label: 'Featured Post', defaultValue: false }),
        image: fields.image({
          label: 'Featured Image',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
        }),
        youtubeUrl: fields.text({ 
          label: 'YouTube Video URL',
          description: 'Optional: Add a YouTube video URL to embed in the post',
        }),
        categories: fields.multiselect({
          label: 'Categories',
          options: [
            { label: 'Painting Tips', value: 'painting-tips' },
            { label: 'Industry News', value: 'industry-news' },
            { label: 'How-to Guides', value: 'how-to-guides' },
            { label: 'Product Reviews', value: 'product-reviews' },
          ],
        }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'src/content/authors/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        avatar: fields.image({
          label: 'Avatar',
          directory: 'public/images/authors',
          publicPath: '/images/authors/',
        }),
        bio: fields.text({ label: 'Bio', multiline: true }),
      },
    }),
    settings: collection({
      label: 'Site Settings',
      path: 'src/content/settings/*',
      slugField: 'title',
      schema: {
        title: fields.slug({ name: { label: 'Site Title' } }),
        description: fields.text({ label: 'Site Description', multiline: true }),
        socialLinks: fields.array(
          fields.object({
            platform: fields.select({
              label: 'Platform',
              options: [
                { label: 'Twitter', value: 'twitter' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Facebook', value: 'facebook' },
              ],
            }),
            url: fields.text({ label: 'URL' }),
          }),
          { label: 'Social Links' }
        ),
      },
    }),
  },
});