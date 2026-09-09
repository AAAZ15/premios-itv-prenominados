import type { Metadata } from 'next';
import { Suspense } from 'react';
import SectionHeading from '@/components/SectionHeading';
import DirectoryWithParams from '@/components/DirectoryWithParams';
import { totals } from '@/data';
import { SITE } from '@/data/config';

export const metadata: Metadata = {
  title: 'Prenominados',
  description: `Directorio completo de los ${totals.nominees} prenominados de los ${SITE.name} ${SITE.edition}, con buscador y filtro por categoría.`,
  alternates: { canonical: '/prenominados/' },
  openGraph: {
    title: `Prenominados | ${SITE.name} ${SITE.edition}`,
    description: `Directorio completo de ${totals.nominees} prenominados en ${totals.categories} categorías.`,
    url: `${SITE.url}/prenominados/`,
  },
};

export default function PrenominadosPage() {
  return (
    <div className="container section">
      <SectionHeading
        as="h1"
        eyebrow={`${SITE.name} · ${SITE.edition}`}
        title="Prenominados"
        lede={`${totals.nominees} registros en ${totals.categories} categorías. Busca por nombre, canal, programa o cuenta, o filtra por categoría.`}
        action={{ href: '/categorias/', label: 'Ver categorías' }}
      />

      <Suspense fallback={null}>
        <DirectoryWithParams />
      </Suspense>
    </div>
  );
}
