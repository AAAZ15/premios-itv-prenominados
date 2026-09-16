export type EntryType = 'persona' | 'programa' | 'medio' | 'cuenta';

export type Discipline =
  | 'Noticias'
  | 'Deportes'
  | 'Variedades'
  | 'Concursos'
  | 'Dramáticos'
  | 'Digital'
  | 'Otras';

export interface Category {
  id: string;
  slug: string;
  /** Nombre exacto tal como aparece en el Excel oficial. */
  name: string;
  order: number;
  /** Descripción oficial de la categoría (catálogo 2026). */
  description: string;
  /** Categoría del Excel de la que salen sus prenominados; null si es nueva. */
  sourceCategory: string | null;
  /** Fila del archivo fuente; null si la categoría todavía no tiene origen. */
  sourceRow: number | null;
  /** Agrupación para la interfaz, definida en el catálogo. */
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
