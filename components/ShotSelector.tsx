
import React from 'react';
import { PersonIcon, ShirtIcon } from './icons';

export type ShotType = 'full' | 'close-up';

interface ShotSelectorProps {
  selectedShot: ShotType;
  onShotChange: (shotType: ShotType) => void;
}

const options = [
  { id: 'full', label: 'Full Body', icon: PersonIcon },
  { id: 'close-up', label: 'Close-up', icon: ShirtIcon },
];

export const ShotSelector: React.FC<ShotSelectorProps> = ({ selectedShot, onShotChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => {
        const isSelected = selectedShot === option.id;
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onShotChange(option.id as ShotType)}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-orange-500 ${
              isSelected ? 'ring-2 ring-orange-500 bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <Icon className={`w-8 h-8 ${isSelected ? 'text-orange-400' : 'text-gray-400'}`} />
            <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
