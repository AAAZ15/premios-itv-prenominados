'use client';

import { useEffect, useState } from 'react';
import { SCROLLED_EVENT } from '@/lib/scroll';

/**
 * Devuelve el id de la sección visible en pantalla, para marcar el enlace
 * activo del menú en una página de desplazamiento continuo.
 *
 * Se elige la última sección cuyo borde superior ya ha pasado por debajo del
 * encabezado fijo; así el menú cambia justo cuando la sección toma la pantalla.
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    /**
     * El umbral se mide sobre el encabezado real y deja holgura suficiente:
     * al saltar a una sección ésta queda a `altura + 12`, así que un umbral
     * más ajustado dejaría marcada la sección anterior por un píxel.
     */
    const threshold = () => {
      const header = document.querySelector('header');
      return (header?.getBoundingClientRect().height ?? 64) + 32;
    };

    const update = () => {
      // Al final de la página siempre gana la última sección: si no, la última
      // nunca llega a activarse cuando es más corta que la pantalla.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }

      const limit = threshold();
      let current = ids[0] ?? '';
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top - limit <= 0) current = id;
      }
      setActive(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener(SCROLLED_EVENT, update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener(SCROLLED_EVENT, update);
    };
  }, [ids]);

  return active;
}
