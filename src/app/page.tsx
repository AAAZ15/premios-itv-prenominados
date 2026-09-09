import type { Metadata } from 'next';
import { Suspense } from 'react';
import Hero from '@/components/Hero';
import SectionHeading from '@/components/SectionHeading';
import DirectoryWithParams from '@/components/DirectoryWithParams';
import CategoryAccordion from '@/components/CategoryAccordion';
import Timeline from '@/components/Timeline';
import { categories, getDisciplineSummary, totals } from '@/data';
import { SITE } from '@/data/config';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: `Prenominados oficiales | ${SITE.name} ${SITE.edition}`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

/**
 * Página única del portal. Todo vive aquí y el menú desplaza entre secciones:
 * #inicio · #prenominados · #categorias · #fechas
 */
export default function HomePage() {
  const disciplines = getDisciplineSummary();
  // De mayor a menor: las primeras seis se ven de entrada en el acordeón y el
  // resto se revela con la flecha, sin que las visibles cambien de sitio.
  const byVolume = [...categories].sort((a, b) => b.count - a.count);

  return (
    <>
      {/* ------------------------------ Inicio ---------------------------- */}
      <section id="inicio">
        <div className="container">
          <Hero />
        </div>
      </section>

      {/* --------------------------- Prenominados ------------------------- */}
      <section id="prenominados" className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Buscador global"
            title="Busca a tu prenominado"
            id="prenominados-title"
            lede={`¿Está tu nombre en la lista? Búscalo entre los ${totals.nominees} prenominados: una sola búsqueda recorre las ${totals.categories} categorías a la vez.`}
          />
          <Suspense fallback={null}>
            <DirectoryWithParams />
          </Suspense>
        </div>
      </section>

      {/* ---------------------------- Categorías -------------------------- */}
      <section id="categorias" className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Explora por categoría"
            title="Categorías"
            id="categorias-title"
            lede={`${totals.categories} categorías oficiales con ${totals.nominees} prenominados. Toca una categoría para ver su lista completa aquí mismo.`}
          />

          <ul className={styles.disciplines}>
            {disciplines.map((group) => (
              <li key={group.discipline} className={styles.discipline}>
                <span>
                  <span className={styles.disciplineName}>{group.discipline}</span>
                  <span className={styles.disciplineMeta}>
                    {group.categories} {group.categories === 1 ? 'categoría' : 'categorías'}
                  </span>
                </span>
                <span className={styles.disciplineCount} aria-hidden="true">
                  {group.nominees}
                </span>
              </li>
            ))}
          </ul>

          <CategoryAccordion categories={byVolume} />
        </div>
      </section>

      {/* ------------------------------ Fechas ---------------------------- */}
      <section id="fechas" className="section">
        <div className="container container--narrow">
          <SectionHeading
            eyebrow="Cronograma oficial"
            title="Fechas importantes"
            id="fechas-title"
            lede="Las etapas del proceso de votación y la fecha del gran evento."
          />
          <Timeline />
        </div>
      </section>
    </>
  );
}
