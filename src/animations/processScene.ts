import type { Frame, MotionEngine, Scene, Viewport } from './engine';
import { clamp, hexToRgb, mixRgb, r2, rgbStr, smooth } from './math';

const BG_FROM = hexToRgb('#FFFFFF');
const BG_TO = hexToRgb('#070A1F');
const FG_FROM = hexToRgb('#0B0D1A');
const FG_TO = hexToRgb('#F4F3FF');
const THRESHOLDS = [0, 1 / 3, 2 / 3, 1];

/** Proceso: la esfera recorre el camino y lo pinta; el fondo pasa de blanco a navy. */
export function createProcessScene(root: HTMLElement, engine: MotionEngine) {
  const stage = root.querySelector<HTMLElement>('.stage')!;
  const line = root.querySelector<HTMLElement>('.proc-line')!;
  const fill = root.querySelector<HTMLElement>('.fill-line')!;
  const traveler = root.querySelector<HTMLElement>('.proc-traveler')!;
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('.proc-node'));
  const visuals = Array.from(root.querySelectorAll<HTMLElement>('.pv'));

  let top = 0;
  let length = 1;
  let lineLen = 0;
  let vertical = false;
  let step = -1;

  const scene: Scene = {
    measure({ vh, mode }: Viewport) {
      top = root.getBoundingClientRect().top + window.scrollY;
      length = root.offsetHeight - vh;
      vertical = mode === 'mobile';
      lineLen = vertical ? line.offsetHeight : line.offsetWidth;
      engine.shared.sectionTops.process = top;
    },
    render({ y }: Frame) {
      const p = clamp((y - top) / length);
      const lp = r2(p, 0.08, 0.84);
      fill.style.transform = vertical ? `scaleY(${lp})` : `scaleX(${lp})`;
      traveler.style.transform =
        (vertical ? `translate3d(0, ${lp * lineLen}px, 0)` : `translate3d(${lp * lineLen}px, 0, 0)`) + ` rotate(${lp * 540}deg)`;
      nodes.forEach((n, i) => n.classList.toggle('is-on', lp >= THRESHOLDS[i] - 0.005));
      const next = lp >= 0.995 ? 3 : lp >= 2 / 3 - 0.005 ? 2 : lp >= 1 / 3 - 0.005 ? 1 : 0;
      if (next !== step) {
        visuals.forEach((v, i) => v.classList.toggle('is-active', i === next));
        step = next;
      }
      const dark = smooth(r2(p, 0.84, 0.96)); // la oscuridad llega con LANZAMIENTO
      engine.shared.processDarkness = dark;
      stage.style.setProperty('--proc-bg', rgbStr(mixRgb(BG_FROM, BG_TO, dark)));
      stage.style.setProperty('--proc-fg', rgbStr(mixRgb(FG_FROM, FG_TO, dark)));
    },
  };

  return { scene, dispose: engine.setAnchor('process', () => top + 2) };
}
