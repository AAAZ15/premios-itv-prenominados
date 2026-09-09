'use client';

import { useEffect, useState } from 'react';

/**
 * Devuelve el id de la sección visible en pantalla, para marcar el enlace
 * activo del menú en una página de desplazamiento continuo.
 *
 * Se elige la sección cuyo borde superior queda más cerca —por debajo— del
 * encabezado fijo; así el menú cambia justo cuando la sección toma la pantalla.
 */
export function useActiveSection(ids: readonly string[], offset = 90): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const update = () => {
      // Al final de la página siempre gana la última sección: si no, la última
      // nunca llega a activarse cuando es más corta que la pantalla.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }

      let current = ids[0] ?? '';
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top - offset <= 0) current = id;
      }
      setActive(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ids, offset]);

  return active;
}
