/**
 * Punto único de acceso a los datos de prenominados.
 *
 * Hoy la fuente es el JSON generado desde el Excel oficial
 * (`npm run data`). Si mañana los datos vienen de una base de datos o de una
 * API, basta reemplazar la carga de `dataset` y respetar estos tipos:
 * ningún componente accede al JSON directamente.
 */
import raw from './generated/prenominados.json';
import type { Category, DataMeta, Nominee } from '@/lib/types';
import { normalizeText } from '@/lib/text';

interface Dataset {
  meta: DataMeta;
  categories: Category[];
  nominees: Nominee[];
}

const dataset = raw as unknown as Dataset;

export const dataMeta: DataMeta = dataset.meta;

export const categories: Category[] = [...dataset.categories].sort((a, b) => a.order - b.order);

export const nominees: Nominee[] = dataset.nominees;

const categoryById = new Map(categories.map((c) => [c.id, c]));

export function getCategory(slug: string): Category | undefined {
  return categoryById.get(slug);
}

export function getCategoryOrThrow(slug: string): Category {
  const category = categoryById.get(slug);
  if (!category) throw new Error(`Categoría inexistente: ${slug}`);
  return category;
}

const nomineesByCategory = new Map<string, Nominee[]>();
for (const nominee of nominees) {
  const list = nomineesByCategory.get(nominee.categoryId);
  if (list) list.push(nominee);
  else nomineesByCategory.set(nominee.categoryId, [nominee]);
}
for (const list of nomineesByCategory.values()) list.sort((a, b) => a.order - b.order);

export function getNominees(categoryId: string): Nominee[] {
  return nomineesByCategory.get(categoryId) ?? [];
}

/** Categoría anterior y siguiente, para navegar el ciclo completo. */
export function getCategoryNeighbours(slug: string): {
  previous: Category | null;
  next: Category | null;
} {
  const index = categories.findIndex((c) => c.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? categories[index - 1] : null,
    next: index < categories.length - 1 ? categories[index + 1] : null,
  };
}

/** Categorías agrupadas por disciplina, respetando el orden del archivo. */
export function getCategoriesByDiscipline(): { discipline: string; categories: Category[] }[] {
  const groups: { discipline: string; categories: Category[] }[] = [];
  for (const category of categories) {
    const group = groups.find((g) => g.discipline === category.discipline);
    if (group) group.categories.push(category);
    else groups.push({ discipline: category.discipline, categories: [category] });
  }
  return groups;
}

/** Resumen por disciplina: cuántas categorías y cuántos registros agrupa. */
export function getDisciplineSummary(): {
  discipline: string;
  categories: number;
  nominees: number;
}[] {
  return getCategoriesByDiscipline().map((group) => ({
    discipline: group.discipline,
    categories: group.categories.length,
    nominees: group.categories.reduce((total, c) => total + c.count, 0),
  }));
}

/**
 * Índice de búsqueda precalculado: texto normalizado por registro.
 * Se construye una sola vez al importar el módulo.
 */
export interface IndexedNominee {
  nominee: Nominee;
  category: Category;
  /** nombre normalizado */
  nameKey: string;
  /** nombre + meta + categoría, normalizados, para coincidencias amplias */
  haystack: string;
}

export const searchIndex: IndexedNominee[] = nominees.map((nominee) => {
  const category = categoryById.get(nominee.categoryId)!;
  const nameKey = normalizeText(nominee.name);
  return {
    nominee,
    category,
    nameKey,
    haystack: [nameKey, normalizeText(nominee.meta ?? ''), normalizeText(category.name)]
      .filter(Boolean)
      .join(' '),
  };
});

export const totals = {
  categories: categories.length,
  nominees: nominees.length,
  /** Nombres distintos (una persona puede estar en varias categorías). */
  uniqueNames: new Set(searchIndex.map((entry) => entry.nameKey)).size,
};
