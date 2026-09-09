import { totals } from '@/data';
import { ArrowDown, CalendarIcon, FilmIcon } from './Icons';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.spot} aria-hidden="true" />

      <p className={`pill pill--accent ${styles.badge}`}>30 Años · Edición Conmemorativa</p>

      <span className={styles.emblem} aria-hidden="true">
        <FilmIcon size={24} />
      </span>

      <h1 className={styles.title} id="hero-title">
        Premios <span className={styles.titleItv}>ITV</span>
        <span className={styles.years}>30 Años</span>
      </h1>

      <p className={`pill ${styles.kicker}`}>Lista oficial de prenominados</p>

      <p className={styles.lede}>
        Conoce a los prenominados de los Premios ITV. Explora las categorías, busca a tu talento,
        programa, medio o cuenta digital favorita y consulta el cronograma del proceso.
      </p>

      <div className={styles.actions}>
        <a href="#categorias" className="btn btn--primary">
          <ArrowDown size={16} />
          Ver prenominados
        </a>
        <a href="#fechas" className="btn btn--ghost">
          <CalendarIcon size={16} />
          Fechas importantes
        </a>
      </div>

      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dd className={styles.statValue}>{totals.nominees}</dd>
          <dt className={styles.statLabel}>Prenominados</dt>
        </div>
        <div className={styles.stat}>
          <dd className={styles.statValue}>{totals.categories}</dd>
          <dt className={styles.statLabel}>Categorías</dt>
        </div>
        <div className={styles.stat}>
          <dd className={styles.statValue}>{totals.uniqueNames}</dd>
          <dt className={styles.statLabel}>Nombres únicos</dt>
        </div>
      </dl>

      <hr className={`rule ${styles.divider}`} />
    </section>
  );
}
