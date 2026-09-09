'use client';

import Link from 'next/link';
import { Fragment, useMemo, useState } from 'react';
import { groupByName, searchEntries } from '@/lib/search';
import { highlightSegments, tokenize } from '@/lib/text';
import SearchBar from './SearchBar';
import { ChevronRight } from './Icons';
import styles from './HomeSearch.module.css';

const QUICK_LIMIT = 6;

/** Atajos que ayudan a entender qué se puede buscar. */
const SHORTCUTS = ['Teleamazonas', 'Instagram', 'Deportes', 'Ecuavisa', 'YouTube'];

/**
 * Buscador compacto de la portada: adelanta resultados y remite a /buscar
 * para la lista completa.
 */
export default function HomeSearch() {
  const [query, setQuery] = useState('');
  const trimmed = query.trim();

  const tokens = useMemo(() => tokenize(query), [query]);

  const { preview, total } = useMemo(() => {
    if (!trimmed) return { preview: [], total: 0 };
    const grouped = groupByName(searchEntries(query));
    return { preview: grouped.slice(0, QUICK_LIMIT), total: grouped.length };
  }, [query, trimmed]);

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />

      {!trimmed && (
        <div className={styles.shortcuts}>
          {SHORTCUTS.map((shortcut) => (
            <button
              key={shortcut}
              type="button"
              className={styles.shortcut}
              onClick={() => setQuery(shortcut)}
            >
              {shortcut}
            </button>
          ))}
        </div>
      )}

      {trimmed && (
        <div className={styles.results}>
          {preview.length === 0 ? (
            <p className={styles.emptyRow}>
              No encontramos resultados para «{trimmed}». Intenta con otro nombre, canal, programa o
              cuenta.
            </p>
          ) : (
            <>
              {preview.map((result) => (
                <Link
                  key={result.key}
                  href={`/categoria/${result.entries[0].category.slug}/`}
                  className={styles.item}
                >
                  <span className={styles.body}>
                    <span className={styles.name}>
                      {highlightSegments(result.name, tokens).map((segment, index) => (
                        <Fragment key={index}>
                          {segment.match ? (
                            <mark className={styles.mark}>{segment.text}</mark>
                          ) : (
                            segment.text
                          )}
                        </Fragment>
                      ))}
                    </span>
                    <span className={styles.categories}>
                      {result.entries.map((entry) => entry.category.name).join(' · ')}
                    </span>
                  </span>
                  <ChevronRight size={15} className={styles.chevron} />
                </Link>
              ))}

              <div className={styles.footerRow}>
                <span>
                  {total} {total === 1 ? 'coincidencia' : 'coincidencias'} en todas las categorías
                </span>
                <Link href={`/buscar/?q=${encodeURIComponent(trimmed)}`} className={styles.footerLink}>
                  Ver todo
                  <ChevronRight size={13} />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
