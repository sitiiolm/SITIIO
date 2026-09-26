import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { preload } from 'react-dom';
import { siteConfig } from '@/config/site';
import '@/styles/globals.css';

const LOGO_URL = '/images/branding/logo-sitiio.webp';
/** Fuentes de la primera pantalla (las de los proyectos cargan bajo demanda). */
const CRITICAL_FONTS = ['/fonts/sora.woff2', '/fonts/manrope.woff2', '/fonts/space-grotesk.woff2'];

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: '/',
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    // TODO: reemplazar por una imagen Open Graph de 1200×630 cuando exista
    images: [{ url: LOGO_URL, width: 1400, height: 1400, alt: 'Logo de SITIIO' }],
  },
  twitter: {
    card: 'summary',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [LOGO_URL],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070A1F',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // El logo aparece en el loader y en el Hero.
  preload(LOGO_URL, { as: 'image', type: 'image/webp', fetchPriority: 'high' });
  CRITICAL_FONTS.forEach((href) => preload(href, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' }));

  return (
    <html lang={siteConfig.language}>
      <body>
        <a href="#top" className="skip-link">Saltar al contenido</a>
        {children}
      </body>
    </html>
  );
}
