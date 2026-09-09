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
        <span className={styles.discipline}>{category.discipline}</span>
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

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <ul className={styles.grid}>
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryCard category={category} />
        </li>
      ))}
    </ul>
  );
}

export function CategoryGroupTitle({ children }: { children: React.ReactNode }) {
  return <h3 className={styles.groupTitle}>{children}</h3>;
}
