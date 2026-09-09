'use client';

import Link from 'next/link';
import { useCallback, useId, useState } from 'react';
import { getNominees } from '@/data';
import type { Category } from '@/lib/types';
import { plural } from '@/lib/text';
import { ChevronDown, ChevronRight, FilmIcon, GridIcon, ListIcon, SparkIcon, StarIcon } from './Icons';
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
function Panel({ category, labelledBy, id }: { category: Category; labelledBy: string; id: string }) {
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

      <div className={styles.panelFoot}>
        <p className={styles.panelNote}>Orden según la lista oficial.</p>
        <Link href={`/categoria/${category.slug}/`} className={styles.panelLink}>
          Abrir categoría
          <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export interface AccordionGroup {
  discipline: string;
  categories: Category[];
}

/**
 * Lista completa de categorías en acordeón. Se abre una a la vez —el estado es
 * único para toda la página— y el contenido de cada panel se monta sólo al
 * abrirlo, de modo que nunca se renderizan los 600 registros a la vez.
 *
 * Las cabeceras de disciplina son separadores dentro de la misma lista y
 * conservan los anclajes (#noticias, #deportes…) usados desde la portada.
 *
 * Cada categoría mantiene además su propia página en /categoria/<slug>/ para
 * enlaces directos y SEO.
 */
export default function CategoryAccordion({ groups }: { groups: AccordionGroup[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  return (
    <div className={styles.groups}>
      {groups.map((group) => {
        const anchor = group.discipline.toLowerCase();
        return (
          <section
            key={group.discipline}
            id={anchor}
            className={styles.group}
            aria-labelledby={`grupo-${anchor}`}
          >
            <h2 className={styles.groupTitle} id={`grupo-${anchor}`}>
              <span>{group.discipline}</span>
              <span className={styles.groupCount}>
                {group.categories.length}{' '}
                {group.categories.length === 1 ? 'categoría' : 'categorías'}
              </span>
            </h2>
            <ul className={styles.list}>{group.categories.map(renderItem)}</ul>
          </section>
        );
      })}
    </div>
  );

  function renderItem(category: Category) {
    const open = openId === category.id;
    const headerId = `${baseId}-h-${category.id}`;
    const panelId = `${baseId}-p-${category.id}`;
    const label = plural(category.count, 'Prenominado', 'Prenominados');

    return (
      <li key={category.id} className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
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
  }
}
