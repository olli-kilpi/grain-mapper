import { GrainEffectSettings } from '../types';
import { DownloadIcon } from './icons';

interface ExportPanelProps {
  settings: GrainEffectSettings;
  onSettingsChange: <K extends keyof GrainEffectSettings>(key: K, value: GrainEffectSettings[K]) => void;
  onDownload: () => void;
}

export function ExportPanel({ settings, onSettingsChange, onDownload }: ExportPanelProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="fileName" className="block text-sm font-medium text-zinc-300">
          File Name
        </label>
        <input
          type="text"
          id="fileName"
          value={settings.fileName}
          onChange={(e) => onSettingsChange('fileName', e.target.value)}
          className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-white focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="scale" className="block text-sm font-medium text-zinc-300">
          Scale
        </label>
        <input
          type="number"
          id="scale"
          value={settings.scale}
          onChange={(e) => {
            const next = parseFloat(e.target.value);
            onSettingsChange('scale', Number.isFinite(next) ? next : 1);
          }}
          min="0.1"
          step="0.1"
          className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-white focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="addBackground" className="text-sm font-medium text-zinc-300">
          Include White BG
        </label>
        <button
          onClick={() => onSettingsChange('addBackground', !settings.addBackground)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.addBackground ? 'bg-cyan-500' : 'bg-zinc-600'
          }`}
          id="addBackground"
          role="switch"
          aria-checked={settings.addBackground}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.addBackground ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <button
        onClick={onDownload}
        className="flex w-full items-center justify-center rounded-md bg-cyan-500 px-4 py-3 font-bold text-white hover:bg-cyan-600"
      >
        <DownloadIcon className="mr-2 h-5 w-5" />
        Download Image
      </button>
    </div>
  );
}
