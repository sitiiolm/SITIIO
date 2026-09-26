import type { Viewport } from '../engine';

/** Líneas finas que suben mientras "la cámara baja" (Escena 02). */

const COLORS = ['187,55,245', '253,108,172', '53,201,254', '254,138,46'];
const COUNT = 64;

interface Particle {
  x: number;
  y: number;
  len: number;
  sp: number;
  w: number;
  c: string;
  a: number;
}

export function createParticles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  const parts: Particle[] = Array.from({ length: COUNT }, () => ({
    x: Math.random(),
    y: Math.random(),
    len: 8 + Math.random() * 40,
    sp: 0.4 + Math.random() * 1.4,
    w: Math.random() < 0.3 ? 2 : 1,
    c: COLORS[Math.floor(Math.random() * COLORS.length)],
    a: 0.3 + Math.random() * 0.6,
  }));

  return {
    resize({ vw, vh }: Viewport) {
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    draw({ vw, vh }: Viewport, intensity: number, vel: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, vw, vh);
      if (intensity <= 0.01) return;
      const boost = Math.min(Math.abs(vel) * 0.35, 30);
      for (const p of parts) {
        p.y -= (p.sp + boost * p.sp * 0.3) / vh;
        if (p.y < -0.1) {
          p.y = 1.1;
          p.x = Math.random();
        }
        const x = p.x * vw;
        const y = p.y * vh;
        const l = p.len * (1 + boost * 0.08);
        const g = ctx.createLinearGradient(x, y, x, y + l);
        g.addColorStop(0, `rgba(${p.c},${p.a * intensity})`);
        g.addColorStop(1, `rgba(${p.c},0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = p.w;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + l);
        ctx.stroke();
      }
    },
  };
}
