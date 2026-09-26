import { Fragment, type CSSProperties } from 'react';
import { LogoSphere } from '@/components/brand/Brand';
import { ArrowDownIcon, WhatsAppGlyph } from '@/components/icons';
import { whatsappUrl } from '@/config/site';
import { SceneMount } from '@/sections/home/SceneMount';

const LIGHT_DOTS = ['#1F5BFF', '#BB37F5', '#E42678', '#FE8A2E'];

/** El título se revela palabra a palabra con el scroll. */
const TITLE: { text: string; gradient?: boolean }[] = [
  { text: 'Tu próximo cliente podría estar buscando tu negocio' },
  { text: 'ahora mismo.', gradient: true },
];
const titleWords = TITLE.flatMap(({ text, gradient }) =>
  text.split(/\s+/).map((word) => ({ word, gradient })),
);

/** Escena 11 — "La esfera vuelve a casa" */
export function FinalCta() {
  return (
    <section className="track" id="contacto" data-theme="dark" aria-labelledby="contacto-title">
      <div className="stage">
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <div className="final-inner">
          <div className="final-sphere" aria-hidden="true">
            <span className="halo" />
            {LIGHT_DOTS.map((color) => (
              <span className="light-dot" key={color} style={{ '--dot': color } as CSSProperties} />
            ))}
            <LogoSphere as="div" />
          </div>
          <h2 className="final-title" id="contacto-title">
            {titleWords.map(({ word, gradient }, i) => (
              <Fragment key={i}>
                {i > 0 && ' '}
                <span className={gradient ? 'w gradient-text' : 'w'}>{word}</span>
              </Fragment>
            ))}
          </h2>
          <p className="final-sub">Dale un SITIIO donde encontrarte.</p>
          <div className="final-ctaw">
            <a className="btn btn-primary btn-xl" data-magnetic="" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <WhatsAppGlyph />
              Crear mi SITIIO <span className="arrow" aria-hidden="true">→</span>
              <span className="sr-only"> (abre WhatsApp)</span>
            </a>
          </div>
          {/* SCROLL CUE: indica que abajo hay más información (dirección y contacto) */}
          <a href="#direccion" className="more-cue" data-nav="address" aria-label="Ver dirección y contacto">
            <span className="label">Dirección y contacto</span>
            <span className="more-cue-icon" aria-hidden="true"><ArrowDownIcon /></span>
          </a>
        </div>
      </div>
      <SceneMount scene="final" rootId="contacto" />
    </section>
  );
}
