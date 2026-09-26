'use client';

import { SCENE_ORDER } from '@/animations/engine';
import { createStoryScene } from '@/animations/story/storyScene';
import { showcaseEffects } from '@/components/projects/effects';
import { projects } from '@/data/projects';
import { useScene, type SceneHandle } from '@/hooks/useScene';
import type { MotionEngine } from '@/animations/engine';

function createScene(root: HTMLElement, engine: MotionEngine): SceneHandle {
  const effects = projects.map((p) => showcaseEffects[p.slug]?.(root));
  return createStoryScene(root, engine, { projects, effects });
}

export function StoryController({ rootId }: { rootId: string }) {
  useScene(rootId, SCENE_ORDER.story, createScene);
  return null;
}
