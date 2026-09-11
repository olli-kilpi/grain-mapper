interface SliderProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  snaps?: number[];
}

export function Slider({ id, value, onChange, min, max, step, snaps }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-zinc-400">{min}</span>
        <span className="rounded bg-zinc-900 px-2 py-0.5 text-sm font-bold text-cyan-400">
          {step < 1 ? value.toFixed(2) : value}
        </span>
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
          className="absolute z-10 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
        />
        <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 rounded-full bg-zinc-900">
          <div className="h-1 rounded-full bg-cyan-500" style={{ width: `${percentage}%` }} />
        </div>
        {snaps?.map((snap) => (
          <div
            key={snap}
            className="absolute top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-600"
            style={{ left: `${((snap - min) / (max - min)) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
