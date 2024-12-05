import * as yup from 'yup';

import { Control, Controller } from 'react-hook-form';

import { FormField } from '../../Atoms/FormField/FormField';
import React from 'react';

interface FieldProps {
  name: string;
  schema: any;
  control: Control<any>;
  label: string;
  error?: string;
}

export const getInputType = (schema: any) => {
  const meta = schema.spec?.meta || {};
  
  if (meta.type) {
    switch (meta.type) {
      case 'select':
        return 'select';
      case 'date':
        return 'date';
      case 'datetime':
      case 'datetime-seconds':
        return 'datetime-local';
      case 'time':
        return 'time';
      case 'time-seconds':
        return 'time';
    }
  }

  if (schema instanceof yup.StringSchema) return 'text';
  if (schema instanceof yup.NumberSchema) return 'number';
  if (schema instanceof yup.BooleanSchema) return 'checkbox';

  return 'text';
};

export const Field = ({ name, schema, control, label, error }: FieldProps) => {
  const type = getInputType(schema);
  const meta = schema.spec?.meta || {};

  if (type === 'select') {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormField
            type="select"
            label={label}
            error={error}
            inputProps={{
              ...field,
              options: meta.selectOptions,
            }}
          />
        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, onChange, ...field } }) => (
        <FormField
          type={type as any}
          label={label}
          error={error}
          inputProps={{
            ...field,
            formNoValidate: true,
            onChange: e => {
              const value = type === 'number' 
                ? e.target.value === '' ? null : Number(e.target.value)
                : e.target.value;
              onChange(value);
            },
            ref
          }}
        />
      )}
    />
  );
}; 