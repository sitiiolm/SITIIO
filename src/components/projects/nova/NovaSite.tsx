import { FloatingCard, type FloatingCardsProps } from '../FloatingCard';

const PROPERTIES = [
  { ph: 'nova-ph1', price: '$890,000', name: 'Penthouse Costa del Este', specs: '3 hab · 3 baños · 240 m²' },
  { ph: 'nova-ph2', price: '$640,000', name: 'Loft Punta Pacífica', specs: '2 hab · 2 baños · 150 m²' },
  { ph: 'nova-ph3', price: '$1,250,000', name: 'Casa Santa María', specs: '4 hab · 5 baños · 420 m²' },
];

export function NovaSite() {
  return (
    <article className="site nova" data-project="nova">
      <div className="site-scroll">
        {/* TEMP ASSET: fotografía arquitectónica (edificio dibujado con CSS) */}
        <section className="nova-hero ph" data-asset="foto temporal">
          <span className="windows" />
          <nav className="nova-nav">
            <span className="nova-logo">NOVA</span>
            <span className="nova-links"><span>Comprar</span><span>Alquilar</span><span>Proyectos</span><span>Contacto</span></span>
            <span className="nova-btn">Agendar visita</span>
          </nav>
          <div className="nova-copy">
            <div className="nova-h1">Vive a otra<br />altura.</div>
            <p>Residencias exclusivas en Costa del Este, Punta Pacífica y Santa María.</p>
          </div>
        </section>
        <div className="nova-search">
          <div><small>Ubicación</small><strong>Costa del Este</strong></div>
          <div><small>Tipo</small><strong>Penthouse</strong></div>
          <div><small>Precio</small><strong>$500k – $1M</strong></div>
          <span className="go">BUSCAR</span>
        </div>
        <section className="nova-list">
          <div className="head"><div className="cond nova-list-title">Propiedades<br />destacadas</div><span className="nova-btn dark">Ver todas</span></div>
          <div className="nova-cards">
            {PROPERTIES.map((p) => (
              <div className="nova-card" key={p.name}><div className={`ph ${p.ph}`} data-asset="foto" /><div className="price">{p.price}</div><div className="name">{p.name}</div><div className="specs">{p.specs}</div></div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

export function NovaCards({ index }: FloatingCardsProps) {
  return (
    <>
      <FloatingCard index={index} spot="a">
        <strong>Costa del Este</strong><small>Ciudad de Panamá</small><div className="mini-map"><span className="sea" /><span className="pin" /></div>
      </FloatingCard>
      <FloatingCard index={index} spot="b">
        <strong className="fcard-nova-price">$890,000</strong><small>240 m² · 3 hab · 3 baños</small><br /><span className="pill nova-pill">Agendar visita</span>
      </FloatingCard>
    </>
  );
}
