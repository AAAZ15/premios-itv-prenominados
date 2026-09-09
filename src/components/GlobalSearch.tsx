'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { categories } from '@/data';
import { PAGE_SIZE } from '@/data/config';
import { searchEntries, groupByName } from '@/lib/search';
import { tokenize } from '@/lib/text';
import SearchBar, { CategoryFilter, ControlsBar, ResultsSummary } from './SearchBar';
import SearchResults from './SearchResults';
import EmptySearchState from './EmptySearchState';
import { LoadMore } from './NomineeList';

/**
 * Buscador global de la página /buscar.
 * Agrupa por nombre para responder «¿en qué categorías aparece esta persona?».
 */
export default function GlobalSearch({
  initialQuery = '',
  initialCategoryId = '',
}: {
  initialQuery?: string;
  initialCategoryId?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, categoryId]);

  // Igual que en el directorio: sólo se escribe la URL cuando cambia, porque
  // `history.replaceState` lo intercepta el router de Next.
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (categoryId) params.set('categoria', categoryId);
    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ''}`;
    if (next === `${window.location.pathname}${window.location.search}`) return;
    const id = window.setTimeout(() => window.history.replaceState(null, '', next), 350);
    return () => window.clearTimeout(id);
  }, [query, categoryId]);

  const tokens = useMemo(() => tokenize(query), [query]);

  const grouped = useMemo(
    () => groupByName(searchEntries(query, { categoryId: categoryId || null })),
    [query, categoryId]
  );

  const shown = useMemo(() => grouped.slice(0, visible), [grouped, visible]);

  const reset = useCallback(() => {
    setQuery('');
    setCategoryId('');
  }, []);

  const trimmed = query.trim();
  const hasFilters = Boolean(trimmed || categoryId);

  return (
    <div>
      <SearchBar
        value={query}
        onChange={setQuery}
        autoFocus
        hint="Escribe un nombre, apellido, canal, programa o cuenta. Se busca en las
          categorías completas."
      />

      <ControlsBar>
        <div />
        <CategoryFilter categories={categories} value={categoryId} onChange={setCategoryId} />
      </ControlsBar>

      <ResultsSummary
        count={grouped.length}
        label={trimmed ? 'coincidencias encontradas' : 'nombres en el directorio'}
        extra={
          hasFilters ? (
            <button type="button" className="pill" onClick={reset}>
              Limpiar filtros
            </button>
          ) : undefined
        }
      />

      {grouped.length === 0 ? (
        <EmptySearchState query={trimmed || undefined} onReset={reset} />
      ) : (
        <>
          <SearchResults results={shown} tokens={tokens} />
          <LoadMore
            shown={shown.length}
            total={grouped.length}
            onLoadMore={() => setVisible((value) => value + PAGE_SIZE)}
          />
        </>
      )}
    </div>
  );
}
