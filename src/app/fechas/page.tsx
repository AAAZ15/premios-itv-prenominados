import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import Timeline from '@/components/Timeline';
import { SITE } from '@/data/config';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Fechas importantes',
  description: `Cronograma de los ${SITE.name} ${SITE.edition}: etapas de votación, cierres y fecha del evento final.`,
  alternates: { canonical: '/fechas/' },
  openGraph: {
    title: `Fechas importantes | ${SITE.name} ${SITE.edition}`,
    description: 'Etapas de votación, cierres y fecha del evento final.',
    url: `${SITE.url}/fechas/`,
  },
};

export default function FechasPage() {
  return (
    <div className="container container--narrow section">
      <SectionHeading
        as="h1"
        eyebrow="Cronograma oficial"
        title="Fechas importantes"
        lede="Las etapas del proceso de votación y la fecha del gran evento de los Premios ITV 30 Años."
      />

      <Timeline />

      <aside className={styles.aside}>
        <h2 className={styles.asideTitle}>Mientras tanto</h2>
        <p className={styles.asideText}>
          Esta página es un directorio informativo: aquí puedes consultar quiénes son los
          prenominados y en qué categorías compiten. La votación se realiza por los canales
          oficiales de los Premios ITV.
        </p>
        <div className={styles.asideActions}>
          <Link href="/prenominados/" className="btn btn--primary">
            Ver prenominados
          </Link>
          <Link href="/categorias/" className="btn btn--ghost">
            Ver categorías
          </Link>
        </div>
      </aside>
    </div>
  );
}
