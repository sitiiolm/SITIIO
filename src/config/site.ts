/**
 * Configuración central del negocio. Cualquier dato de contacto o de marca
 * que se muestre en más de un lugar debe salir de aquí.
 */

export const siteConfig = {
  name: 'SITIIO',
  tagline: 'Tu negocio merece un mejor SITIIO',
  description:
    'SITIIO diseña y desarrolla páginas web en Panamá: landing pages, sitios corporativos, e-commerce, portafolios y desarrollo a la medida.',
  country: 'Panamá',
  city: 'Ciudad de Panamá',
  locale: 'es_PA',
  language: 'es',
  foundedYear: 2026,
  /** Dominio público. Se define con NEXT_PUBLIC_SITE_URL al desplegar. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sitiio.com').replace(/\/$/, ''),

  services: [
    'Landing Pages',
    'Páginas corporativas',
    'E-commerce',
    'Portafolios',
    'Desarrollo personalizado',
    'Responsive Design',
  ],

  contact: {
    whatsapp: {
      /** Formato internacional sin símbolos, como lo pide wa.me */
      number: '50761709130',
      display: '+507 6170-9130',
      defaultMessage: 'Hola, vi SITIIO y me gustaría cotizar una página web.',
      hours: 'Lun – Vie · 8:00 am – 6:00 pm',
    },
    email: 'sitiiolm@gmail.com',
    emailNote: 'Te respondemos en menos de 24 h',
    address: {
      line1: 'Ciudad del Saber, Edificio 347-AB',
      line2: 'Ciudad de Panamá, Panamá',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ciudad+del+Saber+Edificio+347-AB+Panama',
    },
  },

  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/sitiio.lm/' },
  ] as { label: string; href: string }[],
} as const;

/** Abre la redacción de Gmail en el navegador (en lugar del cliente de correo del sistema). */
export function gmailComposeUrl(to: string = siteConfig.contact.email): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}`;
}

export function whatsappUrl(message: string = siteConfig.contact.whatsapp.defaultMessage): string {
  return `https://wa.me/${siteConfig.contact.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
