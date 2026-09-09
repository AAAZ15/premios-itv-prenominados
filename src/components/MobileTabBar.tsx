'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarIcon, GridIcon, HomeIcon, ListIcon } from './Icons';
import styles from './MobileTabBar.module.css';

const TABS = [
  { href: '/', label: 'Inicio', Icon: HomeIcon },
  { href: '/prenominados/', label: 'Prenominados', Icon: ListIcon },
  { href: '/categorias/', label: 'Categorías', Icon: GridIcon },
  { href: '/fechas/', label: 'Fechas', Icon: CalendarIcon },
];

export function MobileTabBarSpacer() {
  return <div className={styles.spacer} aria-hidden="true" />;
}

export default function MobileTabBar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname.startsWith(href.replace(/\/$/, '')) ||
        // Una categoría concreta mantiene activo el apartado «Categorías».
        (href === '/categorias/' && pathname.startsWith('/categoria/'));

  return (
    <nav className={styles.bar} aria-label="Navegación rápida">
      {TABS.map(({ href, label, Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`${styles.item} ${active ? styles.itemActive : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={20} />
            <span className={styles.label}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
