export type GrainRenderParams = {
  grainSize: number;
  threshold: number;
  jitter: number;
  whiteAsMax: boolean;
  seed: number;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function renderGrain(
  map: Uint8ClampedArray,
  width: number,
  height: number,
  params: GrainRenderParams,
): ImageData {
  const size = Math.max(1, Math.floor(params.grainSize) || 1);
  const random = mulberry32(params.seed);
  const out = new ImageData(width, height);
  const dst = out.data;
  const { threshold, jitter, whiteAsMax } = params;

  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      const i = (y * width + x) * 4;
      const rawGrayscale = (map[i] + map[i + 1] + map[i + 2]) / 3;
      const grayValue = whiteAsMax ? 255 - rawGrayscale : rawGrayscale;
      const jitterOffset = (random() - 0.5) * jitter;

      if (random() * 255 > grayValue - threshold + jitterOffset) {
        const yEnd = Math.min(y + size, height);
        const xEnd = Math.min(x + size, width);
        for (let py = y; py < yEnd; py++) {
          let idx = (py * width + x) * 4;
          for (let px = x; px < xEnd; px++) {
            dst[idx] = 0;
            dst[idx + 1] = 0;
            dst[idx + 2] = 0;
            dst[idx + 3] = 255;
            idx += 4;
          }
        }
      }
    }
  }

  return out;
}

export function readImageData(source: CanvasImageSource, width: number, height: number): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return new ImageData(width, height);
  }
  ctx.drawImage(source, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

export function sourceSize(source: CanvasImageSource): { width: number; height: number } {
  if (source instanceof HTMLImageElement) {
    return {
      width: source.naturalWidth || source.width,
      height: source.naturalHeight || source.height,
    };
  }
  if (source instanceof HTMLCanvasElement) {
    return { width: source.width, height: source.height };
  }
  if (source instanceof ImageBitmap) {
    return { width: source.width, height: source.height };
  }
  if (source instanceof OffscreenCanvas) {
    return { width: source.width, height: source.height };
  }
  return { width: 512, height: 512 };
}
