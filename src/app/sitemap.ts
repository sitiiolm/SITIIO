import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/** Agregar aquí cada nueva ruta pública (/proyectos, /servicios, /blog…). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
