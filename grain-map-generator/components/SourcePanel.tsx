
import React, { useRef, useState } from 'react';
import { GrainEffectSettings, bezierPoint } from '../types';
import { BezierCurveEditor } from './BezierCurveEditor';
import { UploadIcon, ArrowsPointingOutIcon, ArrowPathIcon, TrashIcon } from './icons';

interface ImagePreviewWithControlsProps {
    imageUrl: string;
    isGenerating: boolean;
    onEnlarge: () => void;
    onChange: () => void;
    onDelete: () => void;
}

const ImagePreviewWithControls: React.FC<ImagePreviewWithControlsProps> = ({ imageUrl, isGenerating, onEnlarge, onChange, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="relative aspect-video w-full bg-zinc-900 rounded-md overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isGenerating && (
                <div className="absolute inset-0 bg-zinc-800/50 flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <img src={imageUrl} alt="Grain map source" className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
            <div className={`absolute inset-0 bg-black/60 flex items-center justify-center space-x-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <button onClick={onEnlarge} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20" aria-label="Enlarge image"><ArrowsPointingOutIcon className="w-6 h-6" /></button>
                <button onClick={onChange} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20" aria-label="Change image"><ArrowPathIcon className="w-6 h-6" /></button>
                <button onClick={onDelete} className="p-3 bg-white/10 rounded-full text-white hover:bg-red-500/50" aria-label="Delete image"><TrashIcon className="w-6 h-6" /></button>
            </div>
        </div>
    );
}

interface SourcePanelProps {
  onImageUpload: (file: File) => void;
  onImageDelete: () => void;
  settings: GrainEffectSettings;
  onBezierChange: (p1: bezierPoint, p2: bezierPoint) => void;
  onSourceChange: (source: 'upload' | 'scratch') => void;
  grainMapUrl: string | null;
  generatedGrainMap: string | null;
  isGenerating: boolean;
  onShowModal: (url: string) => void;
}

export const SourcePanel: React.FC<SourcePanelProps> = ({ 
    onImageUpload, 
    onImageDelete,
    settings, 
    onBezierChange, 
    onSourceChange,
    grainMapUrl,
    generatedGrainMap,
    isGenerating,
    onShowModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const sourceImageUrl = settings.source === 'upload' ? grainMapUrl : generatedGrainMap;

  return (
    <div className="space-y-4">
      <div className="flex bg-zinc-800 rounded-md p-1">
        <button 
          onClick={() => onSourceChange('scratch')}
          className={`w-1/2 py-2 text-sm font-medium rounded transition-colors ${settings.source === 'scratch' ? 'bg-cyan-500 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
        >
          Create from scratch
        </button>
        <button 
          onClick={() => onSourceChange('upload')}
          className={`w-1/2 py-2 text-sm font-medium rounded transition-colors ${settings.source === 'upload' ? 'bg-cyan-500 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
        >
          Upload Grain Map
        </button>
      </div>

      {settings.source === 'upload' && (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png"
                key={grainMapUrl || ''} // Reset input when file changes
            />
            {grainMapUrl ? (
                <ImagePreviewWithControls 
                    imageUrl={grainMapUrl} 
                    isGenerating={false}
                    onEnlarge={() => onShowModal(grainMapUrl)}
                    onChange={handleUploadClick}
                    onDelete={onImageDelete}
                />
            ) : (
                <button
                    onClick={handleUploadClick}
                    className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-600 rounded-lg hover:border-cyan-400 hover:bg-zinc-700/50 transition-colors"
                >
                    <UploadIcon className="w-8 h-8 mb-2 text-zinc-400"/>
                    <span className="text-sm font-semibold">Click to upload</span>
                    <span className="text-xs text-zinc-500">PNG files only</span>
                </button>
            )}
        </>
      )}

      {settings.source === 'scratch' && (
        <div className="space-y-4 pt-2">
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Gradient Curve</label>
                <BezierCurveEditor p1={settings.gradientP1} p2={settings.gradientP2} onChange={onBezierChange} />
            </div>
            {generatedGrainMap && (
                 <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Generated Map Preview</label>
                    <ImagePreviewWithControls 
                        imageUrl={generatedGrainMap} 
                        isGenerating={isGenerating}
                        onEnlarge={() => onShowModal(generatedGrainMap)}
                        onChange={() => {}} // Cannot change a generated map
                        onDelete={() => {}} // Cannot delete a generated map
                    />
                </div>
            )}
        </div>
      )}
    </div>
  );
};
