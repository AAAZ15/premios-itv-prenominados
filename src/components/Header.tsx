'use client';

import { useEffect, useId, useState } from 'react';
import { NAV_LINKS, SITE } from '@/data/config';
import { ChevronRight, SearchIcon } from './Icons';
import { useActiveSection } from './useActiveSection';
import styles from './Header.module.css';

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export default function Header() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const active = useActiveSection(SECTION_IDS);

  // Cierra con Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#inicio" className={styles.brand} aria-label={`${SITE.name} ${SITE.edition} — Inicio`}>
          <span className={styles.emblem} aria-hidden="true">
            <span className={styles.emblemText}>30</span>
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Premios ITV</span>
            <span className={styles.brandEdition}>30 Años</span>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`${styles.navLink} ${active === link.id ? styles.navLinkActive : ''}`}
              aria-current={active === link.id ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href="#prenominados" className={styles.searchAction} aria-label="Ir al buscador">
            <SearchIcon size={17} />
          </a>

          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={`${styles.burgerBars} ${open ? styles.burgerOpen : ''}`}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className={styles.panel} id={panelId}>
          <nav className="container" aria-label="Navegación móvil">
            <ul className={styles.panelList}>
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className={`${styles.panelLink} ${
                      active === link.id ? styles.panelLinkActive : ''
                    }`}
                    aria-current={active === link.id ? 'true' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                    <ChevronRight size={16} className={styles.panelChevron} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
