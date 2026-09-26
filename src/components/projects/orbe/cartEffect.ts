import { r2 } from '@/animations/math';
import type { ShowcaseEffect } from '@/animations/story/storyScene';

/** Carrito de ORBE: se agregan productos mientras bajas (en laptop y teléfono). */
export function createOrbeCartEffect(root: HTMLElement): ShowcaseEffect {
  const badges = Array.from(root.querySelectorAll<HTMLElement>('[data-cart-count]'));
  const buttons = Array.from(root.querySelectorAll<HTMLElement>('.orbe-add[data-add]'));
  let lastCart = -1;

  return (offset) => {
    const t = r2(offset, 0, 0.9);
    const cart = (t > 0.25 ? 1 : 0) + (t > 0.55 ? 1 : 0);
    if (cart === lastCart) return;
    badges.forEach((badge) => {
      badge.textContent = String(cart);
      badge.classList.remove('pop');
      void badge.offsetWidth; // reinicia la transición del "pop"
      if (cart) badge.classList.add('pop');
    });
    buttons.forEach((btn) => {
      const added = cart >= Number(btn.dataset.add);
      btn.classList.toggle('done', added);
      btn.textContent = added ? 'Añadido ✓' : '+ Añadir';
    });
    lastCart = cart;
  };
}
