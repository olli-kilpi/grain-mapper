import { BezierPoint } from '../types';

function cubic(t: number, p0: number, p1: number, p2: number, p3: number) {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

export function generateGradientMap(options: {
  width?: number;
  height?: number;
  p1: BezierPoint;
  p2: BezierPoint;
  rotation: number;
  darkness: number;
}): HTMLCanvasElement {
  const width = options.width ?? 512;
  const height = options.height ?? 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  const stops: Array<{ offset: number; color: string }> = [];

  for (let t = 0; t <= 1; t += 0.01) {
    const x = cubic(t, 0, options.p1.x, options.p2.x, 1);
    const y = cubic(t, 1, options.p1.y, options.p2.y, 0);
    const gray = Math.max(0, Math.min(255, Math.floor(y * 255 * options.darkness)));
    stops.push({
      offset: Math.max(0, Math.min(1, x)),
      color: `rgb(${gray}, ${gray}, ${gray})`,
    });
  }

  stops.sort((a, b) => a.offset - b.offset);
  if (stops.length === 0 || stops[0].offset > 0) {
    stops.unshift({ offset: 0, color: 'rgb(255, 255, 255)' });
  }
  if (stops[stops.length - 1].offset < 1) {
    stops.push({ offset: 1, color: 'rgb(0, 0, 0)' });
  }

  let last = -1;
  for (const stop of stops) {
    if (stop.offset === last) continue;
    gradient.addColorStop(stop.offset, stop.color);
    last = stop.offset;
  }

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((options.rotation * Math.PI) / 180);
  ctx.translate(-width / 2, -height / 2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  return canvas;
}
