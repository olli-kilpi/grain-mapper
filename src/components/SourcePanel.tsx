import { useRef, useState } from 'react';
import { GrainEffectSettings, BezierPoint } from '../types';
import { BezierCurveEditor } from './BezierCurveEditor';
import { UploadIcon, ArrowsPointingOutIcon, ArrowPathIcon, TrashIcon } from './icons';

interface ImagePreviewWithControlsProps {
  imageUrl: string;
  isGenerating: boolean;
  onEnlarge: () => void;
  onChange?: () => void;
  onDelete?: () => void;
}

function ImagePreviewWithControls({
  imageUrl,
  isGenerating,
  onEnlarge,
  onChange,
  onDelete,
}: ImagePreviewWithControlsProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative aspect-video w-full overflow-hidden rounded-md bg-zinc-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isGenerating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-800/50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
        </div>
      )}
      <img
        src={imageUrl}
        alt="Grain map source"
        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
      <div
        className={`absolute inset-0 flex items-center justify-center space-x-4 bg-black/60 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button onClick={onEnlarge} className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Enlarge image">
          <ArrowsPointingOutIcon className="h-6 w-6" />
        </button>
        {onChange && (
          <button onClick={onChange} className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Change image">
            <ArrowPathIcon className="h-6 w-6" />
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="rounded-full bg-white/10 p-3 text-white hover:bg-red-500/50" aria-label="Delete image">
            <TrashIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}

interface SourcePanelProps {
  onImageUpload: (file: File) => void;
  onImageDelete: () => void;
  settings: GrainEffectSettings;
  onBezierChange: (p1: BezierPoint, p2: BezierPoint) => void;
  onSourceChange: (source: 'upload' | 'scratch') => void;
  grainMapUrl: string | null;
  generatedGrainMap: string | null;
  isGenerating: boolean;
  onShowModal: (url: string) => void;
}

export function SourcePanel({
  onImageUpload,
  onImageDelete,
  settings,
  onBezierChange,
  onSourceChange,
  grainMapUrl,
  generatedGrainMap,
  isGenerating,
  onShowModal,
}: SourcePanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex rounded-md bg-zinc-800 p-1">
        <button
          onClick={() => onSourceChange('scratch')}
          className={`w-1/2 rounded py-2 text-sm font-medium transition-colors ${
            settings.source === 'scratch' ? 'bg-cyan-500 text-white' : 'text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          Create from scratch
        </button>
        <button
          onClick={() => onSourceChange('upload')}
          className={`w-1/2 rounded py-2 text-sm font-medium transition-colors ${
            settings.source === 'upload' ? 'bg-cyan-500 text-white' : 'text-zinc-300 hover:bg-zinc-700'
          }`}
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
            accept="image/png,image/jpeg,image/webp"
            key={grainMapUrl || ''}
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
              className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-600 p-6 hover:border-cyan-400 hover:bg-zinc-700/50"
            >
              <UploadIcon className="mb-2 h-8 w-8 text-zinc-400" />
              <span className="text-sm font-semibold">Click to upload</span>
              <span className="text-xs text-zinc-500">PNG, JPEG, or WebP</span>
            </button>
          )}
        </>
      )}

      {settings.source === 'scratch' && (
        <div className="space-y-4 pt-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Gradient Curve</label>
            <BezierCurveEditor p1={settings.gradientP1} p2={settings.gradientP2} onChange={onBezierChange} />
          </div>
          {generatedGrainMap && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Generated Map Preview</label>
              <ImagePreviewWithControls
                imageUrl={generatedGrainMap}
                isGenerating={isGenerating}
                onEnlarge={() => onShowModal(generatedGrainMap)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
