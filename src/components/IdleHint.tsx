'use client';

import { totals } from '@/data';
import { ChevronRight, SearchIcon } from './Icons';
import styles from './IdleHint.module.css';

/**
 * Lo que ve el buscador cuando está vacío. Deliberadamente NO lista los
 * prenominados: con cientos de registros, volcarlos todos abrumaba la página.
 */
export default function IdleHint({
  demasiadoCorta = false,
}: {
  /** Hay texto escrito, pero aún no basta para filtrar. */
  demasiadoCorta?: boolean;
}) {
  return (
    <div className={styles.hint} role={demasiadoCorta ? 'status' : undefined}>
      <span className={styles.icon} aria-hidden="true">
        <SearchIcon size={20} />
      </span>

      <p className={styles.text}>
        {demasiadoCorta ? (
          <>Escribe al menos dos letras para buscar.</>
        ) : (
          <>
            Escribe un nombre, apellido, canal, programa o cuenta digital. Buscamos entre los{' '}
            {totals.nominees} prenominados de las {totals.categories} categorías al mismo tiempo.
          </>
        )}
      </p>

      <a href="#categorias" className={styles.browse}>
        O explora por categoría
        <ChevronRight size={13} />
      </a>
    </div>
  );
}
