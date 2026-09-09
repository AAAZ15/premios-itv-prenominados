'use client';

import { totals } from '@/data';
import { ChevronRight, SearchIcon } from './Icons';
import styles from './IdleHint.module.css';

/** Ejemplos que muestran qué tipo de cosas se pueden buscar. */
const EXAMPLES = ['Teleamazonas', 'Ecuavisa', 'Instagram', 'YouTube', 'Deportes'];

/**
 * Lo que ve el buscador cuando está vacío. Deliberadamente NO lista los
 * prenominados: con 600 registros, volcarlos todos abrumaba la página.
 */
export default function IdleHint({ onExample }: { onExample?: (value: string) => void }) {
  return (
    <div className={styles.hint}>
      <span className={styles.icon} aria-hidden="true">
        <SearchIcon size={20} />
      </span>

      <p className={styles.text}>
        Escribe un nombre, apellido, canal, programa o cuenta digital. Buscamos entre los{' '}
        {totals.nominees} prenominados de las {totals.categories} categorías al mismo tiempo.
      </p>

      {onExample && (
        <>
          <p className={styles.examplesLabel}>Prueba con</p>
          <div className={styles.examples}>
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                className={styles.example}
                onClick={() => onExample(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </>
      )}

      <a href="#categorias" className={styles.browse}>
        O explora por categoría
        <ChevronRight size={13} />
      </a>
    </div>
  );
}
