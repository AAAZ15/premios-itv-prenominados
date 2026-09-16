import type { MetadataRoute } from 'next';
import { NOINDEX, SITE } from '@/data/config';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  // En vista previa se bloquea todo: es la única vía que GitHub Pages respeta,
  // porque ignora el archivo `_headers` de Netlify.
  if (NOINDEX) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
