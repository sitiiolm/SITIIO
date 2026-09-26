export type Range = readonly [number, number];
export type RGB = readonly [number, number, number];
export type ColorStop = readonly [number, string];
export type RgbStop = readonly [number, RGB];

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Progreso 0→1 de `v` dentro del rango [a, b]. */
export const range = (v: number, [a, b]: Range) => clamp((v - a) / (b - a));
export const r2 = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const mixRgb = (a: RGB, b: RGB, t: number): RGB =>
  a.map((v, i) => Math.round(lerp(v, b[i], t))) as unknown as RGB;
export const rgbStr = (c: RGB, alpha = 1) =>
  alpha === 1 ? `rgb(${c[0]},${c[1]},${c[2]})` : `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
export const prepStops = (stops: readonly ColorStop[]): RgbStop[] =>
  stops.map(([s, c]) => [s, hexToRgb(c)] as const);

/** Color interpolado (smoothstep) en la posición `s` de una lista de paradas. */
export const colorAt = (stops: readonly RgbStop[], s: number): RGB => {
  if (s <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    if (s <= stops[i][0]) {
      const t = smooth((s - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]));
      return mixRgb(stops[i - 1][1], stops[i][1], t);
    }
  }
  return stops[stops.length - 1][1];
};

export const luminance = (c: RGB) => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
