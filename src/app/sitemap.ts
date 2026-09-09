import type { MetadataRoute } from 'next';
import { categories } from '@/data';
import { SITE } from '@/data/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ['/', '/prenominados/', '/categorias/', '/buscar/', '/fechas/'].map(
    (route) => ({
      url: `${SITE.url}${route}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: route === '/' ? 1 : 0.8,
    })
  );

  const categoryRoutes = categories.map((category) => ({
    url: `${SITE.url}/categoria/${category.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes];
}
