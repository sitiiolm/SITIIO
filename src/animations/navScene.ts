import type { Frame, MotionEngine, NavKey, Scene } from './engine';
import { luminance } from './math';

/** Navbar: cápsula, auto-ocultar, tema claro/oscuro y link activo. */
export function createNavScene(nav: HTMLElement, engine: MotionEngine): Scene {
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('.nav-links a'));
  let lastScrollY = 0;

  return {
    render({ targetY: y }: Frame) {
      const { shared } = engine;
      nav.classList.toggle('is-capsule', y > 80);
      if (!shared.menuOpen) {
        if (y > lastScrollY + 6 && y > 420) nav.classList.add('is-hidden');
        else if (y < lastScrollY - 6 || y < 420) nav.classList.remove('is-hidden');
      }
      lastScrollY = y;

      // Tema según lo que hay debajo del navbar
      const probe = y + 40;
      const { services, process, contact } = shared.sectionTops;
      let theme: 'dark' | 'light' = 'dark';
      let active: NavKey | null = null;
      if (probe < services) {
        theme = luminance(shared.storyForeground) > 0.5 ? 'dark' : 'light';
        if (shared.storyProgress > shared.projectsStart - 0.3) active = 'projects';
      } else if (probe < process) {
        theme = 'light';
        active = 'services';
      } else if (probe < contact) {
        theme = shared.processDarkness > 0.5 ? 'dark' : 'light';
        active = 'process';
      } else {
        active = 'contact';
      }
      if (shared.menuOpen) theme = 'dark';
      nav.dataset.theme = theme;
      links.forEach((a) => {
        const on = a.dataset.nav === active;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    },
  };
}
