import Link from 'next/link';
import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import SectionHeading from '@/components/SectionHeading';
import CategoryShowcase from '@/components/CategoryShowcase';
import HomeSearch from '@/components/HomeSearch';
import Timeline from '@/components/Timeline';
import { categories, getDisciplineSummary, totals } from '@/data';
import { SITE } from '@/data/config';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: `Prenominados oficiales | ${SITE.name} ${SITE.edition}`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const disciplines = getDisciplineSummary();
  // Ordenadas de mayor a menor: las primeras seis se ven de entrada y el resto
  // se revela con el botón, sin que las ya visibles cambien de sitio.
  const byVolume = [...categories].sort((a, b) => b.count - a.count);

  return (
    <>
      <div className="container">
        <Hero />
      </div>

      {/* ---------------------------- Buscador ---------------------------- */}
      <section className="section" aria-labelledby="buscador-title">
        <div className="container container--narrow">
          <div className={styles.searchPanel}>
            <h2 className={styles.searchTitle} id="buscador-title">
              Busca a tu prenominado
            </h2>
            <p className={styles.searchLede}>
              Escribe un nombre, canal, programa o cuenta digital. Buscamos en las{' '}
              {totals.categories} categorías al mismo tiempo.
            </p>
            <HomeSearch />
          </div>
        </div>
      </section>

      {/* --------------------------- Disciplinas -------------------------- */}
      <section className="section" aria-labelledby="disciplinas-title">
        <div className="container">
          <SectionHeading
            eyebrow="Resumen por disciplina"
            title="Categorías oficiales"
            id="disciplinas-title"
            lede={`${totals.categories} categorías y ${totals.nominees} registros tomados de la lista oficial de prenominados.`}
            action={{ href: '/categorias/', label: 'Ver todas' }}
          />

          <ul className={styles.disciplines}>
            {disciplines.map((group) => (
              <li key={group.discipline}>
                <Link
                  href={`/categorias/#${group.discipline.toLowerCase()}`}
                  className={styles.discipline}
                >
                  <span>
                    <span className={styles.disciplineName}>{group.discipline}</span>
                    <span className={styles.disciplineMeta}>
                      {group.categories} {group.categories === 1 ? 'categoría' : 'categorías'} ·{' '}
                      {group.nominees} prenominados
                    </span>
                  </span>
                  <span className={styles.disciplineCount} aria-hidden="true">
                    {group.nominees}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------ Categorías destacadas ------------------- */}
      <section className="section" aria-labelledby="destacadas-title">
        <div className="container">
          <SectionHeading
            eyebrow={`${totals.categories} categorías oficiales`}
            title="Explora por categoría"
            id="destacadas-title"
            lede="Ordenadas por número de prenominados. Cada tarjeta abre la lista completa de esa categoría."
          />
          <CategoryShowcase categories={byVolume} />
        </div>
      </section>

      {/* ----------------------------- Fechas ----------------------------- */}
      <section className="section" aria-labelledby="fechas-title">
        <div className="container">
          <div className={styles.datesPreview}>
            <SectionHeading
              eyebrow="Cronograma"
              title="Fechas importantes"
              id="fechas-title"
              lede="Las etapas del proceso de votación y la fecha del gran evento."
              action={{ href: '/fechas/', label: 'Ver cronograma' }}
            />
            <Timeline />
          </div>
        </div>
      </section>
    </>
  );
}
