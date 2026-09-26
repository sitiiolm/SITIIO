import type { MotionEngine, Scene, Viewport } from './engine';
import { clamp } from './math';

/** Servicios: la palabra que cruza el centro de la pantalla se enciende. */
export function createServicesScene(root: HTMLElement, engine: MotionEngine) {
  const items = Array.from(root.querySelectorAll<HTMLElement>('.svc'));
  const words = items.map((li) => li.querySelector<HTMLElement>('.svc-word')!);
  const labels = items.map((li) => li.querySelector('.svc-meta .label')?.textContent ?? '');
  const vizzes = Array.from(root.querySelectorAll<HTMLElement>('.viz'));
  const caption = root.querySelector<HTMLElement>('.viz-caption')!;
  const visual = root.querySelector<HTMLElement>('.svc-visual')!;

  let inView = false;
  let rects: DOMRect[] = [];
  let active = -1;
  let hover: number | null = null;

  const scene: Scene = {
    measure() {
      engine.shared.sectionTops.services = root.getBoundingClientRect().top + window.scrollY;
    },
    read(_frame, { vh }: Viewport) {
      const rect = root.getBoundingClientRect();
      inView = !(rect.bottom < 0 || rect.top > vh);
      if (inView) rects = items.map((li) => li.getBoundingClientRect());
    },
    render(_frame, { vh }: Viewport) {
      if (!inView) return;
      let best = 0;
      let bestD = Infinity;
      rects.forEach((r, i) => {
        const d = r.top + r.height / 2 - vh * 0.5;
        if (Math.abs(d) < bestD) {
          bestD = Math.abs(d);
          best = i;
        }
        const fill = clamp(0.78 - d / (r.height * 1.6)) * 100;
        words[i].style.setProperty('--fill', `${(Math.abs(d) < r.height * 1.4 ? fill : 0).toFixed(1)}%`);
      });
      setActive(hover ?? best);
    },
    pointer(x, y, { vh }) {
      // El visual se inclina con el cursor
      const r = visual.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        visual.style.setProperty('--vx', `${((x - r.left) / r.width - 0.5) * 10}deg`);
        visual.style.setProperty('--vy', `${-((y - r.top) / r.height - 0.5) * 10}deg`);
      }
    },
  };

  function setActive(next: number) {
    if (next === active) return;
    items.forEach((li, i) => li.classList.toggle('is-active', i === next));
    vizzes.forEach((v, i) => v.classList.toggle('is-active', i === next));
    caption.textContent = `0${next + 1} — ${labels[next]}`;
    active = next;
  }

  // Al pasar el cursor por un servicio, ese servicio toma el control del visual
  const listeners = engine.finePointer
    ? items.map((li, i) => {
        const enter = () => { hover = i; engine.invalidate(); };
        const leave = () => { hover = null; engine.invalidate(); };
        li.addEventListener('mouseenter', enter);
        li.addEventListener('mouseleave', leave);
        return () => {
          li.removeEventListener('mouseenter', enter);
          li.removeEventListener('mouseleave', leave);
        };
      })
    : [];
  const cleanupAnchor = engine.setAnchor('services', () => engine.shared.sectionTops.services);

  return {
    scene,
    dispose() {
      listeners.forEach((off) => off());
      cleanupAnchor();
    },
  };
}
