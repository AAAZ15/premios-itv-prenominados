import Link from 'next/link';
import { Fragment } from 'react';
import type { SearchResult } from '@/lib/types';
import { highlightSegments } from '@/lib/text';
import { ChevronRight } from './Icons';
import styles from './SearchResults.module.css';

/**
 * Resultados agrupados por nombre: cada persona, canal, programa o cuenta
 * aparece una sola vez y muestra TODAS las categorías en las que está
 * prenominada. Cada categoría es un enlace directo a su vista.
 */
export default function SearchResults({
  results,
  tokens,
  startAt = 1,
}: {
  results: SearchResult[];
  tokens: string[];
  startAt?: number;
}) {
  return (
    <ul className={styles.results}>
      {results.map((result, index) => (
        <li key={result.key} className={styles.card}>
          <div className={styles.head}>
            <span className={styles.index} aria-hidden="true">
              {String(startAt + index).padStart(2, '0')}
            </span>
            <h3 className={styles.name}>
              {highlightSegments(result.name, tokens).map((segment, i) => (
                <Fragment key={i}>
                  {segment.match ? (
                    <mark className={styles.mark}>{segment.text}</mark>
                  ) : (
                    segment.text
                  )}
                </Fragment>
              ))}
            </h3>
          </div>

          <p className={styles.label}>
            {result.entries.length === 1 ? 'Categoría' : `Categorías (${result.entries.length})`}
          </p>

          <div className={styles.tags}>
            {result.entries.map(({ nominee, category }) => (
              <Link key={nominee.id} href={`/categoria/${category.slug}/`} className={styles.tag}>
                {category.name}
                {nominee.meta && <span className={styles.tagMeta}>· {nominee.meta}</span>}
                <ChevronRight size={13} className={styles.tagChevron} />
              </Link>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
