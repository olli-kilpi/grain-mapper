
import React from 'react';

interface SliderProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  snaps?: number[];
}

export const Slider: React.FC<SliderProps> = ({ id, value, onChange, min, max, step, snaps }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-zinc-400">{min}</span>
        <span className="text-sm font-bold text-cyan-400 bg-zinc-900 px-2 py-0.5 rounded">{step < 1 ? value.toFixed(2) : value}</span>
        <span className="text-xs text-zinc-400">{max}</span>
      </div>
      <div className="relative h-2">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer z-10 
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:cursor-pointer"
        />
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-900 rounded-full -translate-y-1/2">
          <div className="h-1 bg-cyan-500 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
        {snaps && snaps.map(snap => (
            <div key={snap} className="absolute top-1/2 w-1 h-1 bg-zinc-600 rounded-full -translate-y-1/2 -translate-x-1/2" style={{ left: `${((snap-min)/(max-min))*100}%` }}></div>
        ))}
      </div>
    </div>
  );
};
