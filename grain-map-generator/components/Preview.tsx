
import React, { useRef, useEffect } from 'react';
import { GrainEffectSettings } from '../types';

interface PreviewProps {
  grainMapImage: HTMLImageElement | null;
  settings: GrainEffectSettings;
  previewWithBg: boolean;
  onTogglePreviewBg: () => void;
  onSettingsChange: <K extends keyof GrainEffectSettings>(key: K, value: GrainEffectSettings[K]) => void;
}

export const Preview: React.FC<PreviewProps> = ({ grainMapImage, settings, previewWithBg, onTogglePreviewBg, onSettingsChange }) => {
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    outputCanvasRef.current = document.getElementById('grain-output-canvas') as HTMLCanvasElement;
    const outputCtx = outputCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    
    if (!outputCtx ) return;
    
    if (!grainMapImage) {
      outputCtx.canvas.width = 512;
      outputCtx.canvas.height = 512;
      outputCtx.clearRect(0,0, outputCtx.canvas.width, outputCtx.canvas.height);
      return;
    }

    const { width, height } = grainMapImage;
    outputCanvasRef.current.width = width;
    outputCanvasRef.current.height = height;

    const grainMapCanvas = document.createElement('canvas');
    grainMapCanvas.width = width;
    grainMapCanvas.height = height;
    const mapCtx = grainMapCanvas.getContext('2d', { willReadFrequently: true });
    
    if (!mapCtx) return;

    mapCtx.drawImage(grainMapImage, 0, 0);
    const mapImageData = mapCtx.getImageData(0, 0, width, height);
    const mapData = mapImageData.data;

    outputCtx.clearRect(0, 0, width, height);
    outputCtx.fillStyle = 'black';

    const { grainSize, threshold, jitter, whiteAsMax } = settings;

    for (let y = 0; y < height; y += grainSize) {
      for (let x = 0; x < width; x += grainSize) {
        const i = (y * width + x) * 4;
        const r = mapData[i];
        const g = mapData[i + 1];
        const b = mapData[i + 2];
        let rawGrayscale = (r + g + b) / 3;

        // "whiteAsMax" acts as the "invertMap" toggle.
        // By default (false), black (0) should produce max grain.
        // The formula needs a low grayValue for high probability, so we use the raw value.
        // If inverted (true), white should produce max grain, so we flip the value.
        let grayValue = whiteAsMax ? (255 - rawGrayscale) : rawGrayscale;

        const jitterOffset = (Math.random() - 0.5) * jitter;

        if (Math.random() * 255 > grayValue - threshold + jitterOffset) {
          outputCtx.fillRect(x, y, grainSize, grainSize);
        }
      }
    }
  }, [grainMapImage, settings]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
       <style>{`.bg-grid-pattern { background-image: linear-gradient(45deg, #3f3f46 25%, transparent 25%), linear-gradient(-45deg, #3f3f46 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #3f3f46 75%), linear-gradient(-45deg, transparent 75%, #3f3f46 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px; }`}</style>
      <div className={`w-full h-full flex items-center justify-center rounded-lg transition-colors ${previewWithBg ? 'bg-white' : 'bg-grid-pattern'}`}>
         <canvas id="grain-output-canvas" style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}></canvas>
      </div>
       <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-3">
          <label htmlFor="preview-bg-toggle" className="text-sm font-medium text-zinc-400">
            White BG
          </label>
          <button
            onClick={onTogglePreviewBg}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-cyan-500 ${previewWithBg ? 'bg-cyan-500' : 'bg-zinc-600'}`}
            id="preview-bg-toggle"
            role="switch"
            aria-checked={previewWithBg}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${previewWithBg ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <label htmlFor="invert-map-toggle" className="text-sm font-medium text-zinc-400">
            White = Max Grain
          </label>
          <button
            onClick={() => onSettingsChange('whiteAsMax', !settings.whiteAsMax)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-cyan-500 ${settings.whiteAsMax ? 'bg-cyan-500' : 'bg-zinc-600'}`}
            id="invert-map-toggle"
            role="switch"
            aria-checked={settings.whiteAsMax}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.whiteAsMax ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
       </div>
    </div>
  );
};