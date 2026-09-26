import { LogoSphere } from '@/components/brand/Brand';
import { processSteps } from '@/data/services';
import { SceneMount } from '@/sections/home/SceneMount';

const pad = (n: number) => String(n).padStart(2, '0');

/** Escena 10 — "El camino de la esfera". El fondo pasa de blanco a navy mientras avanza. */
export function Process() {
  return (
    <section className="track" id="proceso" aria-labelledby="proceso-title">
      <div className="stage">
        <div className="proc-inner">
          <div className="proc-head">
            <div>
              <p className="label proc-kicker">Proceso</p>
              <h2 id="proceso-title">De la idea a estar <span className="gradient-text">en línea.</span></h2>
            </div>
            <p className="label">{processSteps.length} pasos · sin complicaciones</p>
          </div>

          <div className="proc-visual" aria-hidden="true">
            <div className="pv pv-chat is-active"><span>Hola, quiero una web 👋</span><span>¡Cuéntanos tu idea!</span></div>
            <div className="pv pv-design"><div className="pv-frame"><i className="big" /><i /><i className="w60" /></div></div>
            <div className="pv pv-web"><div className="pv-frame"><i className="big" /><i /><i className="w60" /></div></div>
            <div className="pv pv-launch"><span className="rocket" /><span className="gradient-text">¡En línea!</span></div>
          </div>

          <div className="proc-line">
            <span className="track-line" />
            <span className="fill-line" />
            <LogoSphere className="proc-traveler" />
            {processSteps.map((step, i) => (
              <div className="proc-node" style={{ left: `${(i / (processSteps.length - 1)) * 100}%` }} key={step.label}>
                <span className="dot" />
                <span className="num">{pad(i + 1)}</span>
                <div className="txt"><span className="label">{step.label}</span><strong>{step.title}</strong><small>{step.note}</small></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SceneMount scene="process" rootId="proceso" />
    </section>
  );
}
