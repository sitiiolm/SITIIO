import type { ReactNode } from 'react';

export interface FloatingCardsProps {
  /** Posición del proyecto en el showcase */
  index: number;
}

interface FloatingCardProps {
  index: number;
  /** a: arriba-derecha · b: abajo-izquierda · c: arriba-izquierda (respecto del dispositivo) */
  spot: 'a' | 'b' | 'c';
  className?: string;
  children: ReactNode;
}

export function FloatingCard({ index, spot, className, children }: FloatingCardProps) {
  return (
    <div className={className ? `fcard ${className}` : 'fcard'} data-card={index} data-pos={spot}>
      {children}
    </div>
  );
}
