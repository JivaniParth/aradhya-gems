import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef(({ className, label, checked, onChange, ...props }, ref) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            'h-4 w-4 rounded border border-gray-300 bg-white transition-colors',
            'peer-focus:ring-2 peer-focus:ring-primary/20',
            'peer-checked:bg-primary peer-checked:border-primary',
            'group-hover:border-primary/50',
            className
          )}
        >
          <Check 
            className={cn(
              'h-3 w-3 text-white absolute top-0.5 left-0.5 transition-opacity',
              checked ? 'opacity-100' : 'opacity-0'
            )} 
          />
        </div>
      </div>
      {label && (
        <span className="text-sm text-gray-700">{label}</span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
