/**
 * Configuración central del sitio.
 * Editar SOLO este archivo para cambiar fechas, textos institucionales o URLs.
 * No requiere tocar componentes ni estilos.
 */

/**
 * Dirección donde está publicado el sitio (para canonical, Open Graph y
 * sitemap). Se puede sobrescribir con `NEXT_PUBLIC_SITE_URL` sin tocar código;
 * el valor por defecto es el dominio definitivo.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.premiositv.com';

export const SITE = {
  name: 'Premios ITV',
  edition: '30 Años',
  fullName: 'Premios ITV · 30 Años',
  tagline: 'Celebrando el talento de la televisión, los medios y el entretenimiento.',
  description:
    'Consulta la lista oficial de prenominados de los Premios ITV 30 Años: categorías, talentos, programas, medios y cuentas digitales.',
  url: SITE_URL,
  /** El pie siempre muestra el dominio oficial, no el de la vista previa. */
  siteUrlLabel: 'www.premiositv.com',
  officialUrl: 'https://www.premiositv.com',
  locale: 'es_EC',
  contactEmail: 'premios@itv.edu.ec',
} as const;

/**
 * FECHAS DEL PROCESO
 * ---------------------------------------------------------------------------
 * Para cambiar una fecha basta editar este objeto: la interfaz la formatea
 * sola en español y no hay que tocar ningún componente ni estilo.
 *
 *   date       ISO 'YYYY-MM-DD'.
 *   time       opcional, 'HH:MM' en 24 h. Se muestra tras la fecha.
 *   dateLabel  opcional, texto libre que sustituye al formato automático.
 *   status     'pending' muestra «Por confirmar» e ignora `date`.
 */
export type DateStatus = 'pending' | 'confirmed';

export interface EventDate {
  /** ISO 'YYYY-MM-DD'. Ignorado si status es 'pending'. */
  date: string | null;
  /** Hora en formato 'HH:MM' (24 h), si el hito tiene hora fija. */
  time?: string;
  /** Texto libre opcional que reemplaza al formato automático. */
  dateLabel?: string;
  status: DateStatus;
}

export const EVENT_DATES: Record<
  'firstStageStart' | 'firstStageEnd' | 'secondStageStart' | 'secondStageEnd' | 'eventDate',
  EventDate
> = {
  firstStageStart: { date: '2026-09-28', status: 'confirmed' },
  firstStageEnd: { date: '2026-10-18', status: 'confirmed' },
  secondStageStart: { date: '2026-10-19', status: 'confirmed' },
  secondStageEnd: { date: '2026-11-17', status: 'confirmed' },
  // La segunda etapa cierra el mismo día de la ceremonia.
  eventDate: { date: '2026-11-17', time: '20:00', status: 'confirmed' },
};

export interface TimelineStage {
  id: string;
  index: string;
  title: string;
  description: string;
  milestones: { label: string; key: keyof typeof EVENT_DATES }[];
}

export const TIMELINE: TimelineStage[] = [
  {
    id: 'primera-etapa',
    index: '01',
    title: 'Primera Etapa',
    description:
      'Se habilita la votación sobre la lista completa de prenominados en todas las categorías.',
    milestones: [
      { label: 'Inicio de votaciones', key: 'firstStageStart' },
      { label: 'Cierre', key: 'firstStageEnd' },
    ],
  },
  {
    id: 'segunda-etapa',
    index: '02',
    title: 'Segunda Etapa',
    description:
      'Votación final sobre los nominados que avanzan de la primera etapa en cada categoría.',
    milestones: [
      { label: 'Inicio de votaciones', key: 'secondStageStart' },
      { label: 'Cierre', key: 'secondStageEnd' },
    ],
  },
  {
    id: 'gran-evento',
    index: '03',
    title: 'Gran Evento',
    description: 'Ceremonia de entrega de los Premios ITV en su edición de 30 años.',
    milestones: [{ label: 'Premios ITV · 30 Años', key: 'eventDate' }],
  },
];

/**
 * Navegación principal (header, footer y barra inferior en móvil).
 *
 * El sitio es de una sola página: cada enlace desplaza hasta su sección.
 * `id` debe coincidir con el id de la <section> correspondiente.
 */
export const NAV_LINKS = [
  { id: 'inicio', href: '#inicio', label: 'Inicio' },
  { id: 'prenominados', href: '#prenominados', label: 'Prenominados' },
  { id: 'categorias', href: '#categorias', label: 'Categorías' },
  { id: 'fechas', href: '#fechas', label: 'Fechas' },
] as const;

/** Prefijo de los anclajes profundos de categoría: #cat-mejor-actriz */
export const CATEGORY_HASH_PREFIX = 'cat-';

/** Cuántos registros se añaden en cada carga progresiva del listado. */
export const PAGE_SIZE = 60;
