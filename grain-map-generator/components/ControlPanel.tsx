
import React, { useState } from 'react';
import { GrainEffectSettings, bezierPoint } from '../types';
import { SourcePanel } from './SourcePanel';
import { AdjustmentPanel } from './AdjustmentPanel';
import { ExportPanel } from './ExportPanel';
import { ChevronUpIcon, ChevronDownIcon, DnaIcon } from './icons';

interface ControlPanelProps {
  onImageUpload: (file: File) => void;
  onImageDelete: () => void;
  settings: GrainEffectSettings;
  onSettingsChange: <K extends keyof GrainEffectSettings>(key: K, value: GrainEffectSettings[K]) => void;
  onBezierChange: (p1: bezierPoint, p2: bezierPoint) => void;
  onSourceChange: (source: 'upload' | 'scratch') => void;
  grainMapUrl: string | null;
  generatedGrainMap: string | null;
  isGenerating: boolean;
  onShowModal: (url: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const [openSection, setOpenSection] = useState<string>('source');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const sections = [
    { id: 'source', title: '1. Source', component: <SourcePanel {...props} /> },
    { id: 'adjustments', title: '2. Tweak & Modify', component: <AdjustmentPanel {...props} /> },
    { id: 'export', title: '3. Export', component: <ExportPanel {...props} /> },
  ];

  return (
    <div className="flex flex-col h-full text-zinc-300">
      <header className="mb-6 flex items-center space-x-3">
        <DnaIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-2xl font-bold text-white tracking-tight">Grain Map Generator</h1>
      </header>
      <div className="space-y-2 flex-grow">
        {sections.map(({ id, title, component }) => (
          <div key={id} className="bg-zinc-700/50 rounded-lg border border-zinc-600/50">
            <button
              onClick={() => toggleSection(id)}
              className="w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-white"
              aria-expanded={openSection === id}
            >
              <span>{title}</span>
              {openSection === id ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
            </button>
            {openSection === id && (
              <div className="p-4 border-t border-zinc-600/50">
                {component}
              </div>
            )}
          </div>
        ))}
      </div>
      <footer className="text-center text-xs text-zinc-500 mt-4">
        <p>&copy; 2024 V-EFX Tools Inc.</p>
      </footer>
    </div>
  );
};
