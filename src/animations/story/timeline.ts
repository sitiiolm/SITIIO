import type { Project } from '@/data/projects';
import { prepStops, type ColorStop, type Range, type RgbStop } from '../math';

/**
 * Guion del STORY TRACK (escenas 01–08), medido en "pantallas" de scroll
 * (1 = 100vh). Los valores fijos son los del prototipo aprobado; el tramo de
 * proyectos se deriva de la cantidad de proyectos (1 pantalla por proyecto).
 */
export interface StoryTimeline {
  heroOut: Range; // Escena 01 → 02: el titular sale, la esfera se centra
  storyLineIn: Range; // "Todo negocio necesita un lugar en internet."
  storyLineOut: Range;
  sphereTravel: Range; // la esfera se encoge hasta ser una luz
  sphereFade: Range;
  particles: Range;
  laptopRise: Range; // Escena 03: aparece la laptop cerrada
  lidOpen: Range; // Escena 04: la tapa se abre con el scroll
  slitLight: Range;
  screenOn: Range; // pantalla: degradado de marca
  flash: Range; // destello → primer proyecto
  behindIn: Range; // "Esto es lo que podemos crear para ti."
  behindOut: Range;
  camera: Range; // la cámara se acerca y pone la laptop de frente
  shift: Range; // la laptop se desplaza para dejar espacio al texto
  /** Inicio del showcase de proyectos */
  projectsStart: number;
  projectCount: number;
  exit: Range; // los dispositivos se "acuestan" y sale la escena
  total: number;
}

/** En mobile el recorrido es más corto */
export const MOBILE_TIME_SCALE = 0.72;

const P0 = 4.6;

export function createTimeline(projectCount: number): StoryTimeline {
  const showcaseEnd = P0 + projectCount;
  return {
    heroOut: [0.0, 0.8],
    storyLineIn: [1.1, 1.4],
    storyLineOut: [1.75, 2.05],
    sphereTravel: [0.7, 1.9],
    sphereFade: [1.9, 2.3],
    particles: [0.45, 2.7],
    laptopRise: [1.4, 2.3],
    lidOpen: [2.2, 3.4],
    slitLight: [2.1, 3.3],
    screenOn: [3.15, 3.6],
    flash: [3.65, 4.05],
    behindIn: [3.3, 3.75],
    behindOut: [4.2, 4.6],
    camera: [3.4, 4.4],
    shift: [4.25, 4.85],
    projectsStart: P0,
    projectCount,
    exit: [showcaseEnd + 0.1, showcaseEnd + 1.0],
    total: showcaseEnd + 1.0,
  };
}

const NAVY = '#070A1F';
const INK_LIGHT = '#F4F3FF';

export interface StoryPalette {
  background: RgbStop[];
  foreground: RgbStop[];
  glowA: RgbStop[];
  glowB: RgbStop[];
}

/** Colores de ambiente por momento de la historia (fondo, texto y luces). */
export function createPalette(projects: readonly Project[], t: StoryTimeline): StoryPalette {
  const P = t.projectsStart;
  const last = projects.length - 1;
  const hold = (key: 'background' | 'glowA' | 'glowB'): ColorStop[] =>
    projects.flatMap((p, k): ColorStop[] => [
      [k === 0 ? P + 0.05 : P + k, p.theme[key]],
      [k === last ? t.exit[0] : P + k + 0.75, p.theme[key]],
    ]);

  const background: ColorStop[] = [
    [0, NAVY], [3.3, NAVY], [4.4, '#150A2E'],
    ...hold('background'),
    [t.total - 0.1, '#FFFFFF'], // → Servicios (blanco)
  ];
  const glowA: ColorStop[] = [
    [0, '#7A1FE0'], [2.5, '#2A1FD0'], [4.4, '#BB37F5'],
    ...hold('glowA'),
    [t.total, projects[last].theme.glowA],
  ];
  const glowB: ColorStop[] = [
    [0, '#E42678'], [2.5, '#35C9FE'], [4.4, '#E42678'],
    ...hold('glowB'),
    [t.total, projects[last].theme.glowB],
  ];

  // El color del texto solo cambia cuando un proyecto usa otra tinta.
  const foreground: ColorStop[] = [[0, INK_LIGHT]];
  let ink = INK_LIGHT;
  projects.forEach((p, k) => {
    if (p.theme.foreground === ink) return;
    foreground.push([P + k - 0.2, ink], [P + k, p.theme.foreground]);
    ink = p.theme.foreground;
  });
  foreground.push([t.total, ink]);

  return {
    background: prepStops(background),
    foreground: prepStops(foreground),
    glowA: prepStops(glowA),
    glowB: prepStops(glowB),
  };
}
