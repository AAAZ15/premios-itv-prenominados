'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { categories } from '@/data';
import { PAGE_SIZE } from '@/data/config';
import { searchEntries } from '@/lib/search';
import { tokenize } from '@/lib/text';
import NomineeList, { LoadMore } from './NomineeList';
import SearchBar, { CategoryFilter, ControlsBar, ResultsSummary } from './SearchBar';
import EmptySearchState from './EmptySearchState';
import IdleHint from './IdleHint';

/** Construye la URL compartible a partir del estado de los filtros. */
function buildUrl(query: string, categoryId: string): string {
  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query.trim());
  if (categoryId) params.set('categoria', categoryId);
  const search = params.toString();
  // Se conserva el hash: en la página única marca la sección o la categoría.
  return `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
}

interface Props {
  /** Consulta inicial (por ejemplo desde ?q= en la URL). */
  initialQuery?: string;
  /** Categoría preseleccionada. */
  initialCategoryId?: string;
  /** Sincroniza ?q= y ?categoria= en la barra de direcciones. */
  syncUrl?: boolean;
  autoFocus?: boolean;
}

/**
 * Directorio completo de prenominados.
 *
 * La búsqueda recorre SIEMPRE toda la base de datos; el filtro por categoría
 * se aplica sobre ese resultado, de modo que ambos controles se combinan.
 * El listado se carga de forma progresiva para mantener el render ligero
 * incluso con cientos o miles de registros.
 */
export default function Directory({
  initialQuery = '',
  initialCategoryId = '',
  syncUrl = false,
  autoFocus = false,
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Al cambiar los filtros se vuelve al inicio del listado.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, categoryId]);

  // Mantiene la URL compartible. Se escribe sólo cuando cambia de verdad:
  // `history.replaceState` está interceptado por el router de Next, y llamarlo
  // en cada render reinicia el estado de este componente.
  useEffect(() => {
    if (!syncUrl) return;
    const next = buildUrl(query, categoryId);
    if (next === `${window.location.pathname}${window.location.search}${window.location.hash}`)
      return;
    const id = window.setTimeout(() => window.history.replaceState(null, '', next), 350);
    return () => window.clearTimeout(id);
  }, [query, categoryId, syncUrl]);

  const tokens = useMemo(() => tokenize(query), [query]);

  /**
   * Sin búsqueda ni filtro NO se lista nada: volcar los 600 registros de golpe
   * abrumaba la página. Los prenominados se consultan por categoría, en el
   * acordeón, o buscando aquí.
   */
  const active = Boolean(query.trim() || categoryId);

  const results = useMemo(
    () => (active ? searchEntries(query, { categoryId: categoryId || null }) : []),
    [active, query, categoryId]
  );

  const items = useMemo(() => results.slice(0, visible), [results, visible]);

  const reset = useCallback(() => {
    setQuery('');
    setCategoryId('');
  }, []);

  const activeCategory = categoryId ? categories.find((c) => c.id === categoryId) : undefined;

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} autoFocus={autoFocus} />

      <ControlsBar>
        <div />
        <CategoryFilter categories={categories} value={categoryId} onChange={setCategoryId} />
      </ControlsBar>

      {!active ? (
        <IdleHint onExample={setQuery} />
      ) : (
        <>
          <ResultsSummary
            count={results.length}
            label={
              activeCategory
                ? `resultados en ${activeCategory.name}`
                : 'resultados en todas las categorías'
            }
            extra={
              <button type="button" className="pill" onClick={reset}>
                Limpiar búsqueda
              </button>
            }
          />

          {results.length === 0 ? (
            <EmptySearchState query={query.trim() || undefined} onReset={reset} />
          ) : (
            <>
              <NomineeList items={items} tokens={tokens} showCategory />
              <LoadMore
                shown={items.length}
                total={results.length}
                onLoadMore={() => setVisible((value) => value + PAGE_SIZE)}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
