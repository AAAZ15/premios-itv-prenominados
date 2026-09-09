import Link from 'next/link';
import { SearchIcon } from './Icons';
import styles from './EmptySearchState.module.css';

interface Props {
  query?: string;
  /** Acción para limpiar los filtros activos, si los hay. */
  onReset?: () => void;
  resetLabel?: string;
}

export default function EmptySearchState({ query, onReset, resetLabel = 'Limpiar filtros' }: Props) {
  return (
    <div className={styles.empty} role="status">
      <span className={styles.icon} aria-hidden="true">
        <SearchIcon size={22} />
      </span>

      <h2 className={styles.title}>No encontramos resultados</h2>

      <p className={styles.text}>
        {query ? (
          <>
            No hay coincidencias para <span className={styles.query}>«{query}»</span>. Intenta buscar
            nuevamente por nombre, canal, programa o cuenta.
          </>
        ) : (
          <>Intenta buscar nuevamente por nombre, canal, programa o cuenta.</>
        )}
      </p>

      <div className={styles.actions}>
        {onReset && (
          <button type="button" className="btn btn--ghost" onClick={onReset}>
            {resetLabel}
          </button>
        )}
        <Link href="/categorias/" className="btn btn--ghost">
          Ver categorías
        </Link>
      </div>
    </div>
  );
}
