export type EntryType = 'persona' | 'programa' | 'medio' | 'cuenta';

export type Discipline =
  | 'Noticias'
  | 'Deportes'
  | 'Variedades'
  | 'Dramáticos'
  | 'Digital'
  | 'Otras';

export interface Category {
  id: string;
  slug: string;
  /** Nombre exacto tal como aparece en el Excel oficial. */
  name: string;
  order: number;
  /** Fila del archivo fuente (trazabilidad). */
  sourceRow: number;
  /** Agrupación derivada del nombre de la categoría (no viene del Excel). */
  discipline: Discipline;
  entryType: EntryType;
  /** Qué significa el campo `meta` de sus prenominados: «Canal», «Plataforma»… */
  metaLabel: string | null;
  count: number;
}

export interface Nominee {
  id: string;
  /** Nombre exacto tal como aparece en el Excel oficial. */
  name: string;
  /** Canal, plataforma o usuario asociado, si el Excel lo registra. */
  meta: string | null;
  categoryId: string;
  type: EntryType;
  order: number;
  sourceRow: number;
}

export interface DataMeta {
  source: string;
  generatedAt: string;
  totalCategories: number;
  totalNominees: number;
}

/** Un mismo nombre agrupado con todas las categorías en las que aparece. */
export interface SearchResult {
  key: string;
  name: string;
  entries: { nominee: Nominee; category: Category }[];
}
