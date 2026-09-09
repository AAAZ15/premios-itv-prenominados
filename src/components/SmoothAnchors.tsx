'use client';

import { useEffect } from 'react';
import { CATEGORY_ANCHOR, emitGoto, scrollToId, scrollToIdAfterRender } from '@/lib/scroll';

/**
 * Intercepta los clics en enlaces internos (`href="#..."`) de toda la página
 * y los desplaza con la compensación correcta del encabezado fijo.
 *
 * Para las anclas de categoría avisa primero al acordeón —que debe abrir y,
 * si hace falta, desplegar la lista completa— y desplaza tras el repintado.
 */
export default function SmoothAnchors() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest('a');
      const href = anchor?.getAttribute('href');
      if (!href || href.length < 2 || !href.startsWith('#')) return;

      const id = decodeURIComponent(href.slice(1));

      if (id.startsWith(CATEGORY_ANCHOR)) {
        // Ojo: la categoría puede estar entre las que el acordeón aún no
        // muestra, así que su elemento todavía no existe. Se avisa primero y
        // se desplaza cuando React la haya montado.
        event.preventDefault();
        emitGoto(id);
        scrollToIdAfterRender(id);
        return;
      }

      if (!document.getElementById(id)) return;
      event.preventDefault();
      scrollToId(id);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
