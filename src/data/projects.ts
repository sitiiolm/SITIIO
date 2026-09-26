/**
 * Proyectos del showcase de la Home (conceptos de ejemplo).
 *
 * Para agregar un proyecto:
 *   1. Añade su entrada aquí (el orden define el orden del storytelling).
 *   2. Crea su mini-web y sus tarjetas flotantes en src/components/projects/<slug>/
 *      y regístralas en src/components/projects/registry.ts.
 *   3. Añade sus estilos en src/styles/projects/<slug>.css.
 * La línea de tiempo del scroll, los colores del escenario y el indicador
 * se recalculan solos a partir de esta lista.
 */

/** Cómo entra la mini-web en la pantalla de la laptop. */
export type ScreenTransition =
  | 'light' // cambio de luz: fundido + blur muy ligero
  | 'sweep' // barrido vertical dentro de la pantalla
  | 'zoom'; // zoom de cámara

export interface Project {
  slug: string;
  name: string;
  /** Nombre en el indicador lateral ("01 / 04 · MOKA") */
  indicator: string;
  category: string;
  description: string;
  tags: readonly string[];
  /** Color del segmento activo del indicador */
  accent: string;
  typography: { fontFamily: string; fontWeight: number };
  /** Ambiente del escenario mientras el proyecto está en pantalla */
  theme: {
    background: string;
    foreground: string;
    glowA: string;
    glowB: string;
  };
  showcase: {
    /** Transición con la que entra (se ignora en el primero: entra con el encendido). */
    enter: ScreenTransition;
    /** Giro suave de la laptop durante el proyecto. */
    cameraTilt?: boolean;
    /** La cámara se aleja y entra el teléfono para demostrar el responsive. */
    withPhone?: boolean;
  };
}

const LIGHT_INK = '#F4F3FF';
const DARK_INK = '#0B0D1A';

export const projects: readonly Project[] = [
  {
    slug: 'moka',
    name: 'MOKA',
    indicator: 'MOKA',
    category: 'Coffee Shop',
    description: 'Diseño cálido para una cafetería de especialidad.',
    tags: ['Menú digital', 'Reservas', 'WhatsApp'],
    accent: '#C8643B',
    typography: { fontFamily: 'var(--font-fraunces)', fontWeight: 500 },
    theme: { background: '#1A0F0A', foreground: LIGHT_INK, glowA: '#FE8A2E', glowB: '#FE5551' },
    showcase: { enter: 'light' },
  },
  {
    slug: 'lume',
    name: 'LUMÉ',
    indicator: 'LUMÉ',
    category: 'Beauty Studio',
    description: 'Una experiencia editorial para reservar belleza.',
    tags: ['Servicios', 'Citas online', 'Galería'],
    accent: '#E8B4B8',
    typography: { fontFamily: 'var(--font-cormorant)', fontWeight: 500 },
    theme: { background: '#2A1422', foreground: LIGHT_INK, glowA: '#FD6CAC', glowB: '#FFC9B5' },
    showcase: { enter: 'light' },
  },
  {
    slug: 'nova',
    name: 'NOVA',
    indicator: 'NOVA',
    category: 'Real Estate',
    description: 'Propiedades que se sienten antes de visitarlas.',
    tags: ['Buscador', 'Fichas', 'Mapa'],
    accent: '#6F8FB8',
    typography: { fontFamily: 'var(--font-barlow)', fontWeight: 600 },
    theme: { background: '#0B1226', foreground: LIGHT_INK, glowA: '#1F5BFF', glowB: '#35C9FE' },
    showcase: { enter: 'sweep', cameraTilt: true },
  },
  {
    slug: 'orbe',
    name: 'ORBE',
    indicator: 'E-COMMERCE',
    category: 'Tienda online · E-commerce',
    description: 'Una tienda que vende igual de bien en laptop y en móvil.',
    tags: ['Catálogo', 'Carrito', 'Pagos'],
    accent: '#9BC21E',
    typography: { fontFamily: 'var(--font-unbounded)', fontWeight: 800 },
    theme: { background: '#EEF0F7', foreground: DARK_INK, glowA: '#C6F432', glowB: '#B69CFF' },
    showcase: { enter: 'zoom', withPhone: true },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
