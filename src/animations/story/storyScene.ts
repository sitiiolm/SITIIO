import type { Project, ScreenTransition } from '@/data/projects';
import type { Frame, MotionEngine, Scene, Viewport } from '../engine';
import {
  clamp, colorAt, ease, easeOut, lerp, luminance, r2, range, rgbStr, smooth,
} from '../math';
import { createParticles } from './particles';
import { MOBILE_TIME_SCALE, createPalette, createTimeline } from './timeline';

/**
 * STORY TRACK — escenas 01–08 en un solo escenario fijo:
 * 01 Hero · 02 la esfera se mueve · 03 aparece la laptop · 04 la laptop se abre ·
 * 05+ un proyecto por pantalla · salida hacia Servicios.
 */

/** Efecto propio de un proyecto (p. ej. el carrito de ORBE). Recibe el scroll
 *  relativo al inicio del proyecto, en pantallas. */
export type ShowcaseEffect = (offset: number) => void;

interface StoryOptions {
  projects: readonly Project[];
  effects: readonly (ShowcaseEffect | undefined)[];
}

/** Posición de cada tarjeta flotante respecto del dispositivo principal. */
const CARD_SPOTS = {
  a: { fx: 0.44, fy: -0.4, drift: -60, rot: 3 }, // arriba a la derecha
  b: { fx: -0.36, fy: 0.44, drift: -110, rot: -4 }, // abajo a la izquierda
  c: { fx: -0.42, fy: -0.4, drift: -60, rot: 3 }, // arriba a la izquierda
} as const;
type CardSpot = keyof typeof CARD_SPOTS;

interface SiteState {
  o: number;
  ty: number; // translateY en %
  scale: number;
  blur: number;
}

const ENTER: Record<ScreenTransition, (t: number) => SiteState> = {
  light: (t) => ({ o: t, ty: 0, scale: 1.04 - t * 0.04, blur: 1 - t }),
  sweep: (t) => ({ o: t > 0 ? 1 : 0, ty: (1 - t) * 100, scale: 1, blur: 0 }),
  zoom: (t) => ({ o: t, ty: 0, scale: 0.92 + t * 0.08, blur: 0 }),
};
const EXIT: Record<ScreenTransition, (t: number) => SiteState> = {
  light: (t) => ({ o: 1 - t, ty: 0, scale: 1 + t * 0.03, blur: t }),
  sweep: (t) => ({ o: t >= 1 ? 0 : 1 - t * 0.5, ty: -t * 22, scale: 1, blur: 0 }),
  zoom: (t) => ({ o: 1 - t, ty: 0, scale: 1 + t * 0.14, blur: 0 }),
};

const q = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => root.querySelector(sel) as T;
const qa = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => Array.from(root.querySelectorAll<T>(sel));

