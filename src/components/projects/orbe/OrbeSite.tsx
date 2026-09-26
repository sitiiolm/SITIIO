import { FloatingCard, type FloatingCardsProps } from '../FloatingCard';

/** `add`: en qué producto del carrito se agrega mientras se hace scroll (ver cartEffect). */
const PRODUCTS: { name: string; price: string; color: string; add?: number }[] = [
  { name: 'Runner Lima', price: '$89', color: '#B69CFF', add: 1 },
  { name: 'Gorra Orbe', price: '$29', color: '#C6F432' },
  { name: 'Hoodie Drop 04', price: '$59', color: '#FFC9A8', add: 2 },
  { name: 'Bolso Urbano', price: '$45', color: '#9ED8FF' },
];

export function OrbeSite() {
  return (
    <article className="site orbe" data-project="orbe">
      <div className="site-scroll">
        <div className="orbe-bar">ENVÍO GRATIS EN PANAMÁ DESDE $50</div>
        <nav className="orbe-nav">
          <span className="orbe-logo">ORBE</span>
          <span className="orbe-links"><span>Nuevo</span><span>Hombre</span><span>Mujer</span><span>Accesorios</span></span>
          <span className="orbe-icons">
            <span className="orbe-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#0B0B0B" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg></span>
            <span className="orbe-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#0B0B0B" strokeWidth="2.2"><path d="M5 8h14l-1.5 12h-11z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg><span className="orbe-badge" data-cart-count="">0</span></span>
          </span>
        </nav>
        <section className="orbe-hero">
          <div>
            <span className="orbe-tag">EDICIÓN LIMITADA</span>
            <div className="orbe-h1">DROP<br />04</div>
            <p>Colección urbana diseñada para moverse por la ciudad.</p>
            <div className="orbe-actions"><span className="orbe-btn">Comprar ahora →</span><span className="orbe-btn alt">Ver colección</span></div>
          </div>
          {/* TEMP ASSET: foto de producto (zapatilla dibujada con CSS) */}
          <div className="orbe-product"><span className="disc" /><span className="shoe" /><span className="orbe-price">$89</span></div>
        </section>
        <section className="orbe-grid">
          <div className="head"><div className="wide orbe-grid-title">Lo más vendido</div><span className="orbe-see-all">Ver todo →</span></div>
          <div className="orbe-products">
            {PRODUCTS.map((p) => (
              <div className="orbe-card" key={p.name}>
                <div className="ph" data-asset="foto" style={{ background: p.color }} />
                <div className="n">{p.name}</div>
                <div className="row"><span className="p">{p.price}</span><span className="orbe-add" data-add={p.add}>+ Añadir</span></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

export function OrbeCards({ index }: FloatingCardsProps) {
  return (
    <FloatingCard index={index} spot="c">
      <strong>Tu carrito (2)</strong><small>Runner Lima · Hoodie Drop 04</small><div className="fcard-orbe-total">$148.00</div><span className="pill orbe-pill">Pagar ahora →</span>
    </FloatingCard>
  );
}
