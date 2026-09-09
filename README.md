# Premios ITV · 30 Años — Portal de Prenominados

Aplicación web pública para **consultar** la lista oficial de prenominados de los
Premios ITV: categorías, listado completo, buscador global y cronograma.

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

`npm run build` produce HTML estático en `out/`, sin servidor. Se puede subir tal
cual a Netlify, Vercel, Cloudflare Pages, S3 o cualquier hosting con Apache/Nginx.

---

## Fuente de datos

- **Archivo:** `Nominados oficiales PREMIOS ITV 2023 (1).xlsx`, hoja `Hoja1`.
- **Estructura original:** una sola columna de nombres, con los encabezados de
  categoría (`MEJOR …`) intercalados entre bloques. La columna C guarda, según la
  categoría, el **canal**, la **plataforma** o el **usuario**.

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

### Publicar las fechas

Los archivos entregados no incluyen el cronograma de la edición 30 Años, así que
las fechas se muestran como **«Por confirmar»**. Para publicarlas basta editar
`EVENT_DATES`:

```ts
firstStageStart: { date: '2026-10-15', status: 'confirmed' },
```

`status: 'confirmed'` + `date` en ISO (`YYYY-MM-DD`) → se formatea solo en
español. Si prefieres un texto libre, añade `dateLabel: 'Del 15 al 30 de octubre'`.
Mientras `status` sea `'pending'`, la interfaz muestra el marcador y el aviso al
pie del cronograma. No hay que tocar ningún componente ni estilo.

---

## Rutas

| Ruta | Contenido |
|------|-----------|
| `/` | Portada: hero, buscador rápido, resumen por disciplina, categorías destacadas, cronograma |
| `/categorias/` | Las 18 categorías en una lista tipo **acordeón**: cada una despliega sus prenominados en su sitio |
| `/categoria/<slug>/` | Lista completa de una categoría + navegación anterior/siguiente |
| `/prenominados/` | Directorio completo con buscador, filtro y carga progresiva |
| `/buscar/?q=…` | Buscador global; agrupa por nombre y muestra todas sus categorías |
| `/fechas/` | Cronograma detallado |
| `/sitemap.xml`, `/robots.txt` | SEO |

Las 18 páginas de categoría se generan con `generateStaticParams` y cada una
tiene su propio `<title>`, `description`, Open Graph y `canonical`.

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

`src/lib/text.ts` normaliza el texto (minúsculas, sin acentos, ñ→n, sin
puntuación) y `src/lib/search.ts` busca sobre un índice precalculado que incluye
**nombre + canal/plataforma/usuario + nombre de la categoría**.

- `alex` encuentra `ÁLEX`; `cordova` encuentra `CÓRDOVA`.
- Todos los términos deben coincidir; se aceptan coincidencias parciales.
- La búsqueda recorre **siempre** la base completa; el filtro por categoría se
  aplica encima, de modo que ambos controles se combinan.
- Los resultados de `/buscar` se agrupan por nombre: quien aparece en varias
  categorías se muestra una sola vez con todas ellas enlazadas.

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

`/categorias/` muestra las 18 categorías en una sola lista vertical. Al tocar
una, su lista completa de prenominados se despliega ahí mismo:

- **Una abierta a la vez**, para que la página siga siendo corta y recorrible.
- El contenido de cada panel **se monta sólo al abrirlo** y se descarta al
  cerrarlo, así que nunca hay 600 filas en el DOM.
- Las cabeceras de disciplina (Noticias, Deportes…) son separadores dentro de la
  misma lista y conservan los anclajes `#noticias`, `#deportes`… que usa la
  portada.
- En móvil el conteo se muestra en línea bajo el título (`NOTICIAS · 83
  PRENOMINADOS`) para que el nombre disponga de todo el ancho; desde 560 px
  reaparece como pastilla a la derecha.
- Accesible: `<button aria-expanded aria-controls>` dentro del encabezado y el
  panel como `role="region"` etiquetado por ese encabezado.

Cada categoría conserva además su página propia en `/categoria/<slug>/`, con su
`<title>`, `description`, Open Graph y `canonical`, para enlaces directos y SEO.
El enlace «Abrir categoría» al pie de cada panel lleva allí.

### Accesibilidad

Enlace «Saltar al contenido», landmarks semánticos, un solo `<h1>` por página,
`aria-label` en cada `nav`, `aria-current` en el enlace activo, `aria-live` en el
contador de resultados, foco visible en todo el sitio, etiquetas asociadas a cada
control y respeto por `prefers-reduced-motion`.
