import type { NextConfig } from 'next';

/**
 * `NEXT_PUBLIC_BASE_PATH` permite servir el sitio desde una subcarpeta
 * (GitHub Pages publica en /<repo>/). Vacío = raíz del dominio.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  // Exportación estática: HTML real por ruta (mejor SEO y despliegue en
  // cualquier hosting simple: GitHub Pages, Netlify, Vercel, S3, Apache…).
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
