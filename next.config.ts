import type { NextConfig } from 'next';

/**
 * Exportación estática: el hosting (IIS en site4now) sirve los archivos de `out/`.
 * Las cabeceras HTTP (caché y seguridad) viven en public/web.config.
 * Si en el futuro se necesita servidor (API, formularios, login), quitar
 * `output: 'export'` y desplegar en un hosting con Node.js.
 */
const nextConfig: NextConfig = {
  output: 'export',
  poweredByHeader: false,
};

export default nextConfig;
