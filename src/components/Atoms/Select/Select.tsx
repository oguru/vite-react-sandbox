import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  hasError?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className, placeholder = 'Select...', hasError, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full px-3 py-2 border rounded-md outline-none
          ${hasError 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:border-blue-500'
          }
          ${className}`
        }
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  }
); 