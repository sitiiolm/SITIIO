/** Índice de servicios de la Home (Escena 09). El orden define la numeración. */
export interface ServiceItem {
  /** Palabra gigante del índice */
  word: string;
  /** Nombre del servicio (también en el pie del visual) */
  label: string;
  blurb: string;
}

export const homeServices: readonly ServiceItem[] = [
  { word: 'LANDING PAGES', label: 'Landing pages', blurb: 'Una página, un objetivo: vender.' },
  { word: 'CORPORATIVAS', label: 'Páginas corporativas', blurb: 'Tu empresa, presentada como merece.' },
  { word: 'E-COMMERCE', label: 'Tiendas online', blurb: 'Vende mientras duermes.' },
  { word: 'PORTAFOLIOS', label: 'Portafolios', blurb: 'Tu trabajo, en su mejor versión.' },
  { word: 'A MEDIDA', label: 'Desarrollo personalizado', blurb: 'Si lo imaginas, lo construimos.' },
  { word: 'RESPONSIVE', label: 'Diseño responsive', blurb: 'Perfecta en cualquier pantalla.' },
];

/** Pasos del proceso (Escena 10). */
export const processSteps = [
  { label: 'Idea', title: 'Cuéntanos tu idea', note: 'Una llamada o un WhatsApp' },
  // TODO (confirmar con Jeferson): tiempos reales de cada paso
  { label: 'Diseño', title: 'Diseñamos tu SITIIO', note: 'Diseño: 5–7 días' },
  { label: 'Desarrollo', title: 'Lo desarrollamos', note: 'Desarrollo: 1–3 semanas' },
  { label: 'Lanzamiento', title: 'Lo publicamos', note: 'Dominio, hosting y listo' },
] as const;
