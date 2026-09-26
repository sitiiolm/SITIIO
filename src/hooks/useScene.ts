'use client';

import { useEffect } from 'react';
import { useMotionEngine } from '@/animations/MotionProvider';
import type { MotionEngine, Scene } from '@/animations/engine';

export interface SceneHandle {
  scene: Scene;
  dispose?: () => void;
}

/**
 * Registra una escena del motor de scroll sobre una sección renderizada en el
 * servidor (se localiza por su id). `create` debe ser una función estable.
 */
export function useScene(
  rootId: string,
  order: number,
  create: (root: HTMLElement, engine: MotionEngine) => SceneHandle,
) {
  const engine = useMotionEngine();

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    const { scene, dispose } = create(root, engine);
    const unregister = engine.register(scene, order);
    return () => {
      unregister();
      dispose?.();
    };
  }, [engine, rootId, order, create]);
}
