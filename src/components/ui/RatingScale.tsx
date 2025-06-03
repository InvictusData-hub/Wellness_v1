import React from 'react';

interface RatingScaleProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  className?: string;
}

const RatingScale: React.FC<RatingScaleProps> = ({
  value,
  onChange,
  label,
  min = 1,
  max = 10,
  className = ''
}) => {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  
  return (
    <div className={`mb-6 ${className}`}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} ({value})
      </label>
      
      <div className="flex items-center mb-2">
        <span className="text-xs text-gray-500 w-6">Low</span>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-xs text-gray-500 w-6 text-right">High</span>
      </div>
      
      <div className="flex justify-between px-1">
        {options.map((num) => (
          <div 
            key={num}
            className={`
              flex flex-col items-center cursor-pointer transition-all
              ${num === value ? 'scale-110' : 'opacity-60'}
            `}
            onClick={() => onChange(num)}
          >
            <div 
              className={`
                w-4 h-4 rounded-full mb-1
                ${num === value ? 'bg-blue-600' : 'bg-gray-300'}
              `}
            />
            <span className="text-xs">{num}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingScale;