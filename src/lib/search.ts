import { searchIndex, type IndexedNominee } from '@/data';
import type { SearchResult } from '@/lib/types';
import { matchesTokens, scoreMatch, tokenize } from '@/lib/text';

export interface SearchOptions {
  /** Restringe a una categoría. `null` = todas. */
  categoryId?: string | null;
  /** Corta el número de resultados devueltos. */
  limit?: number;
}

/**
 * Búsqueda global sobre TODA la base: nombre, canal/plataforma/usuario y
 * nombre de la categoría. Insensible a mayúsculas y acentos, con
 * coincidencias parciales y todos los términos obligatorios.
 *
 * El filtro por categoría se aplica DESPUÉS de buscar en toda la base, para
 * que combinar buscador + categoría siga siendo coherente.
 */
export function searchEntries(query: string, options: SearchOptions = {}): IndexedNominee[] {
  const tokens = tokenize(query);
  const { categoryId = null, limit } = options;

  let entries = searchIndex;
  if (categoryId) entries = entries.filter((entry) => entry.category.id === categoryId);

  if (tokens.length === 0) {
    return limit ? entries.slice(0, limit) : entries;
  }

  const matched: { entry: IndexedNominee; score: number }[] = [];
  for (const entry of entries) {
    if (!matchesTokens(entry.haystack, tokens)) continue;
    // El nombre pesa más que la categoría o la plataforma.
    const score = scoreMatch(entry.nameKey, tokens) * 3 + scoreMatch(entry.haystack, tokens);
    matched.push({ entry, score });
  }

  matched.sort(
    (a, b) =>
      b.score - a.score ||
      a.entry.nominee.name.localeCompare(b.entry.nominee.name, 'es', { sensitivity: 'base' })
  );

  const result = matched.map((m) => m.entry);
  return limit ? result.slice(0, limit) : result;
}

/**
 * Agrupa los registros por nombre, de modo que una misma persona/cuenta
 * aparezca una sola vez con TODAS sus categorías.
 */
export function groupByName(entries: IndexedNominee[]): SearchResult[] {
  const groups = new Map<string, SearchResult>();
  for (const entry of entries) {
    const existing = groups.get(entry.nameKey);
    if (existing) {
      existing.entries.push({ nominee: entry.nominee, category: entry.category });
    } else {
      groups.set(entry.nameKey, {
        key: entry.nameKey,
        name: entry.nominee.name,
        entries: [{ nominee: entry.nominee, category: entry.category }],
      });
    }
  }
  for (const group of groups.values()) {
    group.entries.sort((a, b) => a.category.order - b.category.order);
  }
  return [...groups.values()];
}

/** Búsqueda global agrupada por nombre — la que usa la página /buscar. */
export function searchGrouped(query: string, options: SearchOptions = {}): SearchResult[] {
  return groupByName(searchEntries(query, { ...options, limit: undefined }));
}
