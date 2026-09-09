import Link from 'next/link';
import { Fragment } from 'react';
import type { Category, Nominee } from '@/lib/types';
import { highlightSegments } from '@/lib/text';
import { ChevronRight } from './Icons';
import styles from './NomineeList.module.css';

export interface NomineeItem {
  nominee: Nominee;
  category: Category;
}

/** Resalta las coincidencias de la búsqueda sin alterar el texto original. */
function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (tokens.length === 0) return <>{text}</>;
  return (
    <>
      {highlightSegments(text, tokens).map((segment, index) => (
        <Fragment key={index}>
          {segment.match ? <mark className={styles.mark}>{segment.text}</mark> : segment.text}
        </Fragment>
      ))}
    </>
  );
}

interface RowProps {
  item: NomineeItem;
  /** Número mostrado (01, 02, …). */
  position: number;
  /** Muestra el nombre de la categoría bajo el nombre. */
  showCategory?: boolean;
  tokens?: string[];
}

export function NomineeRow({ item, position, showCategory = true, tokens = [] }: RowProps) {
  const { nominee, category } = item;
  const metaLabel = category.metaLabel;

  return (
    <Link
      href={`/categoria/${category.slug}/`}
      className={`${styles.row} ${styles.rowLink}`}
      aria-label={`${nominee.name} — ${category.name}`}
    >
      <span className={styles.index} aria-hidden="true">
        {String(position).padStart(2, '0')}
      </span>

      <span className={styles.body}>
        <span className={styles.name}>
          <Highlight text={nominee.name} tokens={tokens} />
        </span>

        {(showCategory || nominee.meta) && (
          <span className={styles.meta}>
            {showCategory && <span className={styles.category}>{category.name}</span>}
            {nominee.meta && (
              <span className={styles.tag}>
                {metaLabel ? `${metaLabel}: ${nominee.meta}` : nominee.meta}
              </span>
            )}
          </span>
        )}
      </span>

      <ChevronRight size={16} className={styles.chevron} />
    </Link>
  );
}

interface ListProps {
  items: NomineeItem[];
  showCategory?: boolean;
  tokens?: string[];
  /** Desplaza la numeración (para listas paginadas). */
  startAt?: number;
}

export default function NomineeList({
  items,
  showCategory = true,
  tokens = [],
  startAt = 1,
}: ListProps) {
  return (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li key={item.nominee.id}>
          <NomineeRow
            item={item}
            position={startAt + index}
            showCategory={showCategory}
            tokens={tokens}
          />
        </li>
      ))}
    </ul>
  );
}

export function LoadMore({
  shown,
  total,
  onLoadMore,
}: {
  shown: number;
  total: number;
  onLoadMore: () => void;
}) {
  if (shown >= total) return null;
  return (
    <div className={styles.more}>
      <button type="button" className="btn btn--ghost" onClick={onLoadMore}>
        Cargar más
      </button>
      <p className={styles.moreInfo} aria-live="polite">
        Mostrando {shown} de {total}
      </p>
    </div>
  );
}
