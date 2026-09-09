'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { NAV_LINKS, SITE } from '@/data/config';
import { ChevronRight, SearchIcon } from './Icons';
import styles from './Header.module.css';

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href.replace(/\/$/, ''));
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Cierra el menú al navegar.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
        <Link href="/" className={styles.brand} aria-label={`${SITE.name} ${SITE.edition} — Inicio`}>
          <span className={styles.emblem} aria-hidden="true">
            <span className={styles.emblemText}>30</span>
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Premios ITV</span>
            <span className={styles.brandEdition}>30 Años</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Navegación principal">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <Link href="/buscar/" className={styles.searchAction} aria-label="Buscar prenominados">
            <SearchIcon size={17} />
          </Link>

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
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`${styles.panelLink} ${active ? styles.panelLinkActive : ''}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {link.label}
                      <ChevronRight size={16} className={styles.panelChevron} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
