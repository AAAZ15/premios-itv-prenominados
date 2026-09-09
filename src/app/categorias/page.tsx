import type { Metadata } from 'next';
import SectionHeading from '@/components/SectionHeading';
import CategoryAccordion from '@/components/CategoryAccordion';
import { getCategoriesByDiscipline, totals } from '@/data';
import { SITE } from '@/data/config';

export const metadata: Metadata = {
  title: 'Categorías',
  description: `Las ${totals.categories} categorías oficiales de los ${SITE.name} ${SITE.edition} y la cantidad de prenominados de cada una.`,
  alternates: { canonical: '/categorias/' },
  openGraph: {
    title: `Categorías | ${SITE.name} ${SITE.edition}`,
    description: `Las ${totals.categories} categorías oficiales y sus prenominados.`,
    url: `${SITE.url}/categorias/`,
  },
};

export default function CategoriasPage() {
  return (
    <div className="container container--narrow section">
      <SectionHeading
        as="h1"
        eyebrow={`${SITE.name} · ${SITE.edition}`}
        title="Categorías"
        lede={`${totals.categories} categorías oficiales que reúnen ${totals.nominees} prenominados. Toca una categoría para desplegar su lista completa aquí mismo.`}
      />

      <CategoryAccordion groups={getCategoriesByDiscipline()} />
    </div>
  );
}
