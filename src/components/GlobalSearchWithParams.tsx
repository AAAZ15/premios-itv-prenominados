'use client';

import { useSearchParams } from 'next/navigation';
import { getCategory } from '@/data';
import GlobalSearch from './GlobalSearch';

/** Inicializa el buscador global desde /buscar?q=…&categoria=… */
export default function GlobalSearchWithParams() {
  const params = useSearchParams();
  const query = params.get('q') ?? '';
  const requested = params.get('categoria') ?? '';
  const categoryId = requested && getCategory(requested) ? requested : '';

  return <GlobalSearch initialQuery={query} initialCategoryId={categoryId} />;
}
