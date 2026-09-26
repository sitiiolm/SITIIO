import { showcaseRegistry } from '@/components/projects/registry';
import { features, routes } from '@/config/navigation';
import { projects } from '@/data/projects';

const pad = (n: number) => String(n).padStart(2, '0');

/** Fragmentos de interfaz que "salen" de la pantalla (desktop). */
export function FloatingCards() {
  return (
    <div className="fcards" aria-hidden="true">
      {projects.map(({ slug }, index) => {
        const Cards = showcaseRegistry[slug]?.Cards;
        return Cards ? <Cards key={slug} index={index} /> : null;
      })}
    </div>
  );
}

/** Copy lateral de cada proyecto (nombre, rubro, frase, etiquetas). */
export function ProjectCopy() {
  return (
    <div className="proj-copy">
      <div className="meta label">
        <span>
          Proyecto{' '}
          <span className="counter">
            <span className="roll">
              {projects.map((p, i) => <span key={p.slug}>{pad(i + 1)}</span>)}
            </span>
          </span>
        </span>
        <span className="sep" />
        <span>Concepto de ejemplo</span>
      </div>
      <div className="proj-items">
        {projects.map((p) => (
          <div className="proj-item" data-slug={p.slug} key={p.slug}>
            <h3 className="proj-name">
              <span className="line">
                <span style={{ fontFamily: p.typography.fontFamily, fontWeight: p.typography.fontWeight }}>{p.name}</span>
              </span>
            </h3>
            <p className="proj-rubro label"><span className="line"><span>{p.category}</span></span></p>
            <p className="proj-phrase"><span className="line"><span>{p.description}</span></span></p>
            <div className="proj-tags">
              <span className="line">
                <span>
                  {p.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                </span>
              </span>
            </div>
            <span className="line proj-link">
              <span>
                {features.projectPages ? (
                  <a href={routes.project(p.slug)} className="btn-link">Ver caso completo →</a>
                ) : (
                  // Hasta que exista /proyectos/[slug] se muestra igual pero sin navegar.
                  <span className="btn-link">Ver caso completo →</span>
                )}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Indicador lateral: segmentos + "01 / 04 · MOKA" */
export function ProjectIndicator() {
  const first = projects[0];
  return (
    <div className="proj-progress label" aria-hidden="true">
      <span className="now">{`01 / ${pad(projects.length)} · ${first.indicator}`}</span>
      <span className="segs">
        {projects.map((p) => <span className="seg" key={p.slug}><i /></span>)}
      </span>
    </div>
  );
}
