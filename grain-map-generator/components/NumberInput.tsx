
import React from 'react';
import { PlusIcon, MinusIcon } from './icons';

interface NumberInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({ id, value, onChange, min = 1, max = 100, step = 1 }) => {
  const handleIncrement = () => {
    onChange(Math.min(max, value + step));
  };

  const handleDecrement = () => {
    onChange(Math.max(min, value - step));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)));
    } else if (e.target.value === '') {
       onChange(min);
    }
  }

  return (
    <div className="flex items-center w-full">
      <button onClick={handleDecrement} className="px-3 py-2 bg-zinc-700 rounded-l-md hover:bg-zinc-600 transition-colors">
        <MinusIcon className="w-4 h-4" />
      </button>
      <input
        id={id}
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="w-full text-center bg-zinc-900 border-y border-zinc-600 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
      />
      <button onClick={handleIncrement} className="px-3 py-2 bg-zinc-700 rounded-r-md hover:bg-zinc-600 transition-colors">
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
