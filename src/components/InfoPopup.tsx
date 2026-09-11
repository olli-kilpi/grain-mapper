import { useState } from 'react';
import { InfoIcon } from './icons';

interface InfoPopupProps {
  info: string;
}

export function InfoPopup({ info }: InfoPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className="text-zinc-500 hover:text-cyan-400"
        aria-label="More info"
      >
        <InfoIcon className="h-4 w-4" />
      </button>
      {isOpen && (
        <div
          className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg border border-zinc-600 bg-zinc-900 p-3"
          role="tooltip"
        >
          <p className="text-xs text-zinc-300">{info}</p>
          <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-zinc-900" />
        </div>
      )}
    </div>
  );
}
