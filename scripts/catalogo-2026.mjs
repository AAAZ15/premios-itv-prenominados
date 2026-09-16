/**
 * CATÁLOGO OFICIAL DE CATEGORÍAS — PREMIOS ITV 30 AÑOS (2026)
 * ===========================================================================
 * Esta lista manda. Define qué categorías existen, cómo se llaman, en qué
 * orden aparecen y qué texto las describe.
 *
 * `fuenteExcel` dice de qué categoría del Excel salen sus prenominados:
 *   · un nombre  → esa categoría del Excel, tal cual (renombrada si procede).
 *   · null       → categoría nueva; todavía no hay prenominados que mostrar.
 *
 * Las categorías del Excel que NO aparezcan como `fuenteExcel` de ninguna
 * entrada quedan FUERA de la web, y `npm run data` las lista en el reporte.
 *
 * Para actualizar el catálogo se edita sólo este archivo y se ejecuta:
 *   npm run data && npm run build
 */

export const CATALOGO_2026 = [
  {
    nombre: 'MEJOR PRESENTADOR DE INFORMACIÓN, NOTICIAS E INVESTIGACIÓN',
    fuenteExcel: 'MEJOR PRESENTADOR DE NOTICIAS',
    disciplina: 'Noticias',
    tipo: 'persona',
    etiquetaMeta: null,
    descripcion:
      'Reconoce al profesional que destaca por su imparcialidad, claridad y credibilidad al ' +
      'comunicar noticias, hechos y temas de investigación. Su desempeño se caracteriza por el ' +
      'dominio de la información, profesionalismo y capacidad para mantener informada a la audiencia.',
  },
  {
    nombre: 'MEJOR PRESENTADORA DE INFORMACIÓN, NOTICIAS E INVESTIGACIÓN',
    fuenteExcel: 'MEJOR PRESENTADORA DE NOTICIAS',
    disciplina: 'Noticias',
    tipo: 'persona',
    etiquetaMeta: null,
    descripcion:
      'Premia a la profesional que sobresale por su carisma, presencia y habilidades excepcionales ' +
      'de comunicación al informar sobre los acontecimientos más relevantes. Su desempeño combina ' +
      'claridad, credibilidad, dinamismo y profesionalismo para conectar con la audiencia.',
  },
  {
    nombre: 'MEJOR REPORTERO/A DE NOTICIAS',
    fuenteExcel: 'MEJOR REPORTERO/A DE NOTICIAS',
    disciplina: 'Noticias',
    tipo: 'persona',
    etiquetaMeta: null,
    descripcion:
      'Reconoce al profesional que demuestra valentía, dedicación y tenacidad al informar desde el ' +
      'lugar de los hechos. Su capacidad para investigar, entrevistar y presentar historias aporta ' +
      'profundidad, credibilidad y dinamismo a la cobertura periodística.',
  },
  {
    nombre: 'MEJOR MEDIO DIGITAL DE INFORMACIÓN',
    fuenteExcel: 'MEJOR CUENTA INFORMATIVA DIGITAL',
    disciplina: 'Noticias',
    tipo: 'medio',
    etiquetaMeta: 'Plataforma',
    descripcion:
      'Reconoce al medio digital que ofrece información precisa, oportuna y de calidad, ' +
      'complementada con análisis y contenidos de interés para su audiencia. Se considera su ' +
      'presencia, alcance y capacidad de generar información relevante en el entorno digital, con ' +
      'un mínimo de 50.000 seguidores o suscriptores.',
  },
  {
    nombre: 'MEJOR NARRADOR DEPORTIVO',
    fuenteExcel: 'MEJOR NARRADOR DEPORTIVO',
    disciplina: 'Deportes',
    tipo: 'persona',
    etiquetaMeta: null,
    descripcion:
      'Reconoce al narrador deportivo cuya voz, energía y capacidad narrativa logran transmitir la ' +
      'emoción e intensidad de cada encuentro. Su relato aporta dinamismo, pasión y cercanía, ' +
      'convirtiendo cada jugada en una experiencia para la audiencia.',
  },
  {
    nombre: 'MEJOR COMUNICADOR DE DEPORTES',
    fuenteExcel: 'MEJOR COMENTARISTA DEPORTIVO (MASCULINO)',
    disciplina: 'Deportes',
    tipo: 'persona',
    etiquetaMeta: null,
    descripcion:
      'Reconoce al profesional que aporta análisis perspicaces, opiniones fundamentadas y un amplio ' +
      'conocimiento del ámbito deportivo. Su capacidad para interpretar, contextualizar y comunicar ' +
      'los acontecimientos enriquece la comprensión de la audiencia y genera contenidos de valor.',
  },
  {
    nombre: 'MEJOR COMUNICADORA DE DEPORTES',
    fuenteExcel: 'MEJOR COMENTARISTA DEPORTIVO (MUJERES)',
    disciplina: 'Deportes',
    tipo: 'persona',
    etiquetaMeta: null,
    descripcion:
      'Reconoce a la profesional que combina conocimiento, elocuencia y pasión para analizar y ' +
      'comunicar los acontecimientos deportivos. Sus comentarios, fundamentados y sólidos, aportan ' +
      'profundidad, contexto y una mirada especializada que enriquece la información para la audiencia.',
  },
  {
    nombre: 'MEJOR CUENTA DIGITAL DE DEPORTES',
    fuenteExcel: 'MEJOR CUENTA DIGITAL DE DEPORTES',
    disciplina: 'Deportes',
    tipo: 'cuenta',
    etiquetaMeta: 'Plataforma',
    descripcion:
      'Reconoce a la cuenta digital que brinda una cobertura dinámica y relevante de los ' +
      'acontecimientos deportivos, acompañada de análisis y contenidos de interés para los ' +
      'aficionados. Se considera su alcance, calidad y capacidad de generar una comunidad activa, ' +
      'con un mínimo de 50.000 seguidores o suscriptores.',
  },
  {
    nombre: 'MEJOR CONDUCTOR DE PROGRAMAS DE VARIEDADES',
    fuenteExcel: 'MEJOR CONDUCTOR DE VARIEDADES',
    disciplina: 'Variedades',
    tipo: 'persona',
    etiquetaMeta: null,
    descripcion:
      'Reconoce al profesional que, a través de su carisma, espontaneidad y capacidad de ' +
      'comunicación, logra entretener y conectar con la audiencia. Su desempeño aporta dinamismo, ' +
      'creatividad y ritmo a los programas de variedades.',
  },
  {
    nombre: 'MEJOR CONDUCTORA DE PROGRAMAS DE VARIEDADES',
    fuenteExcel: 'MEJOR CONDUCTORA DE VARIEDADES',
    disciplina: 'Variedades',
    tipo: 'persona',
    etiquetaMeta: null,
    descripcion:
      'Premia a la profesional que cautiva a la audiencia con su encanto, energía y naturalidad ' +
      'frente a cámara. Su capacidad para conectar con el público, conducir diferentes segmentos y ' +
      'generar entretenimiento enriquece la experiencia del programa.',
  },
  {
    nombre: 'MEJOR PROGRAMA DE VARIEDADES',
    fuenteExcel: 'MEJOR PROGRAMA DE VARIEDADES',
    disciplina: 'Variedades',
    tipo: 'programa',
    etiquetaMeta: 'Canal',
    descripcion:
      'Reconoce al programa de variedades que combina creatividad, entretenimiento y contenido de ' +
      'calidad para ofrecer una experiencia atractiva y dinámica a su audiencia. Se consideran ' +
      'propuestas transmitidas tanto en medios convencionales como en plataformas digitales, ' +
      'capaces de generar conexión y participación del público.',
  },
  {
    nombre: 'MEJOR ANIMADOR DE PROGRAMA DE CONCURSOS',
    fuenteExcel: null,
    disciplina: 'Concursos',
    tipo: 'persona',
    etiquetaMeta: null,
    descripcion:
      'Reconoce al profesional que imprime energía, ritmo y emoción al desarrollo de las ' +
      'competencias. Su capacidad para interactuar con participantes y audiencia, conducir las ' +
      'dinámicas y mantener la expectativa convierte cada momento del concurso en una experiencia ' +
      'entretenida.',
  },
  {
    nombre: 'MEJOR ANIMADORA DE PROGRAMA DE CONCURSOS',
    fuenteExcel: null,
    disciplina: 'Concursos',
    tipo: 'persona',
    etiquetaMeta: null,
    descripcion:
      'Premia a la profesional que, con espontaneidad, energía y dominio escénico, guía las ' +
      'diferentes dinámicas y competencias del programa. Su conexión con participantes y audiencia ' +
      'aporta ritmo, emoción y dinamismo al desarrollo del concurso.',
  },
  {
    nombre: 'MEJOR PROGRAMA DE CONCURSOS',
    fuenteExcel: null,
    disciplina: 'Concursos',
    tipo: 'programa',
    etiquetaMeta: 'Canal',
    descripcion:
      'Reconoce al programa que, mediante retos, competencias y dinámicas originales, logra ' +
      'generar emoción, participación y entretenimiento. Se valora la creatividad del formato, el ' +
      'desarrollo de las competencias y su capacidad para mantener la expectativa y el interés de ' +
      'la audiencia.',
  },
  {
    nombre: 'MEJOR ACTOR',
    fuenteExcel: 'MEJOR ACTOR',
    disciplina: 'Dramáticos',
    tipo: 'persona',
    etiquetaMeta: null,
    descripcion:
      'Reconoce al talento por su capacidad para dar vida a personajes diversos con naturalidad, ' +
      'fuerza y credibilidad. Su dominio de la expresión corporal y emocional le permite asumir ' +
      'diferentes roles y construir actuaciones que conectan con la audiencia.',
  },
  {
    nombre: 'MEJOR ACTRIZ',
    fuenteExcel: 'MEJOR ACTRIZ',
    disciplina: 'Dramáticos',
    tipo: 'persona',
    etiquetaMeta: null,
    descripcion:
      'Premia a la profesional que logra construir personajes auténticos y transmitir sus emociones ' +
      'con sensibilidad y profundidad. Su expresividad, versatilidad y capacidad para conectar con ' +
      'cada historia enriquecen la experiencia audiovisual.',
  },
  {
    // NUEVA. En el Excel de 2023 había DOS categorías de Instagram (Senior y
    // Junior) y aquí sólo hay una, con un mínimo de 250.000 seguidores que
    // aquellas no exigían. Volcar sus prenominados aquí metería gente que
    // quizá no califica, así que nace vacía a la espera del listado 2026.
    nombre: 'MEJOR CREADOR DE CONTENIDO DE INSTAGRAM',
    fuenteExcel: null,
    disciplina: 'Digital',
    tipo: 'cuenta',
    etiquetaMeta: 'Usuario',
    descripcion:
      'Reconoce al creador que desarrolla contenido original, creativo y atractivo, logrando ' +
      'conectar de manera constante con su comunidad en Instagram. Se valora la calidad de sus ' +
      'publicaciones, su identidad y capacidad para generar interacción, con un mínimo de 250.000 ' +
      'seguidores.',
  },
  {
    nombre: 'MEJOR TIKTOKER',
    fuenteExcel: null,
    disciplina: 'Digital',
    tipo: 'cuenta',
    etiquetaMeta: 'Usuario',
    descripcion:
      'Reconoce al creador que sobresale por su capacidad para desarrollar contenidos dinámicos, ' +
      'originales y de alto impacto en TikTok, aprovechando las tendencias y recursos propios de ' +
      'la plataforma. Se valora su creatividad, alcance y capacidad para generar una comunidad ' +
      'activa, con un mínimo de 1.000.000 de seguidores.',
  },
  {
    nombre: 'MEJOR CREADOR DE CONTENIDO EMPRESARIAL',
    fuenteExcel: null,
    disciplina: 'Digital',
    tipo: 'cuenta',
    etiquetaMeta: 'Usuario',
    descripcion:
      'Destaca y premia a empresas, marcas o instituciones de cualquier rubro que gestionan ' +
      'contenido propio en redes sociales, sea con equipo interno o una agencia. Se consideran a ' +
      'quienes hayan producido contenido consistente durante el año 2026, no una campaña puntual o ' +
      'aislada, y que tengan al menos 65.000 seguidores en la plataforma principal (Instagram o ' +
      'TikTok).',
  },
];

/** Condición general de nominación, común a todas las categorías. */
export const REQUISITO_NOMINACION =
  'Es requisito para ser nominado en todas las categorías que esté ejerciendo su ' +
  'profesión de forma activa durante el año 2026 y, en el caso de las cuentas ' +
  'digitales, haber generado contenido durante el año 2026. Las categorías que ' +
  'premian a talentos incluyen radio, televisión y/o medios digitales.';
