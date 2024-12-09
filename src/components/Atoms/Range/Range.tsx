import React from 'react';

interface RangeProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  hasError?: boolean;
  step?: number;
  schema?: any;
}

export const Range = React.forwardRef<HTMLInputElement, RangeProps>(
  ({ hasError, className, step = 1, value, min, max, ...props }, ref) => {

    return (
      <div className="flex items-center gap-4">
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
            ${hasError ? 'accent-red-500' : 'accent-blue-500'}
            ${className}`
          }
          {...props}
        />
        <span className="min-w-[3rem] text-sm text-gray-500">
          {value}
        </span>
      </div>
    );
  }
); 