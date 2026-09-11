import { RefObject, useEffect } from 'react';
import { readImageData, renderGrain, sourceSize } from '../lib/renderGrain';

interface PreviewProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  grainMapImage: HTMLImageElement | HTMLCanvasElement | null;
  grainSize: number;
  threshold: number;
  jitter: number;
  seed: number;
  whiteAsMax: boolean;
  previewWithBg: boolean;
  onTogglePreviewBg: () => void;
  onWhiteAsMaxChange: (value: boolean) => void;
}

export function Preview({
  canvasRef,
  grainMapImage,
  grainSize,
  threshold,
  jitter,
  seed,
  whiteAsMax,
  previewWithBg,
  onTogglePreviewBg,
  onWhiteAsMaxChange,
}: PreviewProps) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (!grainMapImage) {
      canvas.width = 512;
      canvas.height = 512;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const { width, height } = sourceSize(grainMapImage);
    canvas.width = width;
    canvas.height = height;
    const map = readImageData(grainMapImage, width, height);
    const output = renderGrain(map.data, width, height, {
      grainSize,
      threshold,
      jitter,
      whiteAsMax,
      seed,
    });
    ctx.putImageData(output, 0, 0);
  }, [canvasRef, grainMapImage, grainSize, threshold, jitter, seed, whiteAsMax]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4 md:p-8">
      <div
        className={`flex h-full w-full items-center justify-center rounded-lg transition-colors ${
          previewWithBg ? 'bg-white' : 'bg-grid-pattern'
        }`}
      >
        <canvas ref={canvasRef} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-3">
          <label htmlFor="preview-bg-toggle" className="text-sm font-medium text-zinc-400">
            White BG
          </label>
          <button
            onClick={onTogglePreviewBg}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:outline-none ${
              previewWithBg ? 'bg-cyan-500' : 'bg-zinc-600'
            }`}
            id="preview-bg-toggle"
            role="switch"
            aria-checked={previewWithBg}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                previewWithBg ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <label htmlFor="invert-map-toggle" className="text-sm font-medium text-zinc-400">
            White = Max Grain
          </label>
          <button
            onClick={() => onWhiteAsMaxChange(!whiteAsMax)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:outline-none ${
              whiteAsMax ? 'bg-cyan-500' : 'bg-zinc-600'
            }`}
            id="invert-map-toggle"
            role="switch"
            aria-checked={whiteAsMax}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                whiteAsMax ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
