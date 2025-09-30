
import React, { useState, useCallback, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { Preview } from './components/Preview';
import { GrainEffectSettings, bezierPoint } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { XMarkIcon } from './components/icons';

const App: React.FC = () => {
  const [grainMap, setGrainMap] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<GrainEffectSettings>(DEFAULT_SETTINGS);
  const [grainMapUrl, setGrainMapUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGrainMap, setGeneratedGrainMap] = useState<string | null>(null);
  const [previewWithBg, setPreviewWithBg] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  
  const handleSettingsChange = useCallback(<K extends keyof GrainEffectSettings>(key: K, value: GrainEffectSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleBezierChange = useCallback((p1: bezierPoint, p2: bezierPoint) => {
    setSettings(prev => ({ ...prev, gradientP1: p1, gradientP2: p2 }));
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setGrainMap(img);
        setSettings(prev => ({...prev, source: 'upload'}));
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
    // When deleting, ensure we are in upload mode, ready for a new file.
    setSettings(prev => ({...prev, source: 'upload'}));
  }, []);
  
  const handleSourceChange = (source: 'upload' | 'scratch') => {
    setSettings(prev => ({...prev, source}));
    if (source === 'scratch' && !generatedGrainMap) {
        setGrainMap(null);
        setGrainMapUrl(null);
    }
  }

  useEffect(() => {
    if (settings.source === 'scratch') {
      setIsGenerating(true);
      const timeoutId = setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, 512, 512);

          const gradient = ctx.createLinearGradient(0, 0, 512, 0);
          
          const p0 = {x:0, y:1};
          const p3 = {x:1, y:0};

          for (let t = 0; t <= 1; t += 0.01) {
              const x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * settings.gradientP1.x + 3 * (1 - t) * t * t * settings.gradientP2.x + t * t * t * p3.x;
              const y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * settings.gradientP1.y + 3 * (1 - t) * t * t * settings.gradientP2.y + t * t * t * p3.y;
              
              const gray = Math.floor(y * 255 * settings.gradientDarkness);
              gradient.addColorStop(x, `rgb(${gray},${gray},${gray})`);
          }
          
          ctx.save();
          ctx.translate(256, 256);
          ctx.rotate(settings.gradientRotation * Math.PI / 180);
          ctx.translate(-256, -256);

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 512, 512);
          ctx.restore();

          const dataUrl = canvas.toDataURL();
          setGeneratedGrainMap(dataUrl);
          
          const img = new Image();
          img.onload = () => {
            setGrainMap(img);
            setIsGenerating(false);
          };
          img.src = dataUrl;
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [settings.source, settings.gradientP1, settings.gradientP2, settings.gradientRotation, settings.gradientDarkness]);

  return (
    <>
      <div className="flex h-screen w-screen bg-zinc-950 text-zinc-200 font-sans">
        <main className="flex-1 overflow-auto bg-zinc-900 flex items-center justify-center relative">
          <Preview 
            grainMapImage={grainMap} 
            settings={settings}
            previewWithBg={previewWithBg}
            onTogglePreviewBg={() => setPreviewWithBg(p => !p)}
            onSettingsChange={handleSettingsChange}
          />
        </main>
        <aside className="w-[320px] md:w-[400px] bg-zinc-800 p-6 overflow-y-auto flex-shrink-0 shadow-2xl border-l border-zinc-700">
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
          />
        </aside>
      </div>
      {modalImageUrl && (
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 animate-fade-in"
            onClick={() => setModalImageUrl(null)}
        >
            <style>{`@keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } } .animate-fade-in { animation: fade-in 0.2s ease-out; }`}</style>
            <img 
                src={modalImageUrl} 
                alt="Enlarged grain map" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />
            <button 
                aria-label="Close image viewer"
                onClick={() => setModalImageUrl(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
                <XMarkIcon className="w-10 h-10" />
            </button>
        </div>
      )}
    </>
  );
};

export default App;
