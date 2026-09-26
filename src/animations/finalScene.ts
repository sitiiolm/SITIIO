import type { Frame, MotionEngine, Scene, Viewport } from './engine';
import { clamp, ease, easeOut, r2 } from './math';

/** Punto de partida de cada luz, en fracciones del viewport. */
const DOT_STARTS = [[-0.34, 0.55], [-0.12, 0.62], [0.12, 0.6], [0.34, 0.52]] as const;
const MAGNETIC_RADIUS = 160;

/** CTA final: las 4 luces se reúnen y reconstruyen la esfera; el título se revela palabra a palabra. */
export function createFinalScene(root: HTMLElement, engine: MotionEngine) {
  const dots = Array.from(root.querySelectorAll<HTMLElement>('.light-dot'));
  const logo = root.querySelector<HTMLElement>('.final-sphere .logo-sphere')!;
  const halo = root.querySelector<HTMLElement>('.final-sphere .halo')!;
  const words = Array.from(root.querySelectorAll<HTMLElement>('.final-title .w'));
  const sub = root.querySelector<HTMLElement>('.final-sub')!;
  const cta = root.querySelector<HTMLElement>('.final-ctaw')!;
  const moreCue = root.querySelector<HTMLElement>('.more-cue')!;
  const magnetic = Array.from(root.querySelectorAll<HTMLElement>('[data-magnetic]'));
  const footer = document.getElementById('direccion');

  let top = 0;
  let length = 1;
  let footerViewportTop = Infinity;

  const scene: Scene = {
    measure({ vh }: Viewport) {
      top = root.getBoundingClientRect().top + window.scrollY;
      length = root.offsetHeight - vh;
      engine.shared.sectionTops.contact = top;
    },
    read() {
      // En vivo: el alto de Servicios cambia al activarse cada servicio.
      footerViewportTop = footer ? footer.getBoundingClientRect().top : Infinity;
    },
    render({ y }: Frame, { vw, vh }: Viewport) {
      const p = clamp((y - top + vh * 0.35) / (length + vh * 0.35));
      const conv = ease(r2(p, 0.02, 0.32));
      dots.forEach((d, i) => {
        const [dx, dy] = DOT_STARTS[i];
        d.style.opacity = String(r2(p, 0.02, 0.1) * (1 - r2(p, 0.3, 0.38)));
        d.style.transform = `translate3d(${dx * vw * (1 - conv)}px, ${dy * vh * (1 - conv)}px, 0) scale(${1 + conv})`;
      });
      const ls = easeOut(r2(p, 0.28, 0.46));
      logo.style.opacity = String(ls);
      logo.style.transform = `scale(${ls}) rotate(${(1 - ls) * -140}deg)`;
      halo.style.opacity = String(ls * 0.9);
      const n = Math.round(r2(p, 0.36, 0.66) * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
      sub.classList.toggle('on', p > 0.66);
      cta.classList.toggle('on', p > 0.72);
      // Señal "hay más abajo": aparece con el CTA y se oculta cuando la dirección ya está a la vista
      moreCue.classList.toggle('on', p > 0.76 && footerViewportTop > vh * 0.8);
    },
    pointer(x, y) {
      // Botones magnéticos
      const rects = magnetic.map((btn) => btn.getBoundingClientRect());
      magnetic.forEach((btn, i) => {
        const b = rects[i];
        const dx = x - (b.left + b.width / 2);
        const dy = y - (b.top + b.height / 2);
        btn.style.transform = Math.hypot(dx, dy) < MAGNETIC_RADIUS ? `translate(${dx * 0.12}px, ${dy * 0.18}px)` : '';
      });
    },
  };

  const offContact = engine.setAnchor('contact', () => top + length * 0.85);
  const offAddress = engine.setAnchor('address', () =>
    footer ? footer.getBoundingClientRect().top + window.scrollY - 40 : 0,
  );

  return {
    scene,
    dispose() {
      offContact();
      offAddress();
    },
  };
}
