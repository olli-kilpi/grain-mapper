
import React from 'react';
import { GrainEffectSettings } from '../types';
import { DownloadIcon } from './icons';

interface ExportPanelProps {
  settings: GrainEffectSettings;
  onSettingsChange: <K extends keyof GrainEffectSettings>(key: K, value: GrainEffectSettings[K]) => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ settings, onSettingsChange }) => {

  const handleDownload = () => {
    const canvas = document.getElementById('grain-output-canvas') as HTMLCanvasElement;
    if (canvas) {
      const finalCanvas = document.createElement('canvas');
      const scale = settings.scale || 1;
      finalCanvas.width = canvas.width * scale;
      finalCanvas.height = canvas.height * scale;
      const ctx = finalCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false; // Keep pixels sharp
        if (settings.addBackground) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        }
        ctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);
        
        const link = document.createElement('a');
        link.download = settings.fileName.endsWith('.png') ? settings.fileName : `${settings.fileName}.png`;
        link.href = finalCanvas.toDataURL('image/png');
        link.click();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="fileName" className="block text-sm font-medium text-zinc-300">File Name</label>
        <input
          type="text"
          id="fileName"
          value={settings.fileName}
          onChange={(e) => onSettingsChange('fileName', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="scale" className="block text-sm font-medium text-zinc-300">Scale</label>
        <input
          type="number"
          id="scale"
          value={settings.scale}
          onChange={(e) => onSettingsChange('scale', parseFloat(e.target.value))}
          min="0.1"
          step="0.1"
          className="w-full bg-zinc-900 border border-zinc-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="addBackground" className="text-sm font-medium text-zinc-300">Include White BG</label>
        <button
          onClick={() => onSettingsChange('addBackground', !settings.addBackground)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.addBackground ? 'bg-cyan-500' : 'bg-zinc-600'}`}
          id="addBackground"
          role="switch"
          aria-checked={settings.addBackground}
        >
          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.addBackground ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <button
        onClick={handleDownload}
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center transition-colors"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        Download Image
      </button>
    </div>
  );
};
