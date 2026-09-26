'use client';

import { SCENE_ORDER } from '@/animations/engine';
import { createFinalScene } from '@/animations/finalScene';
import { createProcessScene } from '@/animations/processScene';
import { createServicesScene } from '@/animations/servicesScene';
import { useScene } from '@/hooks/useScene';

const factories = {
  services: createServicesScene,
  process: createProcessScene,
  final: createFinalScene,
} as const;

/** Conecta una sección renderizada en el servidor con su escena del motor de scroll. */
export function SceneMount({ scene, rootId }: { scene: keyof typeof factories; rootId: string }) {
  useScene(rootId, SCENE_ORDER[scene], factories[scene]);
  return null;
}
