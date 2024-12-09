import React from 'react';

interface FieldWrapperProps {
  label?: string;
  error?: string;
  id?: string;
  children: React.ReactNode;
}

export const FieldWrapper = ({ label, error, id, children }: FieldWrapperProps) => {
  return (
    <div className="mb-4 flex flex-col">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p style={{ color: 'red' }} className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};