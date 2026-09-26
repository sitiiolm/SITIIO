import { MotionProvider } from '@/animations/MotionProvider';
import { Loader } from '@/components/layout/Loader';
import { Navbar } from '@/components/layout/Navbar';
import { RevealObserver } from '@/components/layout/RevealObserver';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { siteConfig } from '@/config/site';
import { FinalCta } from '@/sections/home/final-cta/FinalCta';
import { Process } from '@/sections/home/process/Process';
import { Services } from '@/sections/home/services/Services';
import { StoryTrack } from '@/sections/home/story/StoryTrack';
import '@/styles/home.css';

/** Datos estructurados del negocio (solo información confirmada). */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/branding/logo-sitiio.webp`,
  telephone: siteConfig.contact.whatsapp.display,
  areaServed: siteConfig.country,
  email: siteConfig.contact.email,
  sameAs: siteConfig.social.map((s) => s.href).filter(Boolean),
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.contact.address.line1,
    addressLocality: siteConfig.city,
    addressCountry: 'PA',
  },
  knowsAbout: siteConfig.services,
};

/**
 * Home — storytelling controlado por el scroll:
 * Hero → laptop → proyectos → Servicios → Proceso → CTA final → Contacto.
 */
export default function HomePage() {
  return (
    <MotionProvider>
      <Loader />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main id="top">
        <StoryTrack />
        <Services />
        <Process />
        <FinalCta />
        <SiteFooter />
      </main>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </MotionProvider>
  );
}
