import Link from 'next/link';
import { NAV_LINKS, SITE } from '@/data/config';
import { SparkIcon } from './Icons';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.brandBlock}>
            <h2 className={styles.title}>Premios ITV</h2>
            <p className={styles.edition}>30 Años</p>
            <p className={styles.tagline}>{SITE.tagline}</p>
          </div>

          <nav aria-labelledby="footer-nav-title">
            <h2 className={styles.linksTitle} id="footer-nav-title">
              Navegación
            </h2>
            <ul className={styles.links}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <a
            className={styles.site}
            href={SITE.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SparkIcon size={15} />
            {SITE.siteUrlLabel}
          </a>
          <p className={styles.legal}>
            Directorio informativo de prenominados. Esta página no recibe votos.
          </p>
        </div>
      </div>
    </footer>
  );
}
