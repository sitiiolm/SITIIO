import { LogoSphere } from '@/components/brand/Brand';
import { siteConfig } from '@/config/site';

/** Escena 01 — Hero. La esfera (logo) es el personaje de toda la historia. */
export function Hero() {
  return (
    <>
      <div className="hero-copy">
        <h1 className="hero-title">
          <span className="line"><span>Tu negocio</span></span>
          <span className="line"><span>merece un mejor</span></span>
          <span className="line"><span className="gradient-text">SITIIO.</span></span>
        </h1>
        <p className="hero-sub">Diseñamos experiencias web que hacen que tu marca destaque.</p>
        <div className="hero-ctas">
          {/* Lleva a la escena de contacto (CTA de WhatsApp). Cuando exista /cotizar puede apuntar allí. */}
          <a href="#contacto" className="btn btn-primary" data-nav="contact">
            Crear mi SITIIO <span className="arrow" aria-hidden="true">→</span>
          </a>
          <a href="#proyectos" className="btn btn-ghost" data-nav="projects">
            Ver proyectos <span className="arrow arrow-down" aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <div className="hero-meta">
        <span className="label">Hecho en {siteConfig.country} — {siteConfig.foundedYear}</span>
        <span className="scroll-hint" aria-hidden="true">
          <span className="label">Scroll</span>
          <span className="bars"><i /><i /></span>
        </span>
      </div>

      <div className="sphere" aria-hidden="true">
        <div className="sphere-float">
          <div className="sphere-tilt">
            <div className="sphere-glow" />
            <LogoSphere as="div" />
          </div>
        </div>
        <div className="sphere-shadow" />
      </div>
    </>
  );
}
