
import React, { useState } from 'react';
import { InfoIcon } from './icons';

interface InfoPopupProps {
  info: string;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({ info }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-zinc-500 hover:text-cyan-400"
        aria-label="More info"
      >
        <InfoIcon className="w-4 h-4" />
      </button>
      {isOpen && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-900 border border-zinc-600 rounded-lg shadow-lg z-20"
          role="tooltip"
        >
          <p className="text-xs text-zinc-300">{info}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-zinc-900"></div>
        </div>
      )}
    </div>
  );
};
