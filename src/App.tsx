import { useCallback, useEffect, useRef, useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { Preview } from './components/Preview';
import { GrainEffectSettings, BezierPoint } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { XMarkIcon } from './components/icons';
import { generateGradientMap } from './lib/generateGradientMap';
import { exportPng } from './lib/exportPng';

export default function App() {
  const [grainMap, setGrainMap] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);
  const [settings, setSettings] = useState<GrainEffectSettings>(DEFAULT_SETTINGS);
  const [grainMapUrl, setGrainMapUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGrainMap, setGeneratedGrainMap] = useState<string | null>(null);
  const [previewWithBg, setPreviewWithBg] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleSettingsChange = useCallback(<K extends keyof GrainEffectSettings>(key: K, value: GrainEffectSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleBezierChange = useCallback((p1: BezierPoint, p2: BezierPoint) => {
    setSettings((prev) => ({ ...prev, gradientP1: p1, gradientP2: p2 }));
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setGrainMap(img);
        setSettings((prev) => ({ ...prev, source: 'upload' }));
      };
      img.src = url;
      setGrainMapUrl(url);
    };
    reader.readAsDataURL(file);
    setGeneratedGrainMap(null);
  };

  const handleImageDelete = useCallback(() => {
    setGrainMap(null);
    setGrainMapUrl(null);
    setSettings((prev) => ({ ...prev, source: 'upload' }));
  }, []);

  const handleSourceChange = (source: 'upload' | 'scratch') => {
    setSettings((prev) => ({ ...prev, source }));
    if (source === 'scratch' && !generatedGrainMap) {
      setGrainMap(null);
      setGrainMapUrl(null);
    }
  };

  const handleDownload = useCallback(() => {
    const canvas = outputCanvasRef.current;
    if (!canvas) return;
    exportPng(canvas, {
      fileName: settings.fileName,
      scale: settings.scale,
      addBackground: settings.addBackground,
    });
  }, [settings.fileName, settings.scale, settings.addBackground]);

  useEffect(() => {
    if (settings.source !== 'scratch') return;

    setIsGenerating(true);
    const timeoutId = window.setTimeout(() => {
      const canvas = generateGradientMap({
        p1: settings.gradientP1,
        p2: settings.gradientP2,
        rotation: settings.gradientRotation,
        darkness: settings.gradientDarkness,
      });
      const dataUrl = canvas.toDataURL();
      setGeneratedGrainMap(dataUrl);
      setGrainMap(canvas);
      setIsGenerating(false);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [
    settings.source,
    settings.gradientP1,
    settings.gradientP2,
    settings.gradientRotation,
    settings.gradientDarkness,
  ]);

  return (
    <>
      <div className="flex h-screen w-screen bg-zinc-950 text-zinc-200">
        <main className="relative flex flex-1 items-center justify-center overflow-auto bg-zinc-900">
          <Preview
            canvasRef={outputCanvasRef}
            grainMapImage={grainMap}
            grainSize={settings.grainSize}
            threshold={settings.threshold}
            jitter={settings.jitter}
            seed={settings.seed}
            whiteAsMax={settings.whiteAsMax}
            previewWithBg={previewWithBg}
            onTogglePreviewBg={() => setPreviewWithBg((p) => !p)}
            onWhiteAsMaxChange={(value) => handleSettingsChange('whiteAsMax', value)}
          />
        </main>
        <aside className="w-[320px] flex-shrink-0 overflow-y-auto border-l border-zinc-700 bg-zinc-800 p-6 shadow-2xl md:w-[400px]">
          <ControlPanel
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onBezierChange={handleBezierChange}
            onSourceChange={handleSourceChange}
            grainMapUrl={grainMapUrl}
            generatedGrainMap={generatedGrainMap}
            isGenerating={isGenerating}
            onShowModal={setModalImageUrl}
            onDownload={handleDownload}
          />
        </aside>
      </div>
      {modalImageUrl && (
        <div
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8"
          onClick={() => setModalImageUrl(null)}
        >
          <img
            src={modalImageUrl}
            alt="Enlarged grain map"
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            aria-label="Close image viewer"
            onClick={() => setModalImageUrl(null)}
            className="absolute top-4 right-4 text-zinc-400 transition-colors hover:text-white"
          >
            <XMarkIcon className="h-10 w-10" />
          </button>
        </div>
      )}
    </>
  );
}
