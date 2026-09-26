'use client';

import { useEffect, useRef } from 'react';
import { useMotionEngine } from '@/animations/MotionProvider';
import { LogoSphere } from '@/components/brand/Brand';

const INTRO_MS = 1350;
const INTRO_REDUCED_MS = 50;

/** Las dos barras "II" se separan y de entre ellas nace la esfera. */
export function Loader() {
  const engine = useMotionEngine();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add('is-loading');
    const timer = window.setTimeout(() => {
      ref.current?.classList.add('is-done');
      document.body.classList.remove('is-loading');
      engine.completeIntro();
    }, engine.reducedMotion ? INTRO_REDUCED_MS : INTRO_MS);
    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove('is-loading');
    };
  }, [engine]);

  return (
    <>
      <div className="loader" ref={ref} aria-hidden="true">
        <div className="loader-mark">
          <span className="loader-bar" />
          <span className="loader-bar" />
          <LogoSphere as="div" className="loader-logo" />
        </div>
      </div>
      {/* Sin JavaScript: se omite el loader y se muestra el contenido. */}
      <noscript>
        <style>{'.loader{display:none}.line>span{transform:none!important}.hero-sub,.hero-ctas,.reveal{opacity:1;transform:none}'}</style>
      </noscript>
    </>
  );
}
