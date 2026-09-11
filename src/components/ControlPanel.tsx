import { useState } from 'react';
import { GrainEffectSettings, BezierPoint } from '../types';
import { SourcePanel } from './SourcePanel';
import { AdjustmentPanel } from './AdjustmentPanel';
import { ExportPanel } from './ExportPanel';
import { ChevronUpIcon, ChevronDownIcon, DnaIcon } from './icons';

interface ControlPanelProps {
  onImageUpload: (file: File) => void;
  onImageDelete: () => void;
  settings: GrainEffectSettings;
  onSettingsChange: <K extends keyof GrainEffectSettings>(key: K, value: GrainEffectSettings[K]) => void;
  onBezierChange: (p1: BezierPoint, p2: BezierPoint) => void;
  onSourceChange: (source: 'upload' | 'scratch') => void;
  grainMapUrl: string | null;
  generatedGrainMap: string | null;
  isGenerating: boolean;
  onShowModal: (url: string) => void;
  onDownload: () => void;
}

export function ControlPanel(props: ControlPanelProps) {
  const [openSection, setOpenSection] = useState('source');

  const sections = [
    {
      id: 'source',
      title: '1. Source',
      component: (
        <SourcePanel
          onImageUpload={props.onImageUpload}
          onImageDelete={props.onImageDelete}
          settings={props.settings}
          onBezierChange={props.onBezierChange}
          onSourceChange={props.onSourceChange}
          grainMapUrl={props.grainMapUrl}
          generatedGrainMap={props.generatedGrainMap}
          isGenerating={props.isGenerating}
          onShowModal={props.onShowModal}
        />
      ),
    },
    {
      id: 'adjustments',
      title: '2. Tweak & Modify',
      component: <AdjustmentPanel settings={props.settings} onSettingsChange={props.onSettingsChange} />,
    },
    {
      id: 'export',
      title: '3. Export',
      component: (
        <ExportPanel
          settings={props.settings}
          onSettingsChange={props.onSettingsChange}
          onDownload={props.onDownload}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col text-zinc-300">
      <header className="mb-6 flex items-center space-x-3">
        <DnaIcon className="h-8 w-8 text-cyan-400" />
        <h1 className="text-2xl font-bold tracking-tight text-white">Grain Mapper</h1>
      </header>
      <div className="flex-grow space-y-2">
        {sections.map(({ id, title, component }) => (
          <div key={id} className="rounded-lg border border-zinc-600/50 bg-zinc-700/50">
            <button
              onClick={() => setOpenSection(openSection === id ? '' : id)}
              className="flex w-full items-center justify-between p-4 text-left text-lg font-semibold text-white"
              aria-expanded={openSection === id}
            >
              <span>{title}</span>
              {openSection === id ? <ChevronUpIcon className="h-6 w-6" /> : <ChevronDownIcon className="h-6 w-6" />}
            </button>
            {openSection === id && <div className="border-t border-zinc-600/50 p-4">{component}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
