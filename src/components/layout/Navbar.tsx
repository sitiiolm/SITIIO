'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionEngine } from '@/animations/MotionProvider';
import { SCENE_ORDER } from '@/animations/engine';
import { createNavScene } from '@/animations/navScene';
import { LogoSphere, Wordmark } from '@/components/brand/Brand';
import { PanamaFlag } from '@/components/icons';
import { hashToNavKey, mainNav } from '@/config/navigation';

export function Navbar() {
  const engine = useMotionEngine();
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(
    (force?: boolean) => {
      const open = typeof force === 'boolean' ? force : !engine.shared.menuOpen;
      document.body.classList.toggle('menu-open', open);
      if (open) navRef.current?.classList.remove('is-hidden');
      setMenuOpen(open);
      engine.setMenuOpen(open);
    },
    [engine],
  );

  // Escena del navbar en el motor de scroll
  useEffect(() => {
    if (!navRef.current) return;
    return engine.register(createNavScene(navRef.current, engine), SCENE_ORDER.nav);
  }, [engine]);

  // Todos los enlaces [data-nav] de la página se desplazan al punto exacto de la historia
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[data-nav]');
      const key = link?.dataset.nav;
      if (!key || !engine.hasAnchor(key)) return;
      e.preventDefault();
      toggleMenu(false);
      engine.scrollTo(key);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && engine.shared.menuOpen) toggleMenu(false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [engine, toggleMenu]);

  // Si se llega con un hash (p. ej. /#servicios), ir a esa escena al terminar el loader
  useEffect(
    () =>
      engine.onIntro(() => {
        const key = hashToNavKey[window.location.hash];
        if (key && key !== 'top') requestAnimationFrame(() => engine.scrollTo(key, { instant: true }));
      }),
    [engine],
  );

  return (
    <>
      <header className="nav" id="nav" data-theme="dark" ref={navRef}>
        <div className="nav-inner">
          <a href="#top" className="brand" data-nav="top" aria-label="SITIIO — inicio">
            <LogoSphere />
            <Wordmark />
          </a>
          <nav className="nav-links" aria-label="Principal">
            {mainNav.map((item) => (
              <a key={item.key} href={item.href} data-nav={item.key}>
                {item.label}
              </a>
            ))}
          </nav>
          <a href="#contacto" className="btn nav-cta" data-nav="contact">
            Hablemos <span className="arrow" aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => toggleMenu()}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <div className="mobile-menu" id="mobileMenu" aria-hidden={!menuOpen}>
        <nav aria-label="Menú móvil" style={{ display: 'contents' }}>
          {mainNav.map((item) => (
            <a key={item.key} href={item.href} data-nav={item.key}>
              {item.label}
            </a>
          ))}
        </nav>
        <p className="label">
          Hecho en Panamá <PanamaFlag />
        </p>
      </div>
    </>
  );
}
