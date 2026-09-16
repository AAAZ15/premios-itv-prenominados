'use client';

import { useId, useState } from 'react';
import { categories } from '@/data';
import { NOMINATION_FORM } from '@/data/config';
import { ChevronDown, SparkIcon } from './Icons';
import styles from './NominationForm.module.css';

/**
 * Formulario de nominación — equivalente al WPForms del sitio original.
 *
 * Los cinco campos y sus etiquetas son los mismos; la única diferencia es que
 * el desplegable de categorías se construye desde el catálogo oficial, así que
 * nunca se desincroniza de la lista publicada.
 *
 * AL MIGRAR A WORDPRESS: esta sección se reemplaza por el shortcode de WPForms.
 * Ver el README para la correspondencia campo a campo.
 */
type Estado = 'inactivo' | 'enviando' | 'enviado' | 'error';

export default function NominationForm() {
  const id = useId();
  const [estado, setEstado] = useState<Estado>('inactivo');
  const [aviso, setAviso] = useState<string | null>(null);

  const campo = (nombre: string) => `${id}-${nombre}`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);

    // Sin endpoint no se finge un envío: se dice lo que hay.
    if (!NOMINATION_FORM.endpoint) {
      setEstado('error');
      setAviso(
        'Esta es una vista previa: el envío todavía no está conectado. ' +
          `Mientras tanto, escribe a ${NOMINATION_FORM.email}.`
      );
      return;
    }

    setEstado('enviando');
    setAviso(null);
    try {
      const respuesta = await fetch(NOMINATION_FORM.endpoint, {
        method: 'POST',
        body: datos,
        headers: { Accept: 'application/json' },
      });
      if (!respuesta.ok) throw new Error(String(respuesta.status));
      setEstado('enviado');
      event.currentTarget.reset();
    } catch {
      setEstado('error');
      setAviso(
        `No se pudo enviar la solicitud. Inténtalo de nuevo o escribe a ${NOMINATION_FORM.email}.`
      );
    }
  }

  if (estado === 'enviado') {
    return (
      <div className={styles.exito} role="status">
        <span className={styles.exitoIcono} aria-hidden="true">
          <SparkIcon size={22} />
        </span>
        <h3 className={styles.exitoTitulo}>Solicitud enviada</h3>
        <p className={styles.exitoTexto}>
          Gracias. El equipo de los Premios ITV revisará la propuesta. Recibirás noticias en el
          correo que indicaste.
        </p>
        <button type="button" className="btn btn--ghost" onClick={() => setEstado('inactivo')}>
          Proponer otra candidatura
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate={false}>
      <div className={styles.campo}>
        <label className={styles.etiqueta} htmlFor={campo('nominado')}>
          Nombre del nominado <span className={styles.obligatorio} aria-hidden="true">*</span>
        </label>
        <input
          className={styles.input}
          id={campo('nominado')}
          name="nominado"
          type="text"
          required
          autoComplete="off"
          maxLength={120}
        />
      </div>

      <div className={styles.campo}>
        <label className={styles.etiqueta} htmlFor={campo('medio')}>
          Medio donde se desenvuelve el nominado{' '}
          <span className={styles.obligatorio} aria-hidden="true">*</span>
        </label>
        <input
          className={styles.input}
          id={campo('medio')}
          name="medio"
          type="text"
          required
          autoComplete="off"
          maxLength={120}
        />
      </div>

      <div className={styles.campo}>
        <label className={styles.etiqueta} htmlFor={campo('categoria')}>
          Categoría <span className={styles.obligatorio} aria-hidden="true">*</span>
        </label>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            id={campo('categoria')}
            name="categoria"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className={styles.selectChevron} />
        </div>
      </div>

      <div className={styles.campo}>
        <label className={styles.etiqueta} htmlFor={campo('email')}>
          Correo electrónico del nominador{' '}
          <span className={styles.obligatorio} aria-hidden="true">*</span>
        </label>
        <input
          className={styles.input}
          id={campo('email')}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          aria-describedby={campo('email-ayuda')}
        />
        <p className={styles.ayuda} id={campo('email-ayuda')}>
          Ingrese el correo de la persona que está llenando esta solicitud.
        </p>
      </div>

      <div className={styles.campo}>
        <label className={styles.etiqueta} htmlFor={campo('comentario')}>
          Comentario o mensaje
        </label>
        <textarea
          className={styles.textarea}
          id={campo('comentario')}
          name="comentario"
          rows={4}
          maxLength={1000}
        />
      </div>

      <div className={styles.pie}>
        <button type="submit" className="btn btn--primary" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Enviando…' : 'Enviar'}
        </button>
        <p className={styles.plazo}>
          Plazo para proponer candidaturas: {NOMINATION_FORM.deadlineLabel}.
        </p>
      </div>

      {aviso && (
        <p className={styles.error} role="alert">
          {aviso}
        </p>
      )}
    </form>
  );
}
