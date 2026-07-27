import { getEntry } from 'astro:content';

export interface SiteSettings {
  title: string;
  description: string;
  socialLinks: { platform: 'twitter' | 'linkedin' | 'facebook'; url: string }[];
}

const fallback: SiteSettings = {
  title: 'Paintaire',
  description:
    "Paintaire's official blog for painting tips, industry news, and expert insights",
  socialLinks: [],
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const entry =
    (await getEntry('settings', 'paintaire')) ?? (await getEntry('settings', 'site'));
  if (!entry) return fallback;
  return {
    title: entry.data.title || fallback.title,
    description: entry.data.description || fallback.description,
    socialLinks: entry.data.socialLinks,
  };
}
