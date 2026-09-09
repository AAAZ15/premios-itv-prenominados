/**
 * build-data.mjs
 * ---------------------------------------------------------------------------
 * Convierte el Excel oficial de prenominados en una estructura de datos limpia
 * para el frontend (src/data/generated/prenominados.json) y genera un reporte
 * de validación (data-report.md).
 *
 * Reglas:
 *  - NO se inventan nombres ni categorías.
 *  - NO se corrigen los nombres originales (los errores se reportan, no se editan).
 *  - Sólo se eliminan repeticiones EXACTAS de un mismo nombre dentro de una
 *    misma categoría, y cada eliminación queda registrada en el reporte.
 *
 * Uso:  npm run data -- "/ruta/al/archivo.xlsx"
 *       (sin argumento usa DEFAULT_SOURCE)
 * ---------------------------------------------------------------------------
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

/**
 * Localiza el Excel oficial. Prioridad:
 *   1. ruta pasada como argumento   2. variable ITV_XLSX
 *   3. el primer .xlsx de la carpeta que contiene al proyecto
 */
function resolveSource() {
  if (process.argv[2]) return process.argv[2];
  if (process.env.ITV_XLSX) return process.env.ITV_XLSX;

  const parent = path.resolve(ROOT, '..');
  const candidates = fs
    .readdirSync(parent)
    .filter((f) => /\.xlsx?$/i.test(f) && !f.startsWith('~$'))
    .map((f) => path.join(parent, f));

  if (candidates.length === 1) return candidates[0];
  if (candidates.length > 1) {
    console.error(
      `✖ Hay varios Excel en ${parent}:\n  - ${candidates
        .map((c) => path.basename(c))
        .join('\n  - ')}\n  Indica cuál usar:  npm run data -- "ruta/al/archivo.xlsx"`
    );
    process.exit(1);
  }
  console.error(`✖ No se encontró ningún .xlsx en ${parent}.`);
  process.exit(1);
}

const SOURCE = resolveSource();

/* -------------------------------------------------------------------------- */
/* Utilidades de texto                                                        */
/* -------------------------------------------------------------------------- */

const clean = (v) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : v == null ? '' : String(v).trim();

