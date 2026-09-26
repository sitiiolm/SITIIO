import type { NavKey } from '@/animations/engine';

export interface NavItem {
  key: NavKey;
  label: string;
  /** Ancla dentro de la Home. Cuando existan páginas propias (/proyectos,
   *  /servicios…) basta con cambiar este valor por la ruta. */
  href: string;
}

export const mainNav: readonly NavItem[] = [
  { key: 'projects', label: 'Proyectos', href: '#proyectos' },
  { key: 'services', label: 'Servicios', href: '#servicios' },
  { key: 'process', label: 'Proceso', href: '#proceso' },
  { key: 'contact', label: 'Contacto', href: '#contacto' },
];

/** Hash de la URL → sección de la Home */
export const hashToNavKey: Record<string, NavKey> = {
  '#top': 'top',
  '#proyectos': 'projects',
  '#servicios': 'services',
  '#proceso': 'process',
  '#contacto': 'contact',
  '#direccion': 'address',
};

/** Rutas futuras. Solo se enlazan cuando la página existe. */
export const routes = {
  home: '/',
  project: (slug: string) => `/proyectos/${slug}`,
} as const;

export const features = {
  /** Activar cuando exista /proyectos/[slug] */
  projectPages: false,
} as const;
