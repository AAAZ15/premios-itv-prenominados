# Premios ITV · 30 Años — Portal de Prenominados

Aplicación web pública para **consultar** la lista oficial de prenominados de los
Premios ITV: categorías, listado completo, buscador global y cronograma.

**En vivo:** https://aaaz15.github.io/premios-itv-prenominados/

> **No es una plataforma de votación.** No incluye botones de votar, formularios,
> conteos, rankings, resultados, autenticación ni registro de usuarios.

---

## Puesta en marcha

```bash
npm install
npm run data      # 1. Lee el Excel y genera los datos + reporte de validación
npm run build     # 2. Genera el sitio estático en ./out
npm run verify    # 3. Comprueba que lo publicado coincide con el Excel
```

Para desarrollo:

```bash
npm run dev       # http://localhost:4300
```

Para previsualizar el sitio tal como se publicará:

```bash
npx serve out -p 4400
```

> El servidor de desarrollo de Next 16 (Turbopack) puede dejar inertes los
> controles del directorio por un problema de recarga en caliente. El
> comportamiento real es el del build estático (`npm run build` + `serve out`);
> verifica ahí cualquier cambio de interacción.

### Despliegue

`npm run build` produce HTML estático en `out/`, sin servidor: sirve para
GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3 o Apache/Nginx.

**Publicación actual — GitHub Pages, automática.** Cada `git push` a `main`
dispara `.github/workflows/deploy.yml`, que compila y publica en
https://aaaz15.github.io/premios-itv-prenominados/. No hay que hacer nada más:

```bash
git add -A && git commit -m "…" && git push
```

Dos variables de entorno controlan dónde vive el sitio (las fija el workflow;
en local no hacen falta):

| Variable | Para qué |
|----------|----------|
| `NEXT_PUBLIC_BASE_PATH` | Subcarpeta desde la que se sirve. GitHub Pages usa `/premios-itv-prenominados`. Vacío = raíz del dominio. |
| `NEXT_PUBLIC_SITE_URL` | Dominio para `canonical`, Open Graph y sitemap. |

| `NEXT_PUBLIC_NOINDEX` | `1` bloquea la indexación (meta robots + robots.txt, y el sitemap se vacía). Lo usa el flujo de GitHub Pages para que la vista previa no compita con el dominio final. |

**Al pasar al dominio definitivo** (`www.premiositv.com`): deja las tres
variables sin definir —los valores por defecto ya apuntan ahí y la indexación
se activa sola— y añade redirecciones 301 desde las URLs de GitHub Pages.

> El archivo `public/_headers` que había antes **no servía de nada**: es una
> convención de Netlify y GitHub Pages la ignora, así que el `noindex` que se
> creía activo nunca lo estuvo. Por eso ahora se hace con `<meta name="robots">`
> y `robots.txt`, que respetan todos los buscadores y todos los hostings.

> El despliegue en Netlify quedó bloqueado por el límite de créditos de la
> cuenta (`Skipped due to account credit usage exceeded`); el proyecto
> `premios-itv-prenominados` está creado y configurado por si se retoma.

---

## Catálogo de categorías — la lista manda

`scripts/catalogo-2026.mjs` es la **fuente de verdad** de qué categorías
existen, cómo se llaman, en qué orden salen y qué texto las describe. El Excel
sólo aporta los nombres de los prenominados.

Cada entrada declara `fuenteExcel`:

- **un nombre** → sus prenominados salen de esa categoría del Excel (renombrada
  en la web si el nombre oficial cambió).
- **`null`** → categoría nueva: se publica con su descripción y el rótulo
  «Próximamente» hasta que llegue el listado con sus prenominados.

Las categorías del Excel que **no** figuren como `fuenteExcel` de ninguna
entrada quedan fuera de la web, y `npm run data` las enumera en el reporte.

Para actualizar: se edita ese archivo y se ejecuta `npm run data && npm run build`.

### Estado actual

| | |
|---|---|
| Libro fuente | `Lista de premios ITV 2026.xlsx` |
| Categorías publicadas | 19 (todas con prenominados) |
| Prenominados publicados | 728 |
| Nombres distintos | 691 |

Todas las categorías del catálogo tienen origen en el libro y ninguna categoría
del libro queda fuera. Dos se publican con el nombre del documento de
descripciones, que difiere del libro: *Mejor Conductor / Conductora de
**Programas de** Variedades*.

## Fuente de datos

- **Archivo:** el que declare `LIBRO_PRENOMINADOS` en el catálogo; hoy
  `Lista de premios ITV 2026.xlsx`.
