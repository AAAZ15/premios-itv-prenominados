import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div
      className="container container--narrow section"
      style={{ textAlign: 'center', paddingBlock: '6rem' }}
    >
      <p className="eyebrow">Error 404</p>
      <h1 className="section-title glow-text" style={{ marginTop: '0.75rem' }}>
        No encontramos esta página
      </h1>
      <p className="section-lede" style={{ marginInline: 'auto' }}>
        La dirección que buscas no existe o cambió. Puedes volver al inicio o explorar las
        categorías de prenominados.
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.65rem',
          justifyContent: 'center',
          marginTop: '2rem',
        }}
      >
        <Link href="/" className="btn btn--primary">
          Ir al inicio
        </Link>
        <Link href="/#categorias" className="btn btn--ghost">
          Ver categorías
        </Link>
      </div>
    </div>
  );
}
