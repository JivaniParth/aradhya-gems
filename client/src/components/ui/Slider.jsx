import React from 'react';
import { cn } from '../../lib/utils';

const Slider = ({ 
  min = 0, 
  max = 100, 
  value = [min, max], 
  onChange, 
  step = 1,
  formatValue = (v) => v,
  className 
}) => {
  const [minVal, maxVal] = value;
  
  const minPos = ((minVal - min) / (max - min)) * 100;
  const maxPos = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-2 bg-gray-200 rounded-full">
        {/* Active track */}
        <div
          className="absolute h-full bg-primary rounded-full"
          style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
        />
        
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={(e) => {
            const newMin = Math.min(Number(e.target.value), maxVal - step);
            onChange([newMin, maxVal]);
          }}
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
        />
        
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={(e) => {
            const newMax = Math.max(Number(e.target.value), minVal + step);
            onChange([minVal, newMax]);
          }}
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
      
      {/* Value labels */}
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>{formatValue(minVal)}</span>
        <span>{formatValue(maxVal)}</span>
      </div>
    </div>
  );
};

export { Slider };
