import { EVENT_DATES, TIMELINE, type EventDate } from '@/data/config';
import { ArrowDown, CalendarIcon } from './Icons';
import styles from './Timeline.module.css';

/** Formatea una fecha ISO a texto largo en español; nunca inventa datos. */
function formatDate(entry: EventDate): { text: string; time: string | null; pending: boolean } {
  if (entry.status !== 'confirmed') return { text: 'Por confirmar', time: null, pending: true };
  if (entry.dateLabel) return { text: entry.dateLabel, time: entry.time ?? null, pending: false };
  if (!entry.date) return { text: 'Por confirmar', time: null, pending: true };

  const parsed = new Date(`${entry.date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { text: entry.date, time: entry.time ?? null, pending: false };
  }

  const text = new Intl.DateTimeFormat('es-EC', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);

  // La hora se escribe a mano: Intl daría «8 p. m.» en es-EC.
  let time: string | null = null;
  if (entry.time) {
    const [hours, minutes] = entry.time.split(':').map(Number);
    const suffix = hours < 12 ? 'am' : 'pm';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    time = minutes ? `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}` : `${hour12}:00 ${suffix}`;
  }

  return { text, time, pending: false };
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
                  const { text, time, pending } = formatDate(EVENT_DATES[milestone.key]);
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
                      {time && <p className={styles.milestoneTime}>{time}</p>}
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
