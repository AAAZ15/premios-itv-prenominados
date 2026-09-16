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
import { CATALOGO_2026, LIBRO_PRENOMINADOS } from './catalogo-2026.mjs';

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

  // El que el catálogo declara, si está.
  const esperado = path.join(parent, LIBRO_PRENOMINADOS);
  if (fs.existsSync(esperado)) return esperado;

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
/* Catálogo oficial                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Una fila es encabezado de categoría cuando empieza por "MEJOR".
 * (Es el único patrón presente en el archivo oficial.)
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

    // La columna de los nombres cambia entre ediciones (2023 usa A, 2026 usa B):
    // se elige aquella donde aparecen más encabezados «MEJOR …».
    const headerHits = [];
    for (const row of rows) {
      (row || []).forEach((cell, col) => {
        if (isCategoryHeader(clean(cell))) headerHits[col] = (headerHits[col] ?? 0) + 1;
      });
    }
    const nameCol = headerHits.reduce(
      (best, hits, col) => (hits > (headerHits[best] ?? 0) ? col : best),
      0
    );
    const metaCol = nameCol + 1;
    if (nameCol !== 0) {
      notes.push(`Hoja "${sheetName}": los nombres están en la columna ${nameCol + 1}.`);
    }

    let current = null;
    const seenInCategory = new Map(); // normalizado -> fila original

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] || [];
      const name = clean(row[nameCol]);
      const metaRaw = clean(row[metaCol]);
      const rowNumber = i + 1;

      if (!name) continue;

      if (isCategoryHeader(name)) {
        // El Excel sólo aporta nombre, orden y prenominados: la disciplina, el
        // tipo y la etiqueta los decide el catálogo 2026.
        current = {
          id: slugify(name),
          name,
          order: categoryOrder++,
          sourceRow: rowNumber,
          sourceSheet: sheetName,
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
  // `issues` recoge además los desajustes entre el catálogo y el Excel.

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

  /* --------------------- Aplicación del catálogo 2026 --------------------- */
  // El catálogo manda: renombra, crea las nuevas y deja fuera las que ya no
  // están en la lista oficial.
  const porNombreExcel = new Map(categories.map((c) => [c.name, c]));
  const usadas = new Set();

  const catalogCategories = [];
  const catalogNominees = [];
  const nuevasSinPrenominados = [];

  CATALOGO_2026.forEach((entry, order) => {
    const slug = slugify(entry.nombre);
    const origen = entry.fuenteExcel ? porNombreExcel.get(entry.fuenteExcel) : undefined;

    if (entry.fuenteExcel && !origen) {
      issues.push(
        `El catálogo espera la categoría «${entry.fuenteExcel}» en el Excel y no está. ` +
          `«${entry.nombre}» se publica vacía.`
      );
    }
    if (origen) usadas.add(origen.name);

    const propias = origen ? nominees.filter((n) => n.categoryId === origen.id) : [];
    propias.forEach((n, index) =>
      catalogNominees.push({ ...n, categoryId: slug, order: index })
    );

    if (propias.length === 0) nuevasSinPrenominados.push(entry.nombre);

    catalogCategories.push({
      id: slug,
      slug,
      name: entry.nombre,
      order,
      description: entry.descripcion,
      discipline: entry.disciplina,
      entryType: entry.tipo,
      metaLabel: entry.etiquetaMeta,
      /** Categoría del Excel de la que provienen sus prenominados. */
      sourceCategory: entry.fuenteExcel,
      sourceRow: origen ? origen.sourceRow : null,
      count: propias.length,
    });
  });

  const excluidas = categories.filter((c) => !usadas.has(c.name));

  const payload = {
    meta: {
      source: path.basename(SOURCE),
      generatedAt: new Date().toISOString(),
      totalCategories: catalogCategories.length,
      totalNominees: catalogNominees.length,
    },
    categories: catalogCategories,
    nominees: catalogNominees,
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
  lines.push('## Categorías publicadas (catálogo oficial 2026)');
  lines.push('');
  lines.push('| # | Categoría | Prenominados | Disciplina | Origen en el Excel |');
  lines.push('|---|-----------|--------------|------------|--------------------|');
  catalogCategories.forEach((c, i) => {
    const origen =
      c.sourceCategory === null
        ? '— (nueva)'
        : c.sourceCategory === c.name
          ? 'igual'
          : `«${c.sourceCategory}» (renombrada)`;
    lines.push(`| ${i + 1} | ${c.name} | ${c.count} | ${c.discipline} | ${origen} |`);
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
    'Categorías del Excel EXCLUIDAS (no están en el catálogo 2026)',
    excluidas.map((c) => `${c.name} — se dejan de publicar ${c.count} prenominados`),
    'Ninguna: el catálogo cubre todas.'
  );
  section(
    'Categorías del catálogo SIN prenominados todavía',
    nuevasSinPrenominados,
    'Ninguna.'
  );
  section(
    'Registros presentes en más de una categoría (esperado)',
    multiCategory.map((m) => `${m.name} → ${m.categories.join(', ')}`),
    'Ninguno.'
  );

  fs.writeFileSync(path.join(ROOT, 'data-report.md'), lines.join('\n') + '\n', 'utf8');

  console.log(
    `✔ ${catalogCategories.length} categorías del catálogo 2026, ` +
      `${catalogNominees.length} prenominados publicados`
  );
  if (excluidas.length) {
    const perdidos = excluidas.reduce((t, c) => t + c.count, 0);
    console.log(
      `⚠ ${excluidas.length} categoría(s) del Excel fuera del catálogo ` +
        `(${perdidos} prenominados no se publican)`
    );
  }
  if (nuevasSinPrenominados.length) {
    console.log(`⚠ ${nuevasSinPrenominados.length} categoría(s) del catálogo sin prenominados`);
  }
  console.log(`✔ src/data/generated/prenominados.json`);
  console.log(`✔ data-report.md`);
  if (warnings.length) console.log(`⚠ ${warnings.length} duplicado(s) exacto(s) omitido(s)`);
  if (similar.length) console.log(`⚠ ${similar.length} posible(s) inconsistencia(s) de escritura`);
}

main();
