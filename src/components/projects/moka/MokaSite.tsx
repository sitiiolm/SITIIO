import { FloatingCard, type FloatingCardsProps } from '../FloatingCard';

// TEMP ASSET: todas las "fotos" de MOKA son placeholders dibujados con CSS.
export function MokaSite() {
  return (
    <article className="site moka" data-project="moka">
      <div className="site-scroll">
        <nav className="moka-nav">
          <span className="moka-logo">MOKA</span>
          <span className="moka-links"><span>Menú</span><span>Nuestro café</span><span>Ubicación</span></span>
          <span className="moka-btn">Reservar mesa</span>
        </nav>
        <section className="moka-hero">
          <div>
            <span className="moka-kicker">Tostado en Boquete, Panamá</span>
            <div className="moka-h1">Café que se toma <i>su tiempo.</i></div>
            <p className="moka-p">Granos de especialidad, pastelería de la casa y un rincón tranquilo en el Casco Antiguo.</p>
            <div className="moka-actions"><span className="moka-btn dark">Ver menú</span><span className="moka-btn line">Pedir por WhatsApp</span></div>
          </div>
          {/* TEMP ASSET: fotografía de taza de café (reemplazar por foto real) */}
          <div className="moka-photo ph" data-asset="foto temporal"><span className="steam s1" /><span className="steam" /><span className="steam s2" /><span className="heart" /></div>
        </section>
        <div className="moka-strip"><span>Espresso</span><span>·</span><span>Cappuccino</span><span>·</span><span>Cold brew</span><span>·</span><span>Pastelería</span></div>
        <section className="moka-menu">
          <div className="serif moka-menu-title">Nuestro menú</div>
          <div className="moka-cards">
            <div className="moka-card"><div className="ph moka-ph-espresso" data-asset="foto" /><div className="serif moka-card-title">Espresso</div><div className="row"><span>Origen Boquete</span><span className="price">$2.50</span></div></div>
            <div className="moka-card"><div className="ph moka-ph-cappuccino" data-asset="foto" /><div className="serif moka-card-title">Cappuccino</div><div className="row"><span>Leche o avena</span><span className="price">$3.75</span></div></div>
            <div className="moka-card"><div className="ph moka-ph-coldbrew" data-asset="foto" /><div className="serif moka-card-title">Cold brew</div><div className="row"><span>18 horas de extracción</span><span className="price">$4.00</span></div></div>
          </div>
        </section>
        <footer className="moka-foot"><span className="serif">Visítanos en el Casco Antiguo</span><span>Abierto todos los días · 7am – 7pm</span></footer>
      </div>
    </article>
  );
}

export function MokaCards({ index }: FloatingCardsProps) {
  return (
    <>
      <FloatingCard index={index} spot="a">
        <div className="hrow"><span className="check moka-check">✓</span><div><strong>Reserva confirmada</strong><small>Mesa para 2 · Hoy 7:30 pm</small></div></div>
      </FloatingCard>
      <FloatingCard index={index} spot="b" className="fcard-moka-product">
        <div className="cup"><span className="body" /><span className="handle" /><span className="steam" /><span className="steam" /><span className="steam" /></div>
        <strong>Cold brew</strong><small>$4.00</small><br /><span className="pill">+ Añadir</span>
      </FloatingCard>
    </>
  );
}
