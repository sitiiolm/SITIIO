import { homeServices } from '@/data/services';
import { SceneMount } from '@/sections/home/SceneMount';

const pad = (n: number) => String(n).padStart(2, '0');

/** Mini-animaciones del visual, una por servicio (mismo orden que homeServices). */
function ServiceVisuals() {
  return (
    <>
      <div className="viz v-landing is-active">
        <div className="page">
          <div className="page-in">
            <div className="b h" /><div className="b" /><div className="b w70" /><div className="cta" /><div className="b img" /><div className="b" /><div className="b w60" /><div className="b img cool" /><div className="b" /><div className="cta" />
          </div>
        </div>
      </div>
      <div className="viz v-corp"><span className="pg" /><span className="pg" /><span className="pg" /><span className="pg" /><span className="pg" /></div>
      <div className="viz v-shop"><div className="cart" /><span className="item" /><span className="item" /><span className="item" /><span className="badge">3</span></div>
      <div className="viz v-folio"><span className="ph2" /><span className="ph2" /><span className="ph2" /><span className="ph2" /></div>
      <div className="viz v-code">
        <div className="code"><b>&lt;Sitiio</b><br />&nbsp;&nbsp;<i>marca</i>=&quot;tuya&quot;<br />&nbsp;&nbsp;<i>idea</i>=&quot;única&quot;<br /><b>/&gt;</b></div>
        <div className="ui"><div /><div /><div /></div>
      </div>
      <div className="viz v-resp"><span className="dev" /></div>
    </>
  );
}

/** Escena 09 — "El índice gigante" */
export function Services() {
  return (
    <section className="services" id="servicios" data-theme="light" aria-labelledby="servicios-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="label reveal section-kicker">Servicios</p>
            <h2 className="reveal" id="servicios-title">Un <span className="gradient-text">SITIIO</span> para cada tipo de negocio.</h2>
          </div>
          <p className="reveal">Desde una página para empezar a vender hasta una tienda completa. Todo diseñado a la medida de tu marca.</p>
        </div>
        <div className="services-body">
          <ol className="svc-list">
            {homeServices.map((svc, i) => (
              <li className="svc" key={svc.word}>
                <span className="svc-num">{pad(i + 1)}</span>
                <span className="svc-word">
                  {svc.word}
                  <span className="fill" aria-hidden="true">{svc.word}</span>
                </span>
                <div className="svc-meta"><span className="label">{svc.label}</span><p>{svc.blurb}</p></div>
              </li>
            ))}
          </ol>
          <div className="svc-visual-wrap">
            <div className="svc-visual" aria-hidden="true">
              <ServiceVisuals />
              <span className="viz-caption label">{`01 — ${homeServices[0].label}`}</span>
            </div>
          </div>
        </div>
      </div>
      <SceneMount scene="services" rootId="servicios" />
    </section>
  );
}
