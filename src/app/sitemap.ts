import type { MetadataRoute } from 'next';
import { categories } from '@/data';
import { SITE } from '@/data/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // El portal es una página única; las secciones son anclajes de la misma URL.
  const home = {
    url: `${SITE.url}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 1,
  };

  const categoryRoutes = categories.map((category) => ({
    url: `${SITE.url}/categoria/${category.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [home, ...categoryRoutes];
}
