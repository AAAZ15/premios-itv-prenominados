/**
 * verify-data.mjs
 * ---------------------------------------------------------------------------
 * Comprueba, de forma independiente al generador, que lo publicado en la web
 * coincide con lo que mandan el catálogo oficial 2026 y el Excel:
 *
 *   1. Las categorías publicadas son EXACTAMENTE las del catálogo, en su orden.
 *   2. Cada categoría con origen en el Excel lleva sus mismos nombres y conteo.
 *   3. Cada categoría nueva del catálogo se publica vacía.
 *   4. Todos esos nombres aparecen de verdad en el HTML generado.
 *
 * Uso:  npm run verify [-- "/ruta/al/archivo.xlsx"]
 * ---------------------------------------------------------------------------
 */

import fs from 'node:fs';
import path from 'node:path';
import * as XLSX from 'xlsx';
import { CATALOGO_2026, LIBRO_PRENOMINADOS } from './catalogo-2026.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');

/**
 * Localiza el Excel oficial. Prioridad:
 *   1. ruta pasada como argumento   2. variable ITV_XLSX
 *   3. el primer .xlsx de la carpeta que contiene al proyecto
 */
function resolveSource() {
  if (process.argv[2]) return process.argv[2];
  if (process.env.ITV_XLSX) return process.env.ITV_XLSX;

  const parent = path.resolve(ROOT, '..');

  const esperado = path.join(parent, LIBRO_PRENOMINADOS);
  if (fs.existsSync(esperado)) return esperado;

  const candidates = fs
    .readdirSync(parent)
    .filter((f) => /\.xlsx?$/i.test(f) && !f.startsWith('~$'))
    .map((f) => path.join(parent, f));

  if (candidates.length === 1) return candidates[0];
  console.error(`✖ No se pudo elegir el Excel automáticamente en ${parent}.`);
  process.exit(1);
}

const SOURCE = resolveSource();
console.log(`· Fuente: ${SOURCE}`);

/* ------------- 1) Recuento independiente desde el Excel ------------------ */
const wb = XLSX.read(fs.readFileSync(SOURCE), { type: 'buffer' });
// Primera hoja, y la columna donde de verdad están los encabezados «MEJOR …».
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' });

const hits = [];
for (const row of rows) {
  (row || []).forEach((cell, col) => {
    if (/^MEJOR/i.test(String(cell ?? '').trim())) hits[col] = (hits[col] ?? 0) + 1;
  });
}
const nameCol = hits.reduce((best, n, col) => (n > (hits[best] ?? 0) ? col : best), 0);

const excel = new Map();
let actual = null;
let vistos = new Set();
for (const r of rows) {
  const v = String(r[nameCol] ?? '').trim();
  if (!v) continue;
  if (/^MEJOR/i.test(v)) {
    actual = v;
    excel.set(v, []);
    vistos = new Set();
    continue;
  }
  if (!actual) continue;
  const key = v.toLowerCase();
  if (vistos.has(key)) continue; // duplicado exacto, igual que en el generador
  vistos.add(key);
  excel.get(actual).push(v);
}

/* ------------------------ 2) Lo realmente publicado ---------------------- */
const data = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/generated/prenominados.json'), 'utf8')
);

const problems = [];

if (data.categories.length !== CATALOGO_2026.length) {
  problems.push(
    `Categorías publicadas: ${data.categories.length}, catálogo: ${CATALOGO_2026.length}`
  );
}

CATALOGO_2026.forEach((entry, index) => {
  const cat = data.categories[index];
  if (!cat) {
    problems.push(`Falta la categoría #${index + 1}: «${entry.nombre}»`);
    return;
  }
  if (cat.name !== entry.nombre) {
    problems.push(`Posición ${index + 1}: se publica «${cat.name}», el catálogo dice «${entry.nombre}»`);
    return;
  }
  if (cat.description !== entry.descripcion) {
    problems.push(`«${entry.nombre}»: la descripción publicada no es la del catálogo`);
  }

  const publicados = data.nominees.filter((n) => n.categoryId === cat.id).map((n) => n.name);

  if (entry.fuenteExcel === null) {
    if (publicados.length > 0) {
      problems.push(`«${entry.nombre}» es nueva y no debería tener prenominados, tiene ${publicados.length}`);
    }
  } else {
    const esperados = excel.get(entry.fuenteExcel);
    if (!esperados) {
      problems.push(`«${entry.nombre}»: el Excel no tiene la categoría origen «${entry.fuenteExcel}»`);
      return;
    }
    if (publicados.length !== esperados.length) {
      problems.push(
        `«${entry.nombre}»: Excel ${esperados.length} vs publicados ${publicados.length}`
      );
    }
    const faltan = esperados.filter((n) => !publicados.includes(n));
    const sobran = publicados.filter((n) => !esperados.includes(n));
    if (faltan.length) problems.push(`«${entry.nombre}»: faltan ${JSON.stringify(faltan)}`);
    if (sobran.length) problems.push(`«${entry.nombre}»: sobran ${JSON.stringify(sobran)}`);
  }

  /* --------------- 3) ¿Están de verdad en el HTML generado? -------------- */
  const file = path.join(ROOT, 'out', 'categoria', cat.slug, 'index.html');
  if (!fs.existsSync(file)) {
    problems.push(`Falta el HTML: out/categoria/${cat.slug}/index.html`);
    return;
  }
  const html = fs.readFileSync(file, 'utf8');
  // El HTML escapa &, <, ' y también las comillas dobles (&quot;), que aparecen
  // en apodos como FÉLIX SEBASTIÁN "CEVICHE".
  const escapar = (n) =>
    n
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  const ausentes = publicados.filter((n) => !html.includes(escapar(n)) && !html.includes(n));
  if (ausentes.length) {
    problems.push(`${cat.slug}: no aparecen en el HTML ${JSON.stringify(ausentes)}`);
  }
});

/* ----------------------------- 4) Resumen -------------------------------- */
const usadas = new Set(CATALOGO_2026.map((e) => e.fuenteExcel).filter(Boolean));
const excluidas = [...excel.keys()].filter((n) => !usadas.has(n));
const vacias = CATALOGO_2026.filter((e) => e.fuenteExcel === null);

console.log(`Categorías publicadas: ${data.categories.length} (catálogo 2026)`);
console.log(`Prenominados publicados: ${data.nominees.length}`);
console.log(`Categorías del Excel excluidas: ${excluidas.length}`);
excluidas.forEach((n) => console.log(`   · ${n} (${excel.get(n).length} prenominados)`));
console.log(`Categorías nuevas sin prenominados: ${vacias.length}`);
vacias.forEach((e) => console.log(`   · ${e.nombre}`));

console.log(
  problems.length
    ? '\nPROBLEMAS:\n' + problems.join('\n')
    : '\n✔ Sin discrepancias: el catálogo, el Excel y el HTML publicado coinciden.'
);
process.exit(problems.length ? 1 : 0);
