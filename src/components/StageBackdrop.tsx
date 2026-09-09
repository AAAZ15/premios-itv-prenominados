import styles from './StageBackdrop.module.css';

/**
 * Fondo fijo de toda la aplicación: bóveda oscura de teatro, haces de luz de
 * escenario y líneas curvas luminosas. Es decorativo; se oculta a lectores de
 * pantalla y no captura eventos del puntero.
 */
export default function StageBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={`${styles.beam} ${styles.beamA}`} />
      <div className={`${styles.beam} ${styles.beamB}`} />

      <svg
        className={styles.curves}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <linearGradient id="sweep-cyan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sweep-indigo" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sweep-silver" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0" />
            <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          className={styles.curveStroke}
          d="M-80 210 C 280 60, 700 300, 1010 150 S 1420 60, 1520 190"
          stroke="url(#sweep-cyan)"
          strokeWidth="1.4"
        />
        <path
          className={styles.curveStroke}
          style={{ animationDelay: '-4s' }}
          d="M-80 320 C 300 190, 660 430, 1010 280 S 1440 200, 1520 320"
          stroke="url(#sweep-silver)"
          strokeWidth="1"
        />
        <path
          className={styles.curveStroke}
          style={{ animationDelay: '-8s' }}
          d="M-80 700 C 320 830, 700 560, 1050 690 S 1420 800, 1520 640"
          stroke="url(#sweep-indigo)"
          strokeWidth="1.2"
        />
      </svg>

      <div className={styles.grain} />
      <div className={styles.vignette} />
    </div>
  );
}
