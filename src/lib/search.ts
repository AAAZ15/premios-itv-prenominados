import { searchIndex, type IndexedNominee } from '@/data';
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
