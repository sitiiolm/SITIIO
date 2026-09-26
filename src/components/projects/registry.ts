import type { ComponentType } from 'react';
import type { FloatingCardsProps } from './FloatingCard';
import { LumeCards, LumeSite } from './lume/LumeSite';
import { MokaCards, MokaSite } from './moka/MokaSite';
import { NovaCards, NovaSite } from './nova/NovaSite';
import { OrbeCards, OrbeSite } from './orbe/OrbeSite';

export interface ShowcaseEntry {
  /** Mini-web completa (canvas 1280×800, se reacomoda en el teléfono) */
  Site: ComponentType;
  /** Fragmentos de interfaz que salen de la pantalla (solo desktop) */
  Cards?: ComponentType<FloatingCardsProps>;
}

/**
 * Relaciona cada `slug` de src/data/projects.ts con su presentación.
 * Las interacciones ligadas al scroll se registran en ./effects.ts.
 */
export const showcaseRegistry: Record<string, ShowcaseEntry> = {
  moka: { Site: MokaSite, Cards: MokaCards },
  lume: { Site: LumeSite, Cards: LumeCards },
  nova: { Site: NovaSite, Cards: NovaCards },
  orbe: { Site: OrbeSite, Cards: OrbeCards },
};