export function createStoryScene(root: HTMLElement, engine: MotionEngine, { projects, effects }: StoryOptions) {
  const T = createTimeline(projects.length);
  const palette = createPalette(projects, T);
  const P0 = T.projectsStart;
  const last = projects.length - 1;
  const tiltIdx = projects.findIndex((p) => p.showcase.cameraTilt);
  const phoneIdx = projects.findIndex((p) => p.showcase.withPhone);
  engine.shared.projectsStart = P0;

  // --- DOM ------------------------------------------------------------------
  const stage = q(root, '.stage');
  const heroCopy = q(root, '.hero-copy');
  const heroMeta = q(root, '.hero-meta');
  const sphere = q(root, '.sphere');
  const sphereTilt = q(root, '.sphere-tilt');
  const storyLine = q(root, '.story-line');
  const behindTitle = q(root, '.behind-title');
  const [glowA, glowB] = qa(root, '.ambient .glow');
  const laptop = q(root, '.laptop');
  const laptopParts = qa(root, '.laptop-part');
  const lid = q(root, '.laptop-lid');
  const laptopShadow = q(root, '.laptop-shadow');
  const slit = q(root, '.slit-light');
  const screenPower = q(root, '.screen .screen-power');
  const screenFlash = q(root, '.screen-flash');
  const phone = q(root, '.phone');
  const phonePower = q(root, '.phone .screen-power');
  const sitesL = qa(root, '.screen .site');
  const sitesP = qa(root, '.phone-screen .site');
  const scrollL = sitesL.map((s) => q(s, '.site-scroll'));
  const scrollP = sitesP.map((s) => q(s, '.site-scroll'));
  const projCopy = q(root, '.proj-copy');
  const projItems = qa(root, '.proj-item');
  const counterRoll = q(root, '.counter .roll');
  const projProgress = q(root, '.proj-progress');
  const projNow = q(root, '.proj-progress .now');
  const segFills = qa(root, '.proj-progress .seg i');
  const fcards = qa(root, '.fcard');
  const particles = createParticles(q<HTMLCanvasElement>(root, '.particles'));

  // --- Medidas -----------------------------------------------------------------
  let timeScale = 1;
  let storyTop = 0;
  let laptopFit = 1;
  let phoneFit = 1;
  let sphereSize = 560;
  let siteMaxL: number[] = [];
  let siteMaxP: number[] = [];

  // --- Estado entre frames --------------------------------------------------
  let s = 0;
  let particleIntensity = 0;
  let lastLaptopOp = -1;
  let lastIdx = -1;
  let dev = { x: 0, y: 0, sc: 1, w: 0, h: 0 }; // dispositivo principal (para las tarjetas)

  function measure(vp: Viewport) {
    const { vw, vh, mode } = vp;
    timeScale = mode === 'mobile' ? MOBILE_TIME_SCALE : 1;
    root.style.height = `${(T.total * timeScale + 1) * vh}px`;
    storyTop = root.getBoundingClientRect().top + window.scrollY;

    if (mode === 'desktop') {
      laptopFit = Math.min((vw * 0.48) / 900, (vh * 0.58) / 550);
      sphereSize = Math.min(vw * 0.4, vh * 0.66);
    } else if (mode === 'tablet') {
      laptopFit = Math.min((vw * 0.8) / 900, (vh * 0.4) / 550);
      sphereSize = Math.min(vw * 0.5, vh * 0.42);
    } else {
      laptopFit = 0;
      sphereSize = Math.min(vw * 0.72, vh * 0.36);
    }
    phoneFit = mode === 'mobile' ? Math.min((vh * 0.52) / 620, (vw * 0.64) / 300) : laptopFit * 0.66;

    // Altura navegable de cada mini-web (para el auto-scroll interno)
    siteMaxL = scrollL.map((el) => Math.max(0, el.offsetHeight - 800));
    siteMaxP = scrollP.map((el) => Math.max(0, el.offsetHeight - 836));

    particles.resize(vp);
    lastIdx = -1;
  }

  // --- Escenas 01–03: Hero, esfera, textos, ambiente ------------------------
  function renderStory(vp: Viewport) {
    const { vw, vh, mode } = vp;
    const isMobile = mode === 'mobile';
    const isDesktop = mode === 'desktop';

    const bg = colorAt(palette.background, s);
    const fg = colorAt(palette.foreground, s);
    engine.shared.storyForeground = fg;
    stage.style.setProperty('--stage-bg', rgbStr(bg));
    stage.style.setProperty('--stage-fg', rgbStr(fg));
    const light = luminance(bg) > 0.6;
    glowA.style.setProperty('--c', rgbStr(colorAt(palette.glowA, s), light ? 0.55 : 0.5));
    glowB.style.setProperty('--c', rgbStr(colorAt(palette.glowB, s), light ? 0.5 : 0.38));
    glowA.style.transform = `translate3d(${-vw * 0.18 + Math.sin(s * 0.9) * vw * 0.06}px, ${-vh * 0.1 - s * 6}px, 0)`;
    glowB.style.transform = `translate3d(${vw * 0.24 - Math.sin(s * 0.7) * vw * 0.05}px, ${vh * 0.22 - s * 4}px, 0) scale(.8)`;

    // SITIIO HERO: el titular sale con parallax
    const hOut = range(s, T.heroOut);
    const heroBase = isMobile ? '0px' : '-46%';
    heroCopy.style.transform = `translate3d(0, calc(${heroBase} - ${ease(hOut) * 28}vh), 0)`;
    heroCopy.style.opacity = String(1 - r2(s, 0.08, 0.62));
    heroCopy.style.pointerEvents = s > 0.35 ? 'none' : '';
    heroMeta.style.opacity = String(1 - r2(s, 0, 0.22));

    // LA ESFERA: se centra, gira, se encoge y se vuelve una luz
    const s0 = sphereSize / 560;
    const heroPos = isDesktop ? [vw * 0.22, vh * 0.02] : mode === 'tablet' ? [vw * 0.2, -vh * 0.22] : [0, -vh * 0.2];
    const a = ease(hOut);
    const b = ease(range(s, T.sphereTravel));
    const lightY = isMobile ? vh * 0.1 : -vh * 0.2 + 445 * laptopFit * 0.74; // aterriza en la ranura de la laptop cerrada
    const sx = lerp(lerp(heroPos[0], 0, a), 0, b);
    const sy = lerp(lerp(heroPos[1], 0, a), lightY, b);
    const sc = lerp(lerp(s0, s0 * 1.08, a), s0 * 0.03, b);
    sphere.style.transform = `translate3d(${sx}px, ${sy}px, 0) scale(${sc}) rotate(${b * 220}deg)`;
    sphere.style.opacity = String(1 - range(s, T.sphereFade));
    sphere.style.visibility = s > T.sphereFade[1] + 0.1 ? 'hidden' : '';

    // Texto de transición
    const lin = easeOut(range(s, T.storyLineIn));
    const lout = range(s, T.storyLineOut);
    storyLine.style.opacity = String(lin * (1 - lout));
    storyLine.style.transform = `translate3d(-50%, ${(1 - lin) * 40 - lout * 50}px, 0)`;

    // Título detrás de la laptop
    const bin = easeOut(range(s, T.behindIn));
    const bout = range(s, T.behindOut);
    behindTitle.style.opacity = String(bin * (1 - bout));
    behindTitle.style.transform = `translate3d(-50%, calc(-50% + ${(1 - bin) * 60 - bout * 90}px), 0)`;

    particleIntensity = engine.reducedMotion
      ? 0
      : range(s, [T.particles[0], T.particles[0] + 0.35]) * (1 - range(s, [T.particles[1] - 0.4, T.particles[1]]));
  }

  // --- Escenas 03–04: la laptop se abre (desktop / tablet) -------------------
  function renderLaptop({ vw, vh, mode }: Viewport) {
    const fit = laptopFit;
    const isDesktop = mode === 'desktop';
    const rise = easeOut(range(s, T.laptopRise));
    const open = ease(range(s, T.lidOpen));
    const cam = ease(range(s, T.camera));
    const shift = ease(range(s, T.shift));
    const tilt = tiltIdx < 0 ? 0
      : ease(r2(s, P0 + tiltIdx - 0.25, P0 + tiltIdx + 0.02)) * (1 - ease(r2(s, P0 + tiltIdx + 0.75, P0 + tiltIdx + 1.0)));
    const zoomOut = phoneIdx < 0 ? 0 : ease(r2(s, P0 + phoneIdx - 0.28, P0 + phoneIdx + 0.02));
    const exit = ease(range(s, T.exit));

    const showX = isDesktop ? vw * 0.15 : 0;
    const showY = isDesktop ? -vh * 0.07 : -vh * 0.25;

    let x = lerp(0, showX, shift);
    x = lerp(x, isDesktop ? vw * 0.1 : -vw * 0.08, zoomOut);
    let y = lerp(vh * 0.6, -vh * 0.2, rise); // cerrada: la bisagra queda cerca del centro
    y = lerp(y, -vh * 0.02, open);
    y = lerp(y, vh * 0.04, cam);
    y = lerp(y, showY, shift);
    y = lerp(y, y - vh * 0.06, exit);

    let sc = fit * 0.74;
    sc = lerp(sc, fit * 1.08, cam);
    sc = lerp(sc, fit, shift);
    sc = lerp(sc, fit * 0.84, zoomOut);
    sc *= 1 - 0.5 * exit;

    let rx = lerp(-26, -14, open);
    rx = lerp(rx, -5, cam);
    rx = lerp(rx, -62, exit);
    let ry = lerp(30, 16, open);
    ry = lerp(ry, 0, cam);
    ry = lerp(ry, isDesktop ? -12 : 0, shift);
    ry += tilt * 6;
    ry = lerp(ry, 0, exit);

    const lidAngle = lerp(-90, 14, open);
    const op = r2(s, 1.4, 1.75) * (1 - r2(s, T.total - 0.4, T.total));

    laptop.style.display = '';
    laptop.style.visibility = op <= 0.001 ? 'hidden' : '';
    if (op !== lastLaptopOp) {
      laptopParts.forEach((el) => { el.style.opacity = String(op); });
      lastLaptopOp = op;
    }
    laptop.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${sc}) rotateX(${rx}deg) rotateY(${ry}deg)`;
    lid.style.transform = `rotateX(${lidAngle}deg)`;
    dev = { x, y, sc, w: 900 * sc, h: 550 * sc };

    // Sombra sobre el "piso"
    laptopShadow.style.opacity = String(op * 0.8 * (1 - exit));
    laptopShadow.style.transform = `translate3d(${x}px, ${y + 300 * sc}px, 0) scale(${sc})`;

    // Luz por la ranura
    const sl = range(s, T.slitLight);
    slit.style.opacity = String(r2(s, 2.12, 2.4) * (1 - r2(s, 2.55, 2.85)));
    slit.style.transform = `translate3d(${x}px, ${y + 445 * sc}px, 0) scaleX(${easeOut(r2(sl, 0, 0.35)) * sc * 0.9})`;

    // Encendido de pantalla: degradado → destello → proyecto
    const on = range(s, T.screenOn);
    screenPower.style.opacity = String(on * (1 - r2(s, 3.75, 4.0)));
    screenFlash.style.opacity = String(r2(s, 3.62, 3.78) * (1 - r2(s, 3.8, 4.1)) * 0.85);

    // Teléfono (desktop/tablet): entra junto al proyecto responsive
    const pe = phoneIdx < 0 ? 0 : ease(r2(s, P0 + phoneIdx - 0.2, P0 + phoneIdx + 0.15));
    const px = lerp(vw * 0.62, x + dev.w * (isDesktop ? 0.47 : 0.44), pe);
    const py = y + 40 * sc;
    const psc = phoneFit * (1 - 0.5 * exit);
    phone.style.display = pe > 0 ? '' : 'none';
    phone.style.opacity = String(pe * (1 - r2(s, T.total - 0.4, T.total)));
    phone.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${psc}) perspective(1600px) rotateX(${lerp(-4, -58, exit)}deg) rotateY(${lerp(-18, -8, pe)}deg)`;
    phonePower.style.opacity = '0';
  }

  // --- Mobile: el teléfono es el dispositivo protagonista --------------------
  function renderPhoneMain({ vh }: Viewport) {
    laptop.style.display = 'none';
    laptopShadow.style.opacity = '0';
    slit.style.opacity = '0';
    const rise = easeOut(range(s, T.laptopRise));
    const open = ease(range(s, T.lidOpen));
    const cam = ease(range(s, T.camera));
    const shift = ease(range(s, T.shift));
    const exit = ease(range(s, T.exit));
    let y = lerp(vh * 0.8, vh * 0.12, rise);
    y = lerp(y, vh * 0.06, cam);
    y = lerp(y, vh * 0.17, shift);
    y = lerp(y, vh * 0.1, exit);
    let sc = phoneFit * lerp(0.8, 1, open);
    sc = lerp(sc, phoneFit * 1.06, cam);
    sc = lerp(sc, phoneFit, shift);
    sc *= 1 - 0.45 * exit;
    const rx = lerp(lerp(64, 0, open), -55, exit);
    phone.style.display = '';
    phone.style.opacity = String(r2(s, 1.4, 1.75) * (1 - r2(s, T.total - 0.4, T.total)));
    phone.style.transform = `translate3d(0, ${y}px, 0) scale(${sc}) perspective(1600px) rotateX(${rx}deg) rotateZ(${lerp(-8, 0, open)}deg)`;
    const on = range(s, T.screenOn);
    phonePower.style.opacity = String(on * (1 - r2(s, 3.75, 4.05)));
    dev = { x: 0, y, sc, w: 300 * sc, h: 620 * sc };
  }

  // --- Escenas 05+: transiciones entre proyectos ------------------------------
  // La laptop no cambia: cambia su pantalla, el ambiente y el copy.
  function siteStates(): SiteState[] {
    const on = r2(s, 3.7, 3.9);
    const tr = projects.slice(1).map((_, k) => smooth(r2(s, P0 + k + 1 - 0.25, P0 + k + 1 + 0.02)));
    return projects.map((_, i) => {
      const enter: SiteState = i === 0
        ? { o: on, ty: 0, scale: 1, blur: 0 }
        : ENTER[projects[i].showcase.enter](tr[i - 1]);
      const exit: SiteState = i === last
        ? { o: 1, ty: 0, scale: 1, blur: 0 }
        : EXIT[projects[i + 1].showcase.enter](tr[i]);
      return {
        o: enter.o * exit.o,
        ty: enter.ty + exit.ty,
        scale: enter.scale * exit.scale,
        blur: Math.max(enter.blur, exit.blur),
      };
    });
  }

  function applySites(sites: HTMLElement[], scrolls: HTMLElement[], maxes: number[], states: SiteState[], only?: number) {
    sites.forEach((el, i) => {
      const st = states[i];
      const o = only === undefined ? st.o : i === only ? 1 : 0;
      el.style.opacity = String(o);
      el.style.visibility = o <= 0.001 ? 'hidden' : '';
      el.style.transform = only === undefined ? `translate3d(0, ${st.ty}%, 0) scale(${st.scale})` : 'none';
      const bl = only === undefined && st.blur > 0.01 && st.blur < 0.99 && o > 0.01 ? Math.sin(st.blur * Math.PI) * 4 : 0;
      el.style.filter = bl ? `blur(${bl.toFixed(2)}px)` : 'none';
      // Auto-scroll interno: la web "se navega sola" durante su escena
      const t = smooth(r2(s, P0 + i - 0.05, P0 + i + 0.95));
      scrolls[i].style.transform = `translate3d(0, ${-t * maxes[i] * 0.9}px, 0)`;
    });
  }

  function renderProjects({ mode }: Viewport) {
    const states = siteStates();
    if (mode !== 'mobile') {
      applySites(sitesL, scrollL, siteMaxL, states);
      if (phoneIdx >= 0) applySites(sitesP, scrollP, siteMaxP, states, phoneIdx);
    } else {
      applySites(sitesP, scrollP, siteMaxP, states);
    }

    effects.forEach((effect, i) => effect?.(s - (P0 + i)));

    // Copy lateral + indicador
    const copyVis = r2(s, P0 - 0.3, P0) * (1 - r2(s, T.exit[0], T.exit[0] + 0.25));
    projCopy.style.opacity = String(copyVis);
    projCopy.style.visibility = copyVis < 0.01 ? 'hidden' : '';
    projProgress.style.opacity = String(copyVis);
    projItems.forEach((el, i) => {
      const inn = easeOut(r2(s, P0 + i - 0.2, P0 + i + 0.12));
      const out = i === last ? 0 : ease(r2(s, P0 + i + 0.78, P0 + i + 0.98));
      el.style.setProperty('--y', `${(1 - inn) * 140 - out * 140}%`);
      el.style.pointerEvents = inn > 0.9 && out < 0.1 ? 'auto' : 'none';
      el.toggleAttribute('inert', !(inn > 0.9 && out < 0.1));
    });
    const idx = clamp(Math.floor(s - P0 + 0.12), 0, last);
    if (idx !== lastIdx) {
      counterRoll.style.transform = `translateY(${-idx * 1.2}em)`;
      projNow.textContent = `${pad(idx + 1)} / ${pad(projects.length)} · ${projects[idx].indicator}`;
      projProgress.style.setProperty('--proj-accent', projects[idx].accent);
      lastIdx = idx;
    }
    segFills.forEach((f, i) => { f.style.transform = `scaleY(${r2(s, P0 + i, P0 + i + 1)})`; });

    // Tarjetas flotantes (desktop): fragmentos de UI que salen de la pantalla
    if (mode === 'desktop') renderCards();
  }

  function renderCards() {
    fcards.forEach((card) => {
      const i = Number(card.dataset.card);
      const spot = CARD_SPOTS[card.dataset.pos as CardSpot];
      const vin = smooth(r2(s, P0 + i + 0.05, P0 + i + 0.3));
      const vout = i === last ? smooth(r2(s, T.exit[0], T.exit[0] + 0.25)) : smooth(r2(s, P0 + i + 0.78, P0 + i + 0.96));
      const v = vin * (1 - vout);
      card.style.opacity = String(v);
      card.style.visibility = v < 0.01 ? 'hidden' : '';
      if (v < 0.01) return;
      const local = r2(s, P0 + i, P0 + i + 1);
      const cx = dev.x + dev.w * spot.fx;
      const cy = dev.y + dev.h * spot.fy;
      const drift = engine.reducedMotion ? 0 : (local - 0.5) * spot.drift;
      card.style.transform = `translate3d(${cx}px, ${cy + drift + (1 - vin) * 50}px, 0) translate(-50%, -50%) scale(${0.86 + v * 0.14}) rotate(${spot.rot * (1 - v)}deg)`;
    });
  }

  const scene: Scene = {
    measure,
    render(frame: Frame, vp: Viewport) {
      s = clamp((frame.y - storyTop) / vp.vh / timeScale, 0, T.total);
      engine.shared.storyProgress = s;
      renderStory(vp);
      if (vp.mode === 'mobile') renderPhoneMain(vp);
      else renderLaptop(vp);
      renderProjects(vp);
    },
    tick(frame: Frame, vp: Viewport) {
      if (particleIntensity > 0.01 || frame.vel !== 0) particles.draw(vp, particleIntensity, frame.vel);
      return particleIntensity > 0.01;
    },
    pointer(x: number, y: number, { vw, vh }: Viewport) {
      // Hero: la esfera se inclina hacia el cursor
      sphereTilt.style.setProperty('--tx', `${(x / vw - 0.5) * 20}deg`);
      sphereTilt.style.setProperty('--ty', `${-(y / vh - 0.5) * 20}deg`);
    },
    onIntro() {
      heroCopy.classList.add('is-in');
    },
  };

  const cleanupAnchor = engine.setAnchor('projects', () => storyTop + (P0 + 0.1) * engine.vp.vh * timeScale);

  return { scene, dispose: cleanupAnchor };
}

const pad = (n: number) => String(n).padStart(2, '0');
