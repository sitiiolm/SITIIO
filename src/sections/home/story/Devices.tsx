import { LogoSphere } from '@/components/brand/Brand';
import { showcaseRegistry } from '@/components/projects/registry';
import { projects } from '@/data/projects';

/** Las mini-webs de todos los proyectos. Se renderizan en la laptop y en el
 *  teléfono: la misma web se reacomoda con container queries. */
function ProjectSites() {
  return (
    <div className="sites">
      {projects.map(({ slug }) => {
        const Site = showcaseRegistry[slug]?.Site;
        return Site ? <Site key={slug} /> : null;
      })}
    </div>
  );
}

/** LAPTOP MOCKUP — CSS 3D, sin marca. Escenas 03–08. */
function LaptopMockup() {
  return (
    <div className="laptop">
      <div className="laptop-base laptop-part" />
      <div className="laptop-lip laptop-part" />
      <div className="laptop-lid">
        <div className="lid-face lid-back laptop-part" />
        <div className="lid-face lid-front laptop-part">
          <div className="screen">
            <ProjectSites />
            <div className="screen-power"><LogoSphere as="div" /></div>
            <div className="screen-flash" />
            <div className="screen-glare" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** PHONE MOCKUP — desktop: acompaña al proyecto responsive · mobile: dispositivo principal. */
function PhoneMockup() {
  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="phone-notch" />
        <ProjectSites />
        <div className="screen-power"><LogoSphere as="div" /></div>
        <div className="screen-glare" />
      </div>
    </div>
  );
}

export function Devices() {
  return (
    <>
      <div className="laptop-shadow" aria-hidden="true" />
      {/* Los dispositivos son una representación visual: su contenido no forma parte del documento. */}
      <div className="scene3d" aria-hidden="true" inert>
        <LaptopMockup />
        <PhoneMockup />
      </div>
      <div className="slit-light" aria-hidden="true" />
    </>
  );
}
