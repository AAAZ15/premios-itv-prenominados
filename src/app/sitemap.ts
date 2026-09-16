import type { MetadataRoute } from 'next';
import { categories } from '@/data';
import { NOINDEX, SITE } from '@/data/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // Un sitemap de una vista previa no indexable sólo confunde a los buscadores.
  if (NOINDEX) return [];

  const now = new Date();
  // El host va en minúsculas: GitHub lo entrega con el usuario capitalizado y
  // eso no coincidía con el canonical.
  const base = SITE.url.replace(/^(https?:\/\/)([^/]+)/, (_, p, h) => p + h.toLowerCase());

  // El portal es una página única; las secciones son anclajes de la misma URL.
  const home = {
    url: `${base}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 1,
  };

  const categoryRoutes = categories.map((category) => ({
    url: `${base}/categoria/${category.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [home, ...categoryRoutes];
}
