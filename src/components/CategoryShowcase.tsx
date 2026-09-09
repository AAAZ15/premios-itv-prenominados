'use client';

import { useId, useState } from 'react';
import type { Category } from '@/lib/types';
import { CategoryGrid } from './CategoryCard';
import { ChevronDown } from './Icons';
import styles from './CategoryShowcase.module.css';

interface Props {
  /** Todas las categorías, ya ordenadas para mostrar. */
  categories: Category[];
  /** Cuántas se ven antes de desplegar. */
  initialCount?: number;
}

/**
 * Rejilla de categorías de la portada. Empieza mostrando unas pocas y, al
 * pulsar la flecha, revela el resto ahí mismo sin cambiar de página.
 */
export default function CategoryShowcase({ categories, initialCount = 6 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const gridId = useId();

  const visible = expanded ? categories : categories.slice(0, initialCount);
  const remaining = categories.length - initialCount;

  return (
    <div>
      <CategoryGrid
        categories={visible}
        id={gridId}
        revealFrom={expanded ? initialCount : undefined}
      />

      {remaining > 0 && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={expanded}
            aria-controls={gridId}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? (
              'Ver menos'
            ) : (
              <>
                Ver las <span className={styles.count}>{categories.length}</span> categorías
              </>
            )}
            <ChevronDown
              size={17}
              className={`${styles.arrow} ${expanded ? styles.arrowOpen : ''}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
