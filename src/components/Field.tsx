import * as yup from 'yup';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface FieldProps {
  name: string;
  schema: any;
  register: UseFormRegister<any>;
  label: string;
  error?: string;
}

export const getInputType = (schema: any) => {
  if (schema instanceof yup.StringSchema) {
    const { datetime, date } = schema.spec.meta || {};
    return datetime ? 'datetime-local' : date ? 'date' : 'text';
  }
  if (schema instanceof yup.NumberSchema) return 'number';
  if (schema instanceof yup.BooleanSchema) return 'checkbox';
  if (schema instanceof yup.DateSchema) {
    return schema.spec.meta?.datetime ? 'datetime-local' : 'date';
  }
  return 'text';
};

export const Field = ({ name, schema, register, label, error }: FieldProps) => {
  const type = getInputType(schema);
  const registerOptions = {
    valueAsNumber: type === 'number'
  };

  return (
    <div className="mb-4 flex flex-col">
      <label 
        htmlFor={name}
        className="block text-sm font-medium mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        className={`
          w-full px-3 py-2 border rounded-md outline-none
          ${error 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:border-blue-500'
          }
        `}
        {...register(name, registerOptions)}
      />
      {error && (
        <p style={{color: 'red'}} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}; 