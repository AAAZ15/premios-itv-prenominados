/**
 * Desplazamiento entre secciones de la página única.
 *
 * El anclaje nativo del navegador no basta: el encabezado fijo taparía el
 * destino y `scroll-padding-top` se descuadra cuando el contenido de arriba
 * cambia de alto. Aquí se mide el encabezado en el momento del salto.
 */

/** Evento interno: alguien quiere ir a un ancla de la página. */
export const GOTO_EVENT = 'itv:goto';

/**
 * Evento interno: se acaba de ordenar un desplazamiento. El indicador de
 * sección activa lo escucha, porque el evento `scroll` del navegador no basta
 * para saber dónde termina una animación suave.
 */
export const SCROLLED_EVENT = 'itv:scrolled';

/** Prefijo de las anclas de categoría dentro del acordeón. */
export const CATEGORY_ANCHOR = 'cat-';

export function emitGoto(id: string) {
  window.dispatchEvent(new CustomEvent<string>(GOTO_EVENT, { detail: id }));
}

function headerOffset(): number {
  const header = document.querySelector('header');
  const height = header?.getBoundingClientRect().height ?? 64;
  return height + 12;
}

export function scrollToId(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = element.getBoundingClientRect().top + window.scrollY - headerOffset();

  window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });

  // Se avisa al terminar el salto (y por el camino) para refrescar el menú.
  const notify = () => window.dispatchEvent(new Event(SCROLLED_EVENT));
  notify();
  setTimeout(notify, 300);
  setTimeout(notify, 800);
}

/**
 * Desplaza en cuanto React haya montado el destino. Se usa, por ejemplo, al
 * abrir una categoría que el acordeón todavía no mostraba.
 *
 * Se combinan dos disparadores porque `requestAnimationFrame` se suspende
 * cuando la pestaña no se está pintando; el temporizador garantiza el salto
 * igualmente. Sólo se ejecuta el primero que llegue.
 */
export function scrollToIdAfterRender(id: string) {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    scrollToId(id);
  };

  requestAnimationFrame(() => requestAnimationFrame(run));
  setTimeout(run, 120);
}
