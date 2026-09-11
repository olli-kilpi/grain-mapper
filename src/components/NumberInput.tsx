import { MinusIcon, PlusIcon } from './icons';

interface NumberInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({ id, value, onChange, min = 1, max = 100, step = 1 }: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!Number.isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)));
    } else if (e.target.value === '') {
      onChange(min);
    }
  };

  return (
    <div className="flex w-full items-center">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        className="rounded-l-md bg-zinc-700 px-3 py-2 hover:bg-zinc-600"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <input
        id={id}
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="w-full border-y border-zinc-600 bg-zinc-900 py-2 text-center text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        className="rounded-r-md bg-zinc-700 px-3 py-2 hover:bg-zinc-600"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
