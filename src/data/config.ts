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
 * Los archivos entregados NO contienen el cronograma de votación de la
 * edición 30 Años, por lo que estas fechas quedan como marcadores.
 *
 * Para publicarlas:
 *   1. Cambiar `status` a 'confirmed'.
 *   2. Escribir `date` en formato ISO (YYYY-MM-DD) — se formatea solo.
 *      (Si se prefiere un texto libre, usar `dateLabel`.)
 *
 * Mientras `status` sea 'pending', la interfaz muestra «Por confirmar».
 */
export type DateStatus = 'pending' | 'confirmed';

export interface EventDate {
  /** ISO 'YYYY-MM-DD'. Ignorado si status es 'pending'. */
  date: string | null;
  /** Texto libre opcional que reemplaza al formato automático. */
  dateLabel?: string;
  status: DateStatus;
}

export const EVENT_DATES: Record<
  'firstStageStart' | 'firstStageEnd' | 'secondStageStart' | 'secondStageEnd' | 'eventDate',
  EventDate
> = {
  firstStageStart: { date: null, status: 'pending' },
  firstStageEnd: { date: null, status: 'pending' },
  secondStageStart: { date: null, status: 'pending' },
  secondStageEnd: { date: null, status: 'pending' },
  eventDate: { date: null, status: 'pending' },
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

/** Navegación principal (header, footer y barra inferior en mobile). */
export const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/prenominados/', label: 'Prenominados' },
  { href: '/categorias/', label: 'Categorías' },
  { href: '/fechas/', label: 'Fechas' },
] as const;

/** Cuántos registros se añaden en cada carga progresiva del listado. */
export const PAGE_SIZE = 60;
