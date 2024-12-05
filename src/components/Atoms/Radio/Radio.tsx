import React from 'react';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  options: RadioOption[];
  hasError?: boolean;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ options, hasError, className, name, value, onChange, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2">
            <input
              ref={ref}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className={`w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500
                ${hasError ? 'border-red-500' : 'border-gray-300'}
                ${className}`
              }
              {...props}
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    );
  }
); 