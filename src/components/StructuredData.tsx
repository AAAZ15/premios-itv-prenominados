import { categories, totals } from '@/data';
import { EVENT_DATES, SITE } from '@/data/config';

/**
 * Datos estructurados (JSON-LD) para que los buscadores entiendan que esto es
 * un evento con una lista de categorías, y puedan mostrar la fecha de la gala.
 *
 * Sólo describe lo que la página ya dice; no añade información nueva.
 */
export default function StructuredData() {
  const gala = EVENT_DATES.eventDate;
  const fechaGala =
    gala.status === 'confirmed' && gala.date
      ? `${gala.date}T${gala.time ?? '00:00'}:00-05:00` // Ecuador, UTC−5
      : null;

  const datos = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: `${SITE.url}/`,
        name: `${SITE.name} ${SITE.edition}`,
        description: SITE.description,
        inLanguage: 'es-EC',
      },
      ...(fechaGala
        ? [
            {
              '@type': 'Event',
              '@id': `${SITE.url}/#evento`,
              name: `${SITE.name} ${SITE.edition}`,
              description: SITE.tagline,
              startDate: fechaGala,
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              organizer: { '@type': 'Organization', name: SITE.name, url: SITE.officialUrl },
              location: { '@type': 'Place', name: 'Ecuador', address: 'Ecuador' },
            },
          ]
        : []),
      {
        '@type': 'ItemList',
        '@id': `${SITE.url}/#categorias`,
        name: `Categorías de los ${SITE.name} ${SITE.edition}`,
        numberOfItems: totals.categories,
        itemListElement: categories.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          url: `${SITE.url}/categoria/${c.slug}/`,
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Contenido propio y serializado con JSON.stringify: no hay entrada externa.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, '\\u003c') }}
    />
  );
}