export const normalize = (s) =>
  clean(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[´`'’]/g, '')
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const slugify = (s) =>
  clean(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/* -------------------------------------------------------------------------- */
/* Clasificación de categorías                                                */
/* -------------------------------------------------------------------------- */

/**
 * La disciplina y el tipo de registro se DERIVAN del nombre de la categoría
 * (no provienen del Excel). Sirven sólo para agrupar y etiquetar en la interfaz.
 */
function classifyCategory(name) {
  const n = normalize(name);

  let discipline = 'Otras';
  if (/noticia|informativ|reporter/.test(n)) discipline = 'Noticias';
  else if (/deport|narrador|comentarista/.test(n)) discipline = 'Deportes';
  else if (/variedad/.test(n)) discipline = 'Variedades';
  else if (/actor|actriz|dramatic/.test(n)) discipline = 'Dramáticos';
  else if (/instagram|youtub|digital|cuenta/.test(n)) discipline = 'Digital';

  // Tipo de registro y significado de la columna auxiliar del Excel.
  let entryType = 'persona';
  let metaLabel = null;

  if (/mejor programa/.test(n)) {
    entryType = 'programa';
    metaLabel = 'Canal';
  } else if (/cuenta informativa digital/.test(n)) {
    entryType = 'medio';
    metaLabel = 'Plataforma';
  } else if (/cuenta digital/.test(n)) {
    entryType = 'cuenta';
    metaLabel = 'Plataforma';
  } else if (/instagram/.test(n)) {
    entryType = 'cuenta';
    metaLabel = /junior/.test(n) ? 'Usuario' : null;
  } else if (/youtuber/.test(n)) {
    entryType = 'cuenta';
    metaLabel = 'Canal';
  }

  return { discipline, entryType, metaLabel };
}

/**
 * Una fila es encabezado de categoría cuando empieza por "MEJOR".
 * (Es el único patrón presente en el archivo oficial; si aparece otro,
 * el reporte lo advierte como fila fuera de categoría.)
 */
const isCategoryHeader = (value) => /^mejor\b/.test(normalize(value));

/* -------------------------------------------------------------------------- */
/* Parseo                                                                     */
/* -------------------------------------------------------------------------- */

function parseWorkbook(file) {
  const wb = XLSX.read(fs.readFileSync(file), { type: 'buffer' });
  const warnings = [];
  const notes = [];
  const categories = [];
  const nominees = [];
  const orphanRows = [];

  let categoryOrder = 0;
  let nomineeId = 0;

  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: true, defval: '' });
    if (!rows.length) {
      notes.push(`Hoja "${sheetName}": vacía, se ignora.`);
      continue;
    }

    let current = null;
    const seenInCategory = new Map(); // normalizado -> fila original

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] || [];
      const name = clean(row[0]);
      const metaRaw = clean(row[2]) || clean(row[1]); // col C, con col B como respaldo
      const rowNumber = i + 1;

      if (!name) continue;

      if (isCategoryHeader(name)) {
        const slug = slugify(name);
        const meta = classifyCategory(name);
        current = {
          id: slug,
          slug,
          name,
          order: categoryOrder++,
          sourceRow: rowNumber,
          sourceSheet: sheetName,
          ...meta,
          count: 0,
        };
        categories.push(current);
        seenInCategory.clear();
        continue;
      }

      // Encabezados/instrucciones del archivo previos a la primera categoría.
      if (!current) {
        orphanRows.push({ sheet: sheetName, row: rowNumber, value: name });
        continue;
      }

      const key = normalize(name);
      if (seenInCategory.has(key)) {
        warnings.push(
          `Duplicado exacto omitido — "${name}" aparece dos veces en «${current.name}» ` +
            `(filas ${seenInCategory.get(key)} y ${rowNumber} de la hoja "${sheetName}").`
        );
        continue;
      }
      seenInCategory.set(key, rowNumber);

      nomineeId += 1;
      nominees.push({
        id: `n${String(nomineeId).padStart(4, '0')}`,
        name,
        meta: metaRaw || null,
        categoryId: current.id,
        type: current.entryType,
        order: current.count,
        sourceRow: rowNumber,
      });
      current.count += 1;
    }
  }

  return { categories, nominees, warnings, notes, orphanRows };
}

/* -------------------------------------------------------------------------- */
/* Validaciones                                                               */
/* -------------------------------------------------------------------------- */

function validate({ categories, nominees }) {
  const issues = [];

  // Categorías vacías
  for (const c of categories) {
    if (c.count === 0) issues.push(`Categoría sin prenominados: «${c.name}».`);
  }

  // Slugs duplicados
  const slugs = new Map();
  for (const c of categories) {
    if (slugs.has(c.slug)) {
      issues.push(`Slug repetido "${c.slug}" entre «${slugs.get(c.slug)}» y «${c.name}».`);
    }
    slugs.set(c.slug, c.name);
  }

  // Posibles variantes del mismo nombre dentro de una categoría
  // (mismas palabras en distinto orden, o diferencia de 1 carácter).
  const byCategory = new Map();
  for (const n of nominees) {
    if (!byCategory.has(n.categoryId)) byCategory.set(n.categoryId, []);
    byCategory.get(n.categoryId).push(n);
  }

  const similar = [];
  for (const [categoryId, list] of byCategory) {
    const catName = categories.find((c) => c.id === categoryId)?.name ?? categoryId;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = normalize(list[i].name);
        const b = normalize(list[j].name);
        const sameWords =
          a.split(' ').slice().sort().join(' ') === b.split(' ').slice().sort().join(' ');
        if (sameWords || levenshteinAtMost(a, b, 1)) {
          similar.push(
            `Posible variante del mismo registro en «${catName}»: ` +
              `"${list[i].name}" (fila ${list[i].sourceRow}) y "${list[j].name}" (fila ${list[j].sourceRow}).`
          );
        }
      }
    }
  }

  return { issues, similar };
}

function levenshteinAtMost(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return false;
  if (a === b) return true;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = curr;
  }
  return prev[b.length] <= max;
}

/* -------------------------------------------------------------------------- */
/* Salida                                                                     */
/* -------------------------------------------------------------------------- */

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`✖ No se encontró el Excel: ${SOURCE}`);
    process.exit(1);
  }
  console.log(`· Fuente: ${SOURCE}`);

  const parsed = parseWorkbook(SOURCE);
  const { categories, nominees, warnings, notes, orphanRows } = parsed;
  const { issues, similar } = validate(parsed);

  // Personas/cuentas presentes en más de una categoría (dato útil, no un error).
  const acrossCategories = new Map();
  for (const n of nominees) {
    const key = normalize(n.name);
    if (!acrossCategories.has(key)) acrossCategories.set(key, []);
    acrossCategories.get(key).push(n);
  }
  const multiCategory = [...acrossCategories.values()]
    .filter((list) => new Set(list.map((n) => n.categoryId)).size > 1)
    .map((list) => ({
      name: list[0].name,
      categories: [...new Set(list.map((n) => n.categoryId))],
    }));

  const payload = {
    meta: {
      source: path.basename(SOURCE),
      generatedAt: new Date().toISOString(),
      totalCategories: categories.length,
      totalNominees: nominees.length,
    },
    categories: categories.map(({ sourceSheet, ...c }) => c),
    nominees,
  };

  const outDir = path.join(ROOT, 'src', 'data', 'generated');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'prenominados.json'),
    JSON.stringify(payload, null, 2) + '\n',
    'utf8'
  );

  /* ----------------------------- Reporte ---------------------------------- */
  const lines = [];
  lines.push('# Reporte de datos — Prenominados Premios ITV');
  lines.push('');
  lines.push(`- **Archivo fuente:** \`${path.basename(SOURCE)}\``);
  lines.push(`- **Generado:** ${new Date().toISOString()}`);
  lines.push(`- **Categorías:** ${categories.length}`);
  lines.push(`- **Registros de prenominados:** ${nominees.length}`);
  lines.push('');
  lines.push('## Categorías detectadas');
  lines.push('');
  lines.push('| # | Categoría | Prenominados | Disciplina | Tipo | Fila origen |');
  lines.push('|---|-----------|--------------|------------|------|-------------|');
  categories.forEach((c, i) => {
    lines.push(
      `| ${i + 1} | ${c.name} | ${c.count} | ${c.discipline} | ${c.entryType} | ${c.sourceRow} |`
    );
  });
  lines.push('');

  const section = (title, items, empty) => {
    lines.push(`## ${title}`);
    lines.push('');
    if (!items.length) lines.push(`_${empty}_`);
    else items.forEach((t) => lines.push(`- ${t}`));
    lines.push('');
  };

  section(
    'Filas fuera de categoría (encabezado del archivo)',
    orphanRows.map((o) => `Fila ${o.row}: "${o.value.slice(0, 160)}${o.value.length > 160 ? '…' : ''}"`),
    'Ninguna.'
  );
  section('Duplicados exactos omitidos', warnings, 'Ninguno.');
  section('Notas del archivo', notes, 'Sin notas.');
  section('Problemas de estructura', issues, 'Ninguno.');
  section(
    'Posibles inconsistencias de escritura (NO corregidas — revisar manualmente)',
    similar,
    'Ninguna detectada.'
  );
  section(
    'Registros presentes en más de una categoría (esperado)',
    multiCategory.map((m) => `${m.name} → ${m.categories.join(', ')}`),
    'Ninguno.'
  );

  fs.writeFileSync(path.join(ROOT, 'data-report.md'), lines.join('\n') + '\n', 'utf8');

  console.log(`✔ ${categories.length} categorías, ${nominees.length} prenominados`);
  console.log(`✔ src/data/generated/prenominados.json`);
  console.log(`✔ data-report.md`);
  if (warnings.length) console.log(`⚠ ${warnings.length} duplicado(s) exacto(s) omitido(s)`);
  if (similar.length) console.log(`⚠ ${similar.length} posible(s) inconsistencia(s) de escritura`);
}

main();
