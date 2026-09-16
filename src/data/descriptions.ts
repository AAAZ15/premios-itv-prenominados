/**
 * Descripciones oficiales de las categorías (texto entregado por ITV).
 *
 * ---------------------------------------------------------------------------
 * ATENCIÓN — LOS NOMBRES NO COINCIDEN CON LOS DEL EXCEL
 * ---------------------------------------------------------------------------
 * Las descripciones corresponden al listado de categorías de 2026; los
 * prenominados provienen del Excel de 2023, cuyas categorías se llaman
 * distinto. Cada entrada indica de dónde sale su texto:
 *
 *   EXACTA      el nombre de la categoría coincide palabra por palabra.
 *   RENOMBRADA  el nombre cambió pero describe inequívocamente lo mismo.
 *   (sin clave) no hay descripción para esa categoría del Excel.
 *
 * NO se ha inventado ninguna correspondencia dudosa. Ver `SIN_DESCRIPCION`
 * y `CATEGORIAS_2026_SIN_PRENOMINADOS` al final del archivo.
 *
 * Clave = slug de la categoría (src/data/generated/prenominados.json).
 */

/** Condición general de nominación, común a todas las categorías. */
export const NOMINATION_REQUIREMENT =
  'Es requisito para ser nominado en todas las categorías que esté ejerciendo su ' +
  'profesión de forma activa durante el año 2026 y, en el caso de las cuentas ' +
  'digitales, haber generado contenido durante el año 2026. Las categorías que ' +
  'premian a talentos incluyen radio, televisión y/o medios digitales.';

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  // RENOMBRADA — «Mejor Presentador de Información, Noticias e Investigación»
  'mejor-presentador-de-noticias':
    'Reconoce al profesional que destaca por su imparcialidad, claridad y credibilidad al ' +
    'comunicar noticias, hechos y temas de investigación. Su desempeño se caracteriza por el ' +
    'dominio de la información, profesionalismo y capacidad para mantener informada a la audiencia.',

  // RENOMBRADA — «Mejor Presentadora de Información, Noticias e Investigación»
  'mejor-presentadora-de-noticias':
    'Premia a la profesional que sobresale por su carisma, presencia y habilidades excepcionales ' +
    'de comunicación al informar sobre los acontecimientos más relevantes. Su desempeño combina ' +
    'claridad, credibilidad, dinamismo y profesionalismo para conectar con la audiencia.',

  // EXACTA
  'mejor-reportero-a-de-noticias':
    'Reconoce al profesional que demuestra valentía, dedicación y tenacidad al informar desde el ' +
    'lugar de los hechos. Su capacidad para investigar, entrevistar y presentar historias aporta ' +
    'profundidad, credibilidad y dinamismo a la cobertura periodística.',

  // RENOMBRADA — «Mejor Medio Digital de Información»
  'mejor-cuenta-informativa-digital':
    'Reconoce al medio digital que ofrece información precisa, oportuna y de calidad, ' +
    'complementada con análisis y contenidos de interés para su audiencia. Se considera su ' +
    'presencia, alcance y capacidad de generar información relevante en el entorno digital, con ' +
    'un mínimo de 50.000 seguidores o suscriptores.',

  // EXACTA
  'mejor-narrador-deportivo':
    'Reconoce al narrador deportivo cuya voz, energía y capacidad narrativa logran transmitir la ' +
    'emoción e intensidad de cada encuentro. Su relato aporta dinamismo, pasión y cercanía, ' +
    'convirtiendo cada jugada en una experiencia para la audiencia.',

  // RENOMBRADA — «Mejor Comunicador de Deportes»
  'mejor-comentarista-deportivo-masculino':
    'Reconoce al profesional que aporta análisis perspicaces, opiniones fundamentadas y un amplio ' +
    'conocimiento del ámbito deportivo. Su capacidad para interpretar, contextualizar y comunicar ' +
    'los acontecimientos enriquece la comprensión de la audiencia y genera contenidos de valor.',

  // RENOMBRADA — «Mejor Comunicadora de Deportes»
  'mejor-comentarista-deportivo-mujeres':
    'Reconoce a la profesional que combina conocimiento, elocuencia y pasión para analizar y ' +
    'comunicar los acontecimientos deportivos. Sus comentarios, fundamentados y sólidos, aportan ' +
    'profundidad, contexto y una mirada especializada que enriquece la información para la audiencia.',

  // EXACTA
  'mejor-cuenta-digital-de-deportes':
    'Reconoce a la cuenta digital que brinda una cobertura dinámica y relevante de los ' +
    'acontecimientos deportivos, acompañada de análisis y contenidos de interés para los ' +
    'aficionados. Se considera su alcance, calidad y capacidad de generar una comunidad activa, ' +
    'con un mínimo de 50.000 seguidores o suscriptores.',

  // RENOMBRADA — «Mejor Conductor de Programas de Variedades»
  'mejor-conductor-de-variedades':
    'Reconoce al profesional que, a través de su carisma, espontaneidad y capacidad de ' +
    'comunicación, logra entretener y conectar con la audiencia. Su desempeño aporta dinamismo, ' +
    'creatividad y ritmo a los programas de variedades.',

  // RENOMBRADA — «Mejor Conductora de Programas de Variedades»
  'mejor-conductora-de-variedades':
    'Premia a la profesional que cautiva a la audiencia con su encanto, energía y naturalidad ' +
    'frente a cámara. Su capacidad para conectar con el público, conducir diferentes segmentos y ' +
    'generar entretenimiento enriquece la experiencia del programa.',

  // EXACTA
  'mejor-programa-de-variedades':
    'Reconoce al programa de variedades que combina creatividad, entretenimiento y contenido de ' +
    'calidad para ofrecer una experiencia atractiva y dinámica a su audiencia. Se consideran ' +
    'propuestas transmitidas tanto en medios convencionales como en plataformas digitales, ' +
    'capaces de generar conexión y participación del público.',

  // EXACTA
  'mejor-actor':
    'Reconoce al talento por su capacidad para dar vida a personajes diversos con naturalidad, ' +
    'fuerza y credibilidad. Su dominio de la expresión corporal y emocional le permite asumir ' +
    'diferentes roles y construir actuaciones que conectan con la audiencia.',

  // EXACTA
  'mejor-actriz':
    'Premia a la profesional que logra construir personajes auténticos y transmitir sus emociones ' +
    'con sensibilidad y profundidad. Su expresividad, versatilidad y capacidad para conectar con ' +
    'cada historia enriquecen la experiencia audiovisual.',
};

