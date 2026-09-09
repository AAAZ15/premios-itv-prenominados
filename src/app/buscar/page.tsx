import type { Metadata } from 'next';
import { Suspense } from 'react';
import SectionHeading from '@/components/SectionHeading';
import GlobalSearchWithParams from '@/components/GlobalSearchWithParams';
import { totals } from '@/data';
import { SITE } from '@/data/config';

export const metadata: Metadata = {
  title: 'Buscar prenominados',
  description: `Busca cualquier persona, canal, programa, medio o cuenta digital entre los ${totals.nominees} prenominados de los ${SITE.name} ${SITE.edition}.`,
  alternates: { canonical: '/buscar/' },
  openGraph: {
    title: `Buscar prenominados | ${SITE.name} ${SITE.edition}`,
    description: 'Busca en todas las categorías al mismo tiempo.',
    url: `${SITE.url}/buscar/`,
  },
};

export default function BuscarPage() {
  return (
    <div className="container container--narrow section">
      <SectionHeading
        as="h1"
        eyebrow="Buscador global"
        title="Busca a tu prenominado"
        lede={`Una sola búsqueda recorre las ${totals.categories} categorías. Si alguien aparece en más de una, verás todas sus categorías juntas.`}
      />

      <Suspense fallback={null}>
        <GlobalSearchWithParams />
      </Suspense>
    </div>
  );
}
