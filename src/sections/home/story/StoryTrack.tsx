import { createTimeline } from '@/animations/story/timeline';
import { projects } from '@/data/projects';
import { Devices } from './Devices';
import { Hero } from './Hero';
import { FloatingCards, ProjectCopy, ProjectIndicator } from './ProjectShowcase';
import { StoryController } from './StoryController';

const STORY_ID = 'story';
const timeline = createTimeline(projects.length);

/**
 * STORY TRACK — escenas 01 → 08 en un escenario "sticky".
 * El motor de scroll (StoryController) convierte el scroll en la línea de tiempo.
 */
export function StoryTrack() {
  return (
    <section
      className="track"
      id={STORY_ID}
      aria-label="SITIIO: historia y proyectos"
      style={{ height: `${(timeline.total + 1) * 100}vh` }}
    >
      {/* Destino de "#proyectos" (el motor lleva al punto exacto del showcase) */}
      <span id="proyectos" style={{ position: 'absolute', top: `${(timeline.projectsStart + 0.1) * 100}vh` }} />

      <div className="stage">
        <div className="ambient" aria-hidden="true">
          <div className="glow" />
          <div className="glow" />
        </div>
        <canvas className="particles" aria-hidden="true" />

        <Hero />

        <p className="story-line">
          Todo negocio necesita <em className="gradient-text">un lugar</em> en internet.
        </p>
        <h2 className="behind-title">
          Esto es lo que podemos <span className="gradient-text">crear para ti.</span>
        </h2>

        <Devices />
        <FloatingCards />
        <ProjectCopy />
        <ProjectIndicator />
      </div>
      <StoryController rootId={STORY_ID} />
    </section>
  );
}
