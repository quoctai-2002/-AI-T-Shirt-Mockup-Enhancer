
import React from 'react';
import { CheckIcon } from './icons';

interface ColorSelectorProps {
  availableColors: string[];
  selectedColors: string[];
  onColorChange: (color: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

const COLOR_MAP: Record<string, string> = {
  'Black': '#1a1a1a',
  'Pepper': '#424242',
  'White': '#ffffff',
  'Ivory': '#f8f4e7',
  'Yam': '#E07C44',
  'Moss': '#5A6349',
  'Denim': '#6F8FAF',
  'Blue Jean': '#5D83A8',
  'Blossom': '#F9D0E0',
  'Crunchberry': '#F25278',
};

export const ColorSelector: React.FC<ColorSelectorProps> = ({ 
  availableColors, 
  selectedColors, 
  onColorChange,
  onSelectAll,
  onClear
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{selectedColors.length} / {availableColors.length} selected</p>
        <div className="flex items-center gap-2">
          <button onClick={onSelectAll} className="text-xs font-semibold text-orange-400 hover:text-orange-300">Select All</button>
          <span className="text-gray-600">|</span>
          <button onClick={onClear} className="text-xs font-semibold text-gray-400 hover:text-gray-300">Clear</button>
        </div>
      </div>
      <div className="w-full max-h-48 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {availableColors.map((color) => {
          const isSelected = selectedColors.includes(color);
          const bgColor = COLOR_MAP[color] || '#cccccc';
          const isDark = ['Black', 'Pepper', 'Moss', 'Denim', 'Blue Jean'].includes(color);

          return (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-orange-500 ${
                isSelected ? 'ring-2 ring-orange-500 bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div 
                className="w-5 h-5 rounded-sm flex items-center justify-center border border-gray-500"
                style={{ backgroundColor: bgColor }}
              >
                {isSelected && <CheckIcon className={`w-4 h-4 ${isDark ? 'text-white' : 'text-black'}`} />}
              </div>
              <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>{color}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
