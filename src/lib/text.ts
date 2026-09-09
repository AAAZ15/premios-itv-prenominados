/**
 * Normalización de texto para búsqueda tolerante:
 * ignora mayúsculas, acentos, ñ/n, apóstrofos y puntuación.
 *
 *   normalizeText('ÁLEX PLÚAS')  -> 'alex pluas'
 *   normalizeText('Córdova')     -> 'cordova'
 */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[´`'’]/g, '')
    .replace(/[^a-z0-9ñ]+/g, ' ')
    .replace(/ñ/g, 'n')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Divide la consulta en términos; todos deben coincidir (AND). */
export function tokenize(query: string): string[] {
  const normalized = normalizeText(query);
  return normalized ? normalized.split(' ').filter(Boolean) : [];
}

/**
 * Coincidencia parcial: cada término debe aparecer en el texto,
 * ya sea al inicio de una palabra o dentro de ella.
 */
export function matchesTokens(haystack: string, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  return tokens.every((token) => haystack.includes(token));
}

/**
 * Puntuación para ordenar resultados: coincidencia exacta > inicio de
 * nombre > inicio de palabra > coincidencia interna.
 */
export function scoreMatch(haystack: string, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  let score = 0;
  for (const token of tokens) {
    if (haystack === token) score += 100;
    else if (haystack.startsWith(token)) score += 50;
    else if (haystack.includes(` ${token}`)) score += 25;
    else if (haystack.includes(token)) score += 10;
  }
  return score;
}

/**
 * Divide un texto en fragmentos marcando las coincidencias, respetando
 * los acentos originales (se trabaja sobre el texto normalizado y se
 * mapea de vuelta por índice).
 */
export function highlightSegments(
  text: string,
  tokens: string[]
): { text: string; match: boolean }[] {
  if (tokens.length === 0) return [{ text, match: false }];

  // Mapa índice-normalizado -> índice-original.
  const map: number[] = [];
  let normalized = '';
  for (let i = 0; i < text.length; i++) {
    const chunk = normalizeText(text[i]);
    for (let k = 0; k < chunk.length; k++) {
      normalized += chunk[k];
      map.push(i);
    }
    if (chunk.length === 0 && normalized.length && !normalized.endsWith(' ')) {
      normalized += ' ';
      map.push(i);
    }
  }

  const ranges: [number, number][] = [];
  for (const token of tokens) {
    let from = 0;
    for (;;) {
      const idx = normalized.indexOf(token, from);
      if (idx === -1) break;
      const start = map[idx];
      const end = map[Math.min(idx + token.length - 1, map.length - 1)] + 1;
      ranges.push([start, end]);
      from = idx + token.length;
    }
  }
  if (ranges.length === 0) return [{ text, match: false }];

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([range[0], range[1]]);
  }

  const out: { text: string; match: boolean }[] = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) out.push({ text: text.slice(cursor, start), match: false });
    out.push({ text: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) out.push({ text: text.slice(cursor), match: false });
  return out;
}

/** Pluraliza en español una etiqueta simple. */
export function plural(count: number, singular: string, pluralForm: string): string {
  return count === 1 ? singular : pluralForm;
}
