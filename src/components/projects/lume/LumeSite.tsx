import { FloatingCard, type FloatingCardsProps } from '../FloatingCard';

const CAL_WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const CAL_DAYS: { d: number; kind?: 'dot' | 'sel' }[] = [
  { d: 6 }, { d: 7 }, { d: 8, kind: 'dot' }, { d: 9 }, { d: 10, kind: 'dot' }, { d: 11 }, { d: 12 },
  { d: 13 }, { d: 14, kind: 'sel' }, { d: 15 }, { d: 16, kind: 'dot' }, { d: 17 }, { d: 18 }, { d: 19 },
];
const RITUALS = [
  { name: 'Facial glow', time: '60 MIN', price: '$65' },
  { name: 'Lash lift', time: '45 MIN', price: '$45' },
  { name: 'Manicura spa', time: '50 MIN', price: '$30' },
  { name: 'Maquillaje social', time: '60 MIN', price: '$55' },
];
const MINI_CAL: { d: number; kind?: 'av' | 'sel' }[] = [
  { d: 13 }, { d: 14, kind: 'sel' }, { d: 15 }, { d: 16, kind: 'av' }, { d: 17 }, { d: 18, kind: 'av' }, { d: 19 },
  { d: 20, kind: 'av' }, { d: 21 }, { d: 22 }, { d: 23, kind: 'av' }, { d: 24 }, { d: 25 }, { d: 26 },
];

export function LumeSite() {
  return (
    <article className="site lume" data-project="lume">
      <div className="site-scroll">
        <nav className="lume-nav">
          <span className="l"><span>Servicios</span><span>Estudio</span><span>Galería</span></span>
          <span className="lume-logo">Lumé</span>
          <span className="r">Reservar cita</span>
        </nav>
        <section className="lume-hero">
          <div>
            <div className="lume-h1">Belleza<br />que se<br /><i>siente.</i></div>
            <div className="lume-caption"><span>BEAUTY STUDIO</span><span>OBARRIO, PANAMÁ</span><span>DESDE 2019</span></div>
          </div>
          {/* TEMP ASSET: retrato editorial (reemplazar por fotografía real) */}
          <div className="lume-arch ph" data-asset="foto temporal"><span className="orb" /><span className="shoulders" /></div>
        </section>
        <section className="lume-services">
          <div className="head"><div className="serif lume-services-title">Rituales</div><span className="lume-see-all">VER TODOS →</span></div>
          {RITUALS.map((r) => (
            <div className="lume-row" key={r.name}><span className="name">{r.name}</span><span className="muted">{r.time}</span><span>{r.price}</span></div>
          ))}
        </section>
        <section className="lume-book">
          <div><div className="serif lume-book-title">Tu momento,<br /><i>a un clic.</i></div><span className="lume-btn">Reservar cita</span></div>
          <div className="lume-cal">
            {CAL_WEEKDAYS.map((w, i) => <b key={i}>{w}</b>)}
            {CAL_DAYS.map(({ d, kind }) => <span key={d} className={kind}>{d}</span>)}
          </div>
        </section>
      </div>
    </article>
  );
}

export function LumeCards({ index }: FloatingCardsProps) {
  return (
    <>
      <FloatingCard index={index} spot="a">
        <strong className="fcard-lume-month">Octubre</strong>
        <div className="mini-cal">
          {MINI_CAL.map(({ d, kind }) => <span key={d} className={kind}>{d}</span>)}
        </div>
      </FloatingCard>
      <FloatingCard index={index} spot="b">
        <small className="fcard-lume-kicker">RITUAL</small><strong className="fcard-lume-ritual">Facial glow</strong><small>60 min · $65</small><br /><span className="pill lume-pill">RESERVAR</span>
      </FloatingCard>
    </>
  );
}
