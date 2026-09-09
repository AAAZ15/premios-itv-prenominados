'use client';

import { NAV_LINKS } from '@/data/config';
import { CalendarIcon, GridIcon, HomeIcon, ListIcon } from './Icons';
import { useActiveSection } from './useActiveSection';
import styles from './MobileTabBar.module.css';

const ICONS = {
  inicio: HomeIcon,
  prenominados: ListIcon,
  categorias: GridIcon,
  fechas: CalendarIcon,
} as const;

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export function MobileTabBarSpacer() {
  return <div className={styles.spacer} aria-hidden="true" />;
}

export default function MobileTabBar() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <nav className={styles.bar} aria-label="Navegación rápida">
      {NAV_LINKS.map((link) => {
        const Icon = ICONS[link.id];
        const isActive = active === link.id;
        return (
          <a
            key={link.id}
            href={link.href}
            className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <Icon size={20} />
            <span className={styles.label}>{link.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
