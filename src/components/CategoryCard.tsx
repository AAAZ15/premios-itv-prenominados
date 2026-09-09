import Link from 'next/link';
import type { Category } from '@/lib/types';
import { plural } from '@/lib/text';
import { ChevronRight, FilmIcon, GridIcon, ListIcon, SparkIcon, StarIcon } from './Icons';
import styles from './CategoryCard.module.css';

/** Icono según la disciplina — refuerza el reconocimiento visual. */
function DisciplineIcon({ discipline }: { discipline: Category['discipline'] }) {
  switch (discipline) {
    case 'Noticias':
      return <ListIcon size={20} />;
    case 'Deportes':
      return <StarIcon size={20} />;
    case 'Variedades':
      return <SparkIcon size={20} />;
    case 'Dramáticos':
      return <FilmIcon size={20} />;
    default:
      return <GridIcon size={20} />;
  }
}

export function CategoryCard({ category }: { category: Category }) {
  const label = plural(category.count, 'Prenominado', 'Prenominados');

  return (
    <Link
      href={`/categoria/${category.slug}/`}
      className={styles.card}
      aria-label={`${category.name} — ${category.count} ${label.toLowerCase()}`}
    >
      <span className={styles.icon} aria-hidden="true">
        <DisciplineIcon discipline={category.discipline} />
      </span>

      <span className={styles.body}>
        <span className={styles.name}>{category.name}</span>
        <span className={styles.discipline}>
          {category.discipline}
          {/* En pantallas estrechas el conteo va aquí, para que el título
              disponga de todo el ancho de la tarjeta. */}
          <span className={styles.inlineCount}>
            {' · '}
            <b className={styles.inlineCountValue}>{category.count}</b> {label}
          </span>
        </span>
      </span>

      <span className={styles.side}>
        <span className={styles.count} aria-hidden="true">
          <span className={styles.countValue}>{category.count}</span>
          <span className={styles.countLabel}>{label}</span>
        </span>
        <ChevronRight size={18} className={styles.chevron} />
      </span>
    </Link>
  );
}

export function CategoryGrid({
  categories,
  id,
  /** Índice a partir del cual las tarjetas aparecen con animación escalonada. */
  revealFrom,
}: {
  categories: Category[];
  id?: string;
  revealFrom?: number;
}) {
  return (
    <ul className={styles.grid} id={id}>
      {categories.map((category, index) => {
        const reveal = revealFrom !== undefined && index >= revealFrom;
        return (
          <li
            key={category.id}
            className={reveal ? styles.reveal : undefined}
            style={
              reveal
                ? ({ '--reveal-delay': `${Math.min(index - revealFrom, 8) * 45}ms` } as React.CSSProperties)
                : undefined
            }
          >
            <CategoryCard category={category} />
          </li>
        );
      })}
    </ul>
  );
}
