import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronRight } from './Icons';
import styles from './SectionHeading.module.css';

interface Props {
  eyebrow?: string;
  title: string;
  lede?: string;
  badge?: ReactNode;
  action?: { href: string; label: string };
  /** Nivel semántico del encabezado (por defecto h2). */
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  lede,
  badge,
  action,
  as: Tag = 'h2',
  id,
}: Props) {
  return (
    <div className={`${styles.heading} ${styles.sweep}`}>
      <div className={styles.top}>
        <div>
          {eyebrow && <span className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</span>}
          <div className={styles.titleRow}>
            <Tag className="section-title" id={id}>
              {title}
            </Tag>
            {badge}
          </div>
        </div>

        {action && (
          <Link href={action.href} className={styles.action}>
            {action.label}
            <ChevronRight size={14} />
          </Link>
        )}
      </div>

      {lede && <p className="section-lede">{lede}</p>}
    </div>
  );
}
