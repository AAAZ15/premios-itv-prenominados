import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import NomineeList from '@/components/NomineeList';
import { ChevronLeft, ChevronRight, GridIcon } from '@/components/Icons';
import { categories, getCategory, getCategoryNeighbours, getNominees } from '@/data';
import { CATEGORY_HASH_PREFIX, SITE } from '@/data/config';
import { NOMINATION_REQUIREMENT } from '@/data/descriptions';
import { plural } from '@/lib/text';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Marcas cuya grafía no sigue la regla de «inicial mayúscula»: sin esto,
 * «MEJOR TIKTOKER» acababa como «Mejor Tiktoker» en los resultados de Google.
 */
const GRAFIA_PROPIA: Record<string, string> = {
  tiktoker: 'TikToker',
  tiktok: 'TikTok',
  itv: 'ITV',
  instagram: 'Instagram',
  youtube: 'YouTube',
};

/** Conectores que en español van en minúscula salvo al principio del título. */
const MINUSCULAS = new Set([
  'de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'o', 'u', 'a', 'en', 'con',
  'para', 'por', 'al',
]);

/**
 * El nombre de la categoría, que viene en MAYÚSCULAS, pasado a título legible:
 * «MEJOR CREADOR DE CONTENIDO DE INSTAGRAM» → «Mejor Creador de Contenido de
 * Instagram».
 */
function toTitleCase(name: string): string {
  let primera = true;
  return name.toLocaleLowerCase('es').replace(/[\p{L}\p{N}]+/gu, (palabra) => {
    const propia = GRAFIA_PROPIA[palabra];
    if (propia) {
      primera = false;
      return propia;
    }
    const enMinuscula = !primera && MINUSCULAS.has(palabra);
    primera = false;
    return enMinuscula
      ? palabra
      : palabra.charAt(0).toLocaleUpperCase('es') + palabra.slice(1);
  });
}

/** Genera las 18 rutas estáticas, una por categoría del Excel. */
export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: 'Categoría no encontrada' };

  const title = toTitleCase(category.name);

  // La descripción oficial de ITV, precedida del dato que la sitúa: cuántos
  // prenominados y de qué edición. Google recorta a ~155 caracteres, así que
  // lo concreto va primero.
  const description = `${category.count} ${plural(
    category.count,
    'prenominado',
    'prenominados'
  )} en ${title} de los ${SITE.name} ${SITE.year}. ${category.description}`;

  return {
    title: `Prenominados de ${title}`,
    description,
    alternates: { canonical: `/categoria/${category.slug}/` },
    openGraph: {
      title: `Prenominados de ${title} | ${SITE.name} ${SITE.year}`,
      description,
      url: `${SITE.url}/categoria/${category.slug}/`,
      type: 'article',
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
        <Link href="/#categorias">Categorías</Link>
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
            {category.count === 0 ? 'Próximamente' : `${category.count} ${label}`}
          </span>
          <span className="pill">{category.discipline}</span>
          {category.metaLabel && <span className="pill">Incluye {category.metaLabel}</span>}
        </div>
      </header>

      <p className={styles.description}>{category.description}</p>

      <section className={styles.listSection} aria-labelledby="listado-title">
        <div className={styles.listHead}>
          <h2 className={`section-title ${styles.listTitle}`} id="listado-title">
            Listado de prenominados
          </h2>
          {items.length > 0 && (
            <p className={styles.listNote}>Orden según la lista oficial.</p>
          )}
        </div>

        {items.length === 0 ? (
          <p className={styles.empty}>
            Todavía no hay prenominados publicados en esta categoría.
          </p>
        ) : (
          <NomineeList items={items} showCategory={false} />
        )}
      </section>

      <p className={styles.requirement}>{NOMINATION_REQUIREMENT}</p>

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

        <Link
          href={`/#${CATEGORY_HASH_PREFIX}${category.slug}`}
          className={styles.pagerCenter}
        >
          <GridIcon size={15} />
          Ver en el portal
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