- **Estructura:** una columna de nombres con los encabezados de categoría
  (`MEJOR …`) intercalados entre bloques, y a su derecha el **canal**, la
  **plataforma**, el **usuario** o la **cuenta**, según la categoría.
- La columna de los nombres **se detecta sola** (la edición 2023 usaba la A y la
  de 2026 la B), igual que la hoja: se lee la primera del libro.

`scripts/build-data.mjs` la convierte en una estructura limpia:

```
src/data/generated/prenominados.json
├── meta        { source, generatedAt, totales }
├── categories  [{ id, slug, name, order, discipline, entryType, metaLabel, count, sourceRow }]
└── nominees    [{ id, name, meta, categoryId, type, order, sourceRow }]
```

**Reglas que respeta el script:**

- No inventa nombres ni categorías.
- No corrige los nombres originales: las inconsistencias se **reportan**, no se editan.
- Sólo elimina repeticiones **exactas** dentro de una misma categoría, y deja
  constancia de cada una en el reporte.
- `discipline` y `entryType` se **derivan** del nombre de la categoría (no vienen
  del Excel); sirven únicamente para agrupar y etiquetar en la interfaz.

Para usar otro archivo:

```bash
npm run data -- "/ruta/al/nuevo.xlsx"
npm run build
```

### Validación

Cada ejecución escribe `data-report.md` con el conteo por categoría, los
duplicados omitidos, las posibles inconsistencias de escritura y los nombres
presentes en más de una categoría.

`npm run verify` vuelve a leer el Excel de forma independiente y comprueba que
cada categoría, cada nombre y cada conteo aparezcan realmente en el HTML generado.

---

## Configuración editable

Todo lo que cambia con frecuencia vive en **`src/data/config.ts`**:

- `SITE` — nombre, edición, lema, URL, correo de contacto.
- `EVENT_DATES` — las cinco fechas del proceso.
- `TIMELINE` — las tres etapas y sus hitos.
- `NAV_LINKS` — el menú.
- `PAGE_SIZE` — cuántos registros añade cada «Cargar más».

### Cronograma

Las fechas del proceso están confirmadas en `EVENT_DATES`:

| Hito | Fecha |
|------|-------|
| Primera etapa · inicio | 28 de septiembre de 2026 |
| Primera etapa · cierre | 18 de octubre de 2026 |
| Segunda etapa · inicio | 19 de octubre de 2026 |
| Segunda etapa · cierre | 17 de noviembre de 2026 |
| Ceremonia | 17 de noviembre de 2026, 8:00 pm |

Para cambiar cualquiera basta editar ese objeto; la interfaz formatea sola en
español y no hay que tocar componentes ni estilos:

```ts
firstStageEnd: { date: '2026-10-20', status: 'confirmed' },
eventDate:     { date: '2026-11-17', time: '20:00', status: 'confirmed' },
```

- `date` en ISO (`YYYY-MM-DD`).
- `time` opcional, `HH:MM` en 24 h; se muestra bajo la fecha.
- `dateLabel` opcional para un texto libre (`'Del 15 al 30 de octubre'`).
- `status: 'pending'` vuelve a mostrar «Por confirmar» e ignora `date`; si
  todas quedan pendientes reaparece el aviso al pie del cronograma.

---

## Estructura: una sola página

Todo el portal vive en `/`. El menú no navega: desplaza entre secciones.

| Ancla | Sección |
|-------|---------|
| `#inicio` | Hero conmemorativo |
| `#prenominados` | Buscador global (con filtro por categoría). **No lista nada hasta que se busca** |
| `#categorias` | Resumen por disciplina + las 18 categorías en acordeón |
| `#fechas` | Cronograma del proceso |

`#cat-<slug>` es un ancla profunda: abre esa categoría del acordeón y desplaza
hasta ella. La usan los resultados de búsqueda y funciona también al entrar
directamente con esa URL (`/#cat-mejor-actriz`).

### Por qué el desplazamiento no es el nativo del navegador

`SmoothAnchors` intercepta los clics en `href="#…"` y desplaza midiendo la
altura real del encabezado fijo. El anclaje nativo dejaba el destino 153 px
por debajo del sitio correcto —`scroll-padding-top` se descuadra cuando el
contenido de arriba cambia de alto— y además hay que dejar que el acordeón
monte la categoría antes de medir dónde está.

### Rutas que siguen existiendo

| Ruta | Para qué |
|------|----------|
| `/categoria/<slug>/` | 18 páginas con `<title>`, `description`, Open Graph y `canonical` propios |
| `/sitemap.xml`, `/robots.txt` | SEO |

