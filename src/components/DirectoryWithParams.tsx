'use client';

import { useSearchParams } from 'next/navigation';
import { getCategory } from '@/data';
import Directory from './Directory';

/**
 * Lee ?q= y ?categoria= de la URL para inicializar el directorio.
 * Se aísla en su propio componente porque `useSearchParams` requiere
 * un límite de Suspense.
 */
export default function DirectoryWithParams() {
  const params = useSearchParams();
  const query = params.get('q') ?? '';
  const requested = params.get('categoria') ?? '';
  const categoryId = requested && getCategory(requested) ? requested : '';

  return <Directory initialQuery={query} initialCategoryId={categoryId} syncUrl />;
}
