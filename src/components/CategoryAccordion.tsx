'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { getNominees } from '@/data';
import { CATEGORY_HASH_PREFIX } from '@/data/config';
import { GOTO_EVENT, scrollToIdAfterRender } from '@/lib/scroll';
import type { Category } from '@/lib/types';
import { plural } from '@/lib/text';
import { ChevronDown, FilmIcon, GridIcon, ListIcon, SparkIcon, StarIcon } from './Icons';
import styles from './CategoryAccordion.module.css';

function DisciplineIcon({ discipline }: { discipline: Category['discipline'] }) {
  switch (discipline) {
    case 'Noticias':
      return <ListIcon size={18} />;
    case 'Deportes':
      return <StarIcon size={18} />;
    case 'Variedades':
      return <SparkIcon size={18} />;
    case 'Dramáticos':
      return <FilmIcon size={18} />;
    default:
      return <GridIcon size={18} />;
  }
}

/** Contenido desplegado: la lista de prenominados de esa categoría. */
function Panel({
  category,
  labelledBy,
  id,
}: {
  category: Category;
  labelledBy: string;
  id: string;
}) {
  const nominees = getNominees(category.id);

  return (
    <div className={styles.panel} id={id} role="region" aria-labelledby={labelledBy}>
      <hr className={`rule ${styles.panelRule}`} />

      <ul className={styles.rows}>
        {nominees.map((nominee, index) => (
          <li key={nominee.id}>
            <div className={styles.row}>
              <span className={styles.rowIndex} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <span className={styles.rowName}>{nominee.name}</span>
                {nominee.meta && (
                  <span className={styles.rowMeta}>
                    {category.metaLabel ? `${category.metaLabel}: ${nominee.meta}` : nominee.meta}
                  </span>
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className={styles.panelNote}>
        {category.count} {plural(category.count, 'prenominado', 'prenominados')} · orden según la
        lista oficial.
      </p>
    </div>
  );
}

interface Props {
  /** Todas las categorías, en el orden en que deben mostrarse. */
  categories: Category[];
  /** Cuántas se ven antes de pulsar «ver más». */
  initialCount?: number;
}

/**
 * Lista de categorías en acordeón, dentro de la página única.
 *
 * - Se abre una a la vez y su contenido se monta sólo al abrirlo, así que
 *   nunca hay 600 filas en el DOM.
 * - Empieza mostrando unas pocas; la flecha revela el resto ahí mismo.
 * - Responde a los anclajes `#cat-<slug>`: cualquier enlace puede desplazar
 *   hasta una categoría y abrirla (lo usan los resultados de búsqueda).
 */
export default function CategoryAccordion({ categories, initialCount = 6 }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const baseId = useId();

  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  /**
   * Abre la categoría pedida desde fuera: por el hash de la URL (enlace
   * directo, recarga) o por un clic en cualquier enlace `#cat-…` de la página.
   */
  useEffect(() => {
    const open = (anchor: string, scroll: boolean) => {
      if (!anchor.startsWith(CATEGORY_HASH_PREFIX)) return;

      const slug = anchor.slice(CATEGORY_HASH_PREFIX.length);
      const index = categories.findIndex((c) => c.slug === slug);
      if (index === -1) return;

      // Si está entre las ocultas, primero se despliega la lista completa.
      if (index >= initialCount) setExpanded(true);
      setOpenId(categories[index].id);

      // El desplazamiento espera al repintado: el destino puede no existir aún.
      if (scroll) scrollToIdAfterRender(anchor);
    };

    // SmoothAnchors ya se encarga de desplazar en los clics internos.
    const onGoto = (event: Event) => open((event as CustomEvent<string>).detail, false);
    const onHashChange = () => open(window.location.hash.replace('#', ''), true);

    onHashChange();
    window.addEventListener(GOTO_EVENT, onGoto);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener(GOTO_EVENT, onGoto);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [categories, initialCount]);

  const visible = expanded ? categories : categories.slice(0, initialCount);
  const remaining = categories.length - initialCount;

  return (
    <div>
      <ul className={styles.list}>
        {visible.map((category, index) => {
          const open = openId === category.id;
          const headerId = `${baseId}-h-${category.id}`;
          const panelId = `${baseId}-p-${category.id}`;
          const label = plural(category.count, 'Prenominado', 'Prenominados');
          const reveal = expanded && index >= initialCount;

          return (
            <li
              key={category.id}
              // Ancla estable para enlazar directamente a esta categoría.
              id={`${CATEGORY_HASH_PREFIX}${category.slug}`}
              className={`${styles.item} ${open ? styles.itemOpen : ''} ${
                reveal ? styles.reveal : ''
              }`}
              style={
                reveal
                  ? ({
                      '--reveal-delay': `${Math.min(index - initialCount, 8) * 45}ms`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <h3 className={styles.headingWrap}>
                <button
                  type="button"
                  id={headerId}
                  className={styles.trigger}
                  aria-expanded={open}
                  aria-controls={open ? panelId : undefined}
                  onClick={() => toggle(category.id)}
                >
                  <span className={styles.icon} aria-hidden="true">
                    <DisciplineIcon discipline={category.discipline} />
                  </span>

                  <span className={styles.body}>
                    <span className={styles.name}>{category.name}</span>
                    <span className={styles.discipline}>
                      {category.discipline}
                      {/* En pantallas estrechas el conteo va aquí, para que el
                          título disponga de todo el ancho. */}
                      <span className={styles.inlineCount}>
                        {' · '}
                        <b className={styles.inlineCountValue}>{category.count}</b> {label}
                      </span>
                    </span>
                  </span>

                  <span className={styles.side}>
                    <span className={styles.count}>
                      <span className={styles.countValue}>{category.count}</span>
                      <span className={styles.countLabel}>{label}</span>
                    </span>
                    <ChevronDown
                      size={18}
                      className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
                    />
                  </span>
                </button>
              </h3>

              {open && <Panel category={category} labelledBy={headerId} id={panelId} />}
            </li>
          );
        })}
      </ul>

      {remaining > 0 && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.toggleAll}
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? (
              'Ver menos'
            ) : (
              <>
                Ver las <span className={styles.toggleCount}>{categories.length}</span> categorías
              </>
            )}
            <ChevronDown
              size={17}
              className={`${styles.toggleArrow} ${expanded ? styles.toggleArrowOpen : ''}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