/**
 * Categorías del Excel que se quedan SIN descripción, porque el listado de
 * 2026 no trae ninguna que les corresponda sin adivinar:
 *
 *   mejor-cuenta-de-instagram-senior     El listado de 2026 tiene UNA sola
 *   mejor-cuenta-de-instagram-junior     categoría de Instagram («Mejor Creador
 *                                        de Contenido de Instagram», mínimo
 *                                        250.000 seguidores). Asignarla a Senior
 *                                        o a Junior sería inventar el criterio.
 *   mejor-youtuber                       Sin equivalente en el listado de 2026.
 *   mejor-cuenta-digital-de-dramaticos   Sin equivalente.
 *   mejor-cuenta-digital-de-entretenimiento  Sin equivalente.
 */
export const SIN_DESCRIPCION = [
  'mejor-cuenta-de-instagram-senior',
  'mejor-cuenta-de-instagram-junior',
  'mejor-youtuber',
  'mejor-cuenta-digital-de-dramaticos',
  'mejor-cuenta-digital-de-entretenimiento',
] as const;

/**
 * Categorías del listado de 2026 que NO existen en el Excel de 2023 y que, por
 * tanto, no aparecen en la web: no hay prenominados que mostrar en ellas.
 * Se conservan aquí sus textos para cuando llegue el Excel actualizado.
 */
export const CATEGORIAS_2026_SIN_PRENOMINADOS: { name: string; description: string }[] = [
  {
    name: 'Mejor Animador de Programa de Concursos',
    description:
      'Reconoce al profesional que imprime energía, ritmo y emoción al desarrollo de las ' +
      'competencias. Su capacidad para interactuar con participantes y audiencia, conducir las ' +
      'dinámicas y mantener la expectativa convierte cada momento del concurso en una experiencia ' +
      'entretenida.',
  },
  {
    name: 'Mejor Animadora de Programa de Concursos',
    description:
      'Premia a la profesional que, con espontaneidad, energía y dominio escénico, guía las ' +
      'diferentes dinámicas y competencias del programa. Su conexión con participantes y audiencia ' +
      'aporta ritmo, emoción y dinamismo al desarrollo del concurso.',
  },
  {
    name: 'Mejor Programa de Concursos',
    description:
      'Reconoce al programa que, mediante retos, competencias y dinámicas originales, logra ' +
      'generar emoción, participación y entretenimiento. Se valora la creatividad del formato, el ' +
      'desarrollo de las competencias y su capacidad para mantener la expectativa y el interés de ' +
      'la audiencia.',
  },
  {
    name: 'Mejor Creador de Contenido de Instagram',
    description:
      'Reconoce al creador que desarrolla contenido original, creativo y atractivo, logrando ' +
      'conectar de manera constante con su comunidad en Instagram. Se valora la calidad de sus ' +
      'publicaciones, su identidad y capacidad para generar interacción, con un mínimo de 250.000 ' +
      'seguidores.',
  },
  {
    name: 'Mejor TikToker',
    description:
      'Reconoce al creador que sobresale por su capacidad para desarrollar contenidos dinámicos, ' +
      'originales y de alto impacto en TikTok, aprovechando las tendencias y recursos propios de ' +
      'la plataforma. Se valora su creatividad, alcance y capacidad para generar una comunidad ' +
      'activa, con un mínimo de 1.000.000 de seguidores.',
  },
  {
    name: 'Mejor Creador de Contenido Empresarial',
    description:
      'Destaca y premia a empresas, marcas o instituciones de cualquier rubro que gestionan ' +
      'contenido propio en redes sociales, sea con equipo interno o una agencia. Se consideran a ' +
      'quienes hayan producido contenido consistente durante el año 2026, no una campaña puntual o ' +
      'aislada, y que tengan al menos 65.000 seguidores en la plataforma principal (Instagram o ' +
      'TikTok).',
  },
];

/** Descripción oficial de una categoría, si la hay. */
export function getCategoryDescription(slug: string): string | null {
  return CATEGORY_DESCRIPTIONS[slug] ?? null;
}
