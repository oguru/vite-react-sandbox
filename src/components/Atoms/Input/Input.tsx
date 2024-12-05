import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ hasError, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3 py-2 border rounded-md outline-none
          ${hasError 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:border-blue-500'
          }
          ${className}`
        }
        {...props}
      />
    );
  }
); 