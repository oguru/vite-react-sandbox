import { FieldOption } from '../../../utils/schemaHelpers';
import React from 'react';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  options: FieldOption[];
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