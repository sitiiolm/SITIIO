import type { ShowcaseEffect } from '@/animations/story/storyScene';
import { createOrbeCartEffect } from './orbe/cartEffect';

/**
 * Interacciones ligadas al scroll de cada proyecto (lado cliente).
 * Separado de registry.ts para no enviar las mini-webs al bundle de JS.
 */
export const showcaseEffects: Record<string, (storyRoot: HTMLElement) => ShowcaseEffect> = {
  orbe: createOrbeCartEffect,
};
