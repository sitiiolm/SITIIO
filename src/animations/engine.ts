import type { RGB } from './math';

/**
 * Motor de scroll de SITIIO.
 *
 * Un único requestAnimationFrame convierte el scroll en el estado de todas las
 * escenas. Se suaviza (inercia ligera) SOLO el valor que usan las animaciones:
 * el scroll nativo nunca se bloquea ni se altera.
 * El loop duerme cuando no hay nada que animar y despierta con scroll/resize.
 */

export type Mode = 'mobile' | 'tablet' | 'desktop';
export type NavKey = 'top' | 'projects' | 'services' | 'process' | 'contact' | 'address';

export interface Viewport {
  vw: number;
  vh: number;
  mode: Mode;
}

export interface Frame {
  /** Scroll suavizado que usan las animaciones */
  y: number;
  /** Scroll real de la ventana */
  targetY: number;
  /** Velocidad del scroll suavizado (px por frame) */
  vel: number;
}

export interface Scene {
  /** Medir el layout (resize, fuentes cargadas, fin del loader). */
  measure?(vp: Viewport): void;
  /** Lecturas de layout del frame: se ejecutan todas antes de cualquier escritura. */
  read?(frame: Frame, vp: Viewport): void;
  /** Escrituras de estilo cuando cambió el scroll o se invalidó el frame. */
  render(frame: Frame, vp: Viewport): void;
  /** Trabajo por frame independiente del scroll. Devuelve true para mantener el loop activo. */
  tick?(frame: Frame, vp: Viewport): boolean;
  /** Movimiento del cursor (solo con puntero fino y sin movimiento reducido). */
  pointer?(x: number, y: number, vp: Viewport): void;
  /** Se llama cuando termina el loader. */
  onIntro?(): void;
}

/** Estado que unas escenas publican y otras consumen (p. ej. el navbar). */
export interface SharedState {
  storyProgress: number;
  /** Progreso del story track en el que empieza el showcase de proyectos */
  projectsStart: number;
  storyForeground: RGB;
  processDarkness: number;
  sectionTops: { services: number; process: number; contact: number };
  menuOpen: boolean;
}

export const SCENE_ORDER = { story: 0, services: 1, process: 2, final: 3, footer: 4, nav: 5 } as const;

const MOBILE_MAX = 768;
const TABLET_MAX = 1200;

export class MotionEngine {
  readonly shared: SharedState = {
    storyProgress: 0,
    projectsStart: Infinity,
    storyForeground: [244, 243, 255],
    processDarkness: 0,
    sectionTops: { services: Infinity, process: Infinity, contact: Infinity },
    menuOpen: false,
  };

  vp: Viewport = { vw: 0, vh: 0, mode: 'desktop' };

  private media?: { reduced: boolean; fine: boolean };

  /** Preferencias del dispositivo (se leen en el cliente la primera vez que se piden). */
  private get prefs() {
    this.media ??= {
      reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      fine: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    };
    return this.media;
  }
  get reducedMotion() {
    return this.prefs.reduced;
  }
  get finePointer() {
    return this.prefs.fine;
  }

  private scenes: { order: number; scene: Scene }[] = [];
  private anchors = new Map<NavKey, () => number>();
  private introListeners = new Set<() => void>();
  private introDone = false;
  private started = false;
  private raf = 0;
  private curY = 0;
  private renderedY = -1;
  private dirty = true;
  private smoothing = 0.13;

  register(scene: Scene, order: number): () => void {
    const entry = { order, scene };
    this.scenes.push(entry);
    this.scenes.sort((a, b) => a.order - b.order);
    if (this.started) {
      this.measure();
      if (this.introDone) scene.onIntro?.();
    }
    return () => {
      this.scenes = this.scenes.filter((e) => e !== entry);
    };
  }

  setAnchor(key: NavKey, resolve: () => number): () => void {
    this.anchors.set(key, resolve);
    return () => {
      if (this.anchors.get(key) === resolve) this.anchors.delete(key);
    };
  }

  scrollTo(key: NavKey, { instant = false } = {}) {
    const resolve = this.anchors.get(key);
    const top = key === 'top' || !resolve ? 0 : resolve();
    window.scrollTo({ top, behavior: instant || this.reducedMotion ? 'auto' : 'smooth' });
  }

  hasAnchor(key: string): key is NavKey {
    return key === 'top' || this.anchors.has(key as NavKey);
  }

  onIntro(listener: () => void): () => void {
    if (this.introDone) listener();
    this.introListeners.add(listener);
    return () => this.introListeners.delete(listener);
  }

  completeIntro() {
    if (this.introDone) return;
    this.introDone = true;
    this.scenes.forEach(({ scene }) => scene.onIntro?.());
    this.introListeners.forEach((listener) => listener());
    this.measure();
  }

  setMenuOpen(open: boolean) {
    this.shared.menuOpen = open;
    this.invalidate();
  }

  /** Fuerza un render en el próximo frame. */
  invalidate() {
    this.dirty = true;
    this.wake();
  }

  measure() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    this.vp = { vw, vh, mode: vw < MOBILE_MAX ? 'mobile' : vw < TABLET_MAX ? 'tablet' : 'desktop' };
    // En orden: el story track fija su altura antes de que el resto mida su posición.
    this.scenes.forEach(({ scene }) => scene.measure?.(this.vp));
    this.invalidate();
  }

  start() {
    if (this.started) return;
    this.started = true;
    this.smoothing = this.reducedMotion ? 1 : this.finePointer ? 0.13 : 0.3;
    this.curY = window.scrollY;

    window.addEventListener('scroll', this.wake, { passive: true });
    window.addEventListener('resize', this.handleResize);
    if (this.pointerEffects) window.addEventListener('mousemove', this.handlePointer, { passive: true });
    document.fonts?.ready.then(() => this.started && this.measure());
    this.measure();
  }

  destroy() {
    if (!this.started) return;
    this.started = false;
    window.removeEventListener('scroll', this.wake);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handlePointer);
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  /** Efectos que siguen al cursor (inclinación, botones magnéticos). */
  get pointerEffects() {
    return this.finePointer && !this.reducedMotion;
  }

  private handleResize = () => this.measure();

  private handlePointer = (e: MouseEvent) => {
    for (const { scene } of this.scenes) scene.pointer?.(e.clientX, e.clientY, this.vp);
  };

  private wake = () => {
    if (this.started && !this.raf) this.raf = requestAnimationFrame(this.frame);
  };

  private frame = () => {
    this.raf = 0;
    const targetY = window.scrollY;
    const prev = this.curY;
    this.curY += (targetY - this.curY) * this.smoothing;
    if (Math.abs(targetY - this.curY) < 0.05) this.curY = targetY;
    const frame: Frame = { y: this.curY, targetY, vel: this.curY - prev };

    if (this.dirty || Math.abs(this.curY - this.renderedY) > 0.01) {
      for (const { scene } of this.scenes) scene.read?.(frame, this.vp);
      for (const { scene } of this.scenes) scene.render(frame, this.vp);
      this.renderedY = this.curY;
      this.dirty = false;
    }

    let busy = this.curY !== targetY;
    for (const { scene } of this.scenes) {
      if (scene.tick?.(frame, this.vp)) busy = true;
    }
    if (busy) this.wake();
  };
}