Las páginas de categoría **no forman parte de la navegación**: ningún enlace
del portal lleva a ellas. Existen porque el contenido del portal se monta en
el cliente (el acordeón carga cada lista al abrirla), así que son lo único
indexable con los nombres de los prenominados; y porque cualquier enlace ya
compartido debe seguir funcionando. Cada una remite al portal con «Ver en el
portal» (`/#cat-<slug>`). Si se prefiere eliminarlas, basta borrar
`src/app/categoria/` y quitarlas del sitemap.

---

## Arquitectura

```
src/
├── app/            Rutas (App Router) y sus estilos de página
├── components/     Componentes reutilizables + CSS Modules
├── data/
│   ├── config.ts   Configuración editable (fechas, textos, navegación)
│   ├── index.ts    Única puerta de acceso a los datos
│   └── generated/  JSON generado desde el Excel (no editar a mano)
├── lib/            types.ts · text.ts (normalización) · search.ts
└── styles/         globals.css (tokens del design system)
scripts/            build-data.mjs · verify-data.mjs
```

Los datos **no** están mezclados con los componentes: todo pasa por
`src/data/index.ts`. Para conectar una base de datos más adelante basta cambiar
la carga de `dataset` en ese archivo respetando los tipos de `src/lib/types.ts`.

La arquitectura deja espacio para añadir votación, autenticación, resultados o
administración en el futuro (rutas nuevas + una capa de API), pero **hoy no se
implementa nada de eso**.

### Buscador

Con el campo vacío **no se muestra ningún registro**: volcar los 600 de golpe
abrumaba la página, y los prenominados se consultan por categoría en el
acordeón. En reposo aparece `IdleHint` con ejemplos de búsqueda; los
resultados sólo se calculan y se pintan cuando hay texto o categoría elegida.

`src/lib/text.ts` normaliza el texto (minúsculas, sin acentos, ñ→n, sin
puntuación) y `src/lib/search.ts` busca sobre un índice precalculado que incluye
**nombre + canal/plataforma/usuario + nombre de la categoría**.

- `alex` encuentra `ÁLEX`; `cordova` encuentra `CÓRDOVA`.
- Todos los términos deben coincidir; se aceptan coincidencias parciales.
- La búsqueda recorre **siempre** la base completa; el filtro por categoría se
  aplica encima, de modo que ambos controles se combinan.
- Cada coincidencia se lista con su categoría; quien aparece en varias sale
  una vez por cada una y cada fila lleva a su categoría en el acordeón.

### Rendimiento

Índice de búsqueda construido una única vez, `useMemo` en los filtros, carga
progresiva de 60 en 60 y HTML estático por ruta.

---

## Diseño

Traducción a componentes del design system **«Gala Broadcast Luminance»**
(Google Stitch): fondo de bóveda oscura con haces de luz y líneas curvas
luminosas, superficies de cristal esmerilado, cantos plateados, halo cian en los
estados activos, Montserrat en versales para los títulos e Inter para el texto.

Los tokens están en `src/styles/globals.css`; cada componente añade su propio
CSS Module.

**Diferencia deliberada con el mockup:** Stitch muestra tarjetas grandes con
fotografía. Con 600 registros eso resulta impracticable, así que se conserva la
estética de esas tarjetas para las **categorías** y se usa un **listado
editorial numerado** para los prenominados. No se usan fotografías: las imágenes
de la referencia son sólo identidad gráfica, no retratos reales.

### Acordeón de categorías

La sección `#categorias` muestra seis categorías y una flecha que revela las
18. Al tocar una, su lista completa de prenominados se despliega ahí mismo:

- **Una abierta a la vez**, para que la página siga siendo recorrible.
- El contenido de cada panel **se monta sólo al abrirlo** y se descarta al
  cerrarlo, así que nunca hay 600 filas en el DOM.
- Ordenadas de mayor a menor número de prenominados: al desplegar, las seis ya
  visibles no cambian de sitio.
- En móvil el conteo se muestra en línea bajo el título (`NOTICIAS · 83
  PRENOMINADOS`) para que el nombre disponga de todo el ancho; desde 560 px
  reaparece como pastilla a la derecha.
- Accesible: `<button aria-expanded aria-controls>` dentro del encabezado y el
  panel como `role="region"` etiquetado por ese encabezado.

### Accesibilidad

Enlace «Saltar al contenido», landmarks semánticos, un solo `<h1>` por página,
`aria-label` en cada `nav`, `aria-current` en el enlace activo, `aria-live` en el
contador de resultados, foco visible en todo el sitio, etiquetas asociadas a cada
control y respeto por `prefers-reduced-motion`.
