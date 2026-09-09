import fs from 'node:fs';
import path from 'node:path';
import * as XLSX from 'xlsx';

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
console.log(`· Fuente: ${SOURCE}`);

// 1) Recuenta directamente desde el Excel (independiente del generador).
const wb = XLSX.read(fs.readFileSync(SOURCE), { type: 'buffer' });
const rows = XLSX.utils.sheet_to_json(wb.Sheets['Hoja1'], { header: 1, defval: '' });
const excel = new Map();
let cur = null;
const seen = new Set();
for (const r of rows) {
  const v = String(r[0] ?? '').trim();
  if (!v) continue;
  if (/^MEJOR/i.test(v)) { cur = v; excel.set(v, []); seen.clear(); continue; }
  if (!cur) continue;
  const key = v.toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  excel.get(cur).push(v);
}

// 2) Lee lo que realmente se publicó.
const data = JSON.parse(fs.readFileSync('src/data/generated/prenominados.json', 'utf8'));
const bySlug = new Map(data.categories.map(c => [c.slug, c]));

let problems = [];
if (excel.size !== data.categories.length)
  problems.push(`Categorías: Excel ${excel.size} vs app ${data.categories.length}`);

for (const [name, names] of excel) {
  const cat = data.categories.find(c => c.name === name);
  if (!cat) { problems.push(`Falta categoría en la app: ${name}`); continue; }
  if (cat.count !== names.length)
    problems.push(`${name}: Excel ${names.length} vs app ${cat.count}`);
  const appNames = data.nominees.filter(n => n.categoryId === cat.id).map(n => n.name);
  const missing = names.filter(n => !appNames.includes(n));
  const extra = appNames.filter(n => !names.includes(n));
  if (missing.length) problems.push(`${name}: faltan ${JSON.stringify(missing)}`);
  if (extra.length) problems.push(`${name}: sobran ${JSON.stringify(extra)}`);

  // 3) Comprueba que el HTML estático contiene cada nombre.
  const file = path.join('out', 'categoria', cat.slug, 'index.html');
  if (!fs.existsSync(file)) { problems.push(`Falta HTML: ${file}`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const notRendered = names.filter(n => {
    const esc = n.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, '&#x27;');
    return !html.includes(esc) && !html.includes(n);
  });
  if (notRendered.length) problems.push(`${cat.slug}: no aparecen en el HTML ${JSON.stringify(notRendered)}`);
}

const totalExcel = [...excel.values()].reduce((a, b) => a + b.length, 0);
console.log(`Categorías Excel: ${excel.size} | app: ${data.categories.length}`);
console.log(`Prenominados Excel: ${totalExcel} | app: ${data.nominees.length}`);
console.log(`Páginas de categoría generadas: ${fs.readdirSync('out/categoria').length}`);
console.log(problems.length ? '\nPROBLEMAS:\n' + problems.join('\n') : '\n✔ Sin discrepancias: todas las categorías, nombres y conteos coinciden y están en el HTML.');
