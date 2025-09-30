
import React from 'react';
import { GrainEffectSettings } from '../types';
import { NumberInput } from './NumberInput';
import { Slider } from './Slider';
import { InfoPopup } from './InfoPopup';

interface AdjustmentPanelProps {
  settings: GrainEffectSettings;
  onSettingsChange: <K extends keyof GrainEffectSettings>(key: K, value: GrainEffectSettings[K]) => void;
}

export const AdjustmentPanel: React.FC<AdjustmentPanelProps> = ({ settings, onSettingsChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
            <label htmlFor="grainSize" className="block text-sm font-medium text-zinc-300">Grain Size</label>
            <InfoPopup info="Sets the size of each grain particle in pixels (px). A size of 1 means each grain is a single pixel." />
        </div>
        <NumberInput id="grainSize" value={settings.grainSize} onChange={(val) => onSettingsChange('grainSize', val)} min={1} max={32} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
            <label htmlFor="threshold" className="block text-sm font-medium text-zinc-300">Threshold</label>
             <InfoPopup info="Controls the overall grain amount. Higher values result in more grain being placed." />
        </div>
        <Slider id="threshold" value={settings.threshold} onChange={(val) => onSettingsChange('threshold', val)} min={-255} max={255} step={1} snaps={[0]} />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
            <label htmlFor="jitter" className="block text-sm font-medium text-zinc-300">Jitter</label>
             <InfoPopup info="Adds randomness to the grain placement, creating a more organic, less uniform look." />
        </div>
        <Slider id="jitter" value={settings.jitter} onChange={(val) => onSettingsChange('jitter', val)} min={0} max={255} step={1} snaps={[0, 64, 128, 192, 255]} />
      </div>

      {settings.source === 'scratch' && (
        <>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="gradientRotation" className="block text-sm font-medium text-zinc-300">Gradient Rotation</label>
              <InfoPopup info="Rotates the generated gradient from 0 to 360 degrees. This allows for directional grain effects." />
            </div>
            <Slider id="gradientRotation" value={settings.gradientRotation} onChange={(val) => onSettingsChange('gradientRotation', val)} min={0} max={360} step={1} snaps={[0, 45, 90, 135, 180, 225, 270, 315, 360]} />
          </div>
           <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="gradientDarkness" className="block text-sm font-medium text-zinc-300">Gradient Intensity</label>
              <InfoPopup info="Adjusts the maximum intensity of the generated gradient. At 1.0, the darkest part is pure black. Lowering this value makes the gradient lighter overall, reducing the maximum possible grain effect." />
            </div>
            <Slider id="gradientDarkness" value={settings.gradientDarkness} onChange={(val) => onSettingsChange('gradientDarkness', val)} min={0} max={1} step={0.01} snaps={[0.25, 0.5, 0.75]} />
          </div>
        </>
      )}
    </div>
  );
};