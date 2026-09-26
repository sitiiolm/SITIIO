'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { MotionEngine } from './engine';

const MotionContext = createContext<MotionEngine | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [engine] = useState(() => new MotionEngine());

  // Los efectos de los hijos (que registran escenas) corren antes que este.
  useEffect(() => {
    engine.start();
    return () => engine.destroy();
  }, [engine]);

  return <MotionContext.Provider value={engine}>{children}</MotionContext.Provider>;
}

export function useMotionEngine(): MotionEngine {
  const engine = useContext(MotionContext);
  if (!engine) throw new Error('useMotionEngine debe usarse dentro de <MotionProvider>');
  return engine;
}
