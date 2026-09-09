import { EVENT_DATES, TIMELINE, type EventDate } from '@/data/config';
import { ArrowDown, CalendarIcon } from './Icons';
import styles from './Timeline.module.css';

/** Formatea una fecha ISO a texto largo en español; nunca inventa datos. */
function formatDate(entry: EventDate): { text: string; pending: boolean } {
  if (entry.status !== 'confirmed') return { text: 'Por confirmar', pending: true };
  if (entry.dateLabel) return { text: entry.dateLabel, pending: false };
  if (!entry.date) return { text: 'Por confirmar', pending: true };

  const parsed = new Date(`${entry.date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return { text: entry.date, pending: false };

  return {
    text: new Intl.DateTimeFormat('es-EC', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(parsed),
    pending: false,
  };
}

export const hasConfirmedDates = Object.values(EVENT_DATES).some(
  (entry) => entry.status === 'confirmed'
);

export default function Timeline() {
  return (
    <div>
      <ol className={styles.timeline}>
        {TIMELINE.map((stage, index) => (
          <li key={stage.id}>
            <article className={styles.stage}>
              <div className={styles.head}>
                <span className={styles.index} aria-hidden="true">
                  {stage.index}
                </span>
                <div>
                  <h3 className={styles.title}>{stage.title}</h3>
                  <p className={styles.description}>{stage.description}</p>
                </div>
              </div>

              <div
                className={`${styles.milestones} ${
                  stage.milestones.length === 1 ? styles.milestonesSingle : ''
                }`}
              >
                {stage.milestones.map((milestone) => {
                  const { text, pending } = formatDate(EVENT_DATES[milestone.key]);
                  return (
                    <div className={styles.milestone} key={milestone.key}>
                      <p className={styles.milestoneLabel}>{milestone.label}</p>
                      <p
                        className={`${styles.milestoneDate} ${
                          pending ? styles.milestonePending : ''
                        }`}
                      >
                        {pending && <span className={styles.pendingDot} aria-hidden="true" />}
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </article>

            {index < TIMELINE.length - 1 && (
              <div className={styles.connector} aria-hidden="true">
                <span className={styles.connectorLine} />
                <ArrowDown size={16} />
                <span className={styles.connectorLine} />
              </div>
            )}
          </li>
        ))}
      </ol>

      {!hasConfirmedDates && (
        <p className={styles.note}>
          <CalendarIcon size={17} className={styles.noteIcon} />
          <span>
            El cronograma oficial de la edición 30 Años aún no ha sido publicado. Las fechas se
            mostrarán aquí en cuanto se confirmen.
          </span>
        </p>
      )}
    </div>
  );
}
