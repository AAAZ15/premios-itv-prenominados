import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import NomineeList from '@/components/NomineeList';
import { ChevronLeft, ChevronRight, GridIcon } from '@/components/Icons';
import { categories, getCategory, getCategoryNeighbours, getNominees } from '@/data';
import { SITE } from '@/data/config';
import { plural } from '@/lib/text';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Genera las 18 rutas estáticas, una por categoría del Excel. */
export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: 'Categoría no encontrada' };

  const title = category.name
    .toLocaleLowerCase('es')
    .replace(/(^|[\s(/])([a-záéíóúñ])/g, (_, prefix: string, letter: string) => prefix + letter.toLocaleUpperCase('es'));

  const description = `${category.count} ${plural(
    category.count,
    'prenominado',
    'prenominados'
  ).toLowerCase()} en la categoría ${category.name} de los ${SITE.name} ${SITE.edition}.`;

  return {
    title,
    description,
    alternates: { canonical: `/categoria/${category.slug}/` },
    openGraph: {
      title: `${title} | ${SITE.name} ${SITE.edition}`,
      description,
      url: `${SITE.url}/categoria/${category.slug}/`,
    },
  };
}

export default async function CategoriaPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const nominees = getNominees(category.id);
  const { previous, next } = getCategoryNeighbours(category.slug);
  const items = nominees.map((nominee) => ({ nominee, category }));
  const label = plural(category.count, 'Prenominado', 'Prenominados');

  return (
    <div className="container section">
      <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
        <Link href="/">Inicio</Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">
          /
        </span>
        <Link href="/categorias/">Categorías</Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">
          /
        </span>
        <span className={styles.breadcrumbCurrent} aria-current="page">
          {category.name}
        </span>
      </nav>

      <header className={styles.head}>
        <p className={styles.edition}>
          {SITE.name} · {SITE.edition}
        </p>
        <h1 className={styles.title}>{category.name}</h1>
        <div className={styles.badges}>
          <span className="pill pill--accent">
            {category.count} {label}
          </span>
          <span className="pill">{category.discipline}</span>
          {category.metaLabel && <span className="pill">Incluye {category.metaLabel}</span>}
        </div>
      </header>

      <section className={styles.listSection} aria-labelledby="listado-title">
        <div className={styles.listHead}>
          <h2 className={`section-title ${styles.listTitle}`} id="listado-title">
            Listado de prenominados
          </h2>
          <p className={styles.listNote}>Orden según la lista oficial.</p>
        </div>

        <NomineeList items={items} showCategory={false} />
      </section>

      <nav className={styles.pager} aria-label="Navegación entre categorías">
        {previous ? (
          <Link href={`/categoria/${previous.slug}/`} className={styles.pagerLink}>
            <ChevronLeft size={18} className={styles.pagerIcon} />
            <span className={styles.pagerBody}>
              <span className={styles.pagerLabel}>Categoría anterior</span>
              <span className={styles.pagerName}>{previous.name}</span>
            </span>
          </Link>
        ) : (
          <span className={styles.pagerEmpty} />
        )}

        <Link href="/categorias/" className={styles.pagerCenter}>
          <GridIcon size={15} />
          Volver a categorías
        </Link>

        {next ? (
          <Link href={`/categoria/${next.slug}/`} className={`${styles.pagerLink} ${styles.pagerNext}`}>
            <span className={styles.pagerBody}>
              <span className={styles.pagerLabel}>Siguiente categoría</span>
              <span className={styles.pagerName}>{next.name}</span>
            </span>
            <ChevronRight size={18} className={styles.pagerIcon} />
          </Link>
        ) : (
          <span className={styles.pagerEmpty} />
        )}
      </nav>
    </div>
  );
}
