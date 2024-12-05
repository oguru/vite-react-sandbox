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
      case 'radio':
        return 'radio';
      case 'textarea':
        return 'textarea';
      case 'date':
        return 'date';
      case 'datetime':
      case 'datetime-seconds':
        return 'datetime-local';
      case 'time':
      case 'time-seconds':
        return 'time';
      case 'password':
        return 'password';
      case 'email':
        return 'email';
      case 'url':
        return 'url';
    }
  }

  if (schema instanceof yup.StringSchema) return 'text';
  if (schema instanceof yup.NumberSchema) return 'number';
  if (schema instanceof yup.BooleanSchema) return 'checkbox';

  return 'text';
};

const getFieldValue = (type: string, value: any) => {
  switch (type) {
    case 'checkbox':
      return Boolean(value);
    case 'number':
      return value ?? '';
    default:
      return value ?? '';
  }
};

const handleFieldChange = (type: string, onChange: (value: any) => void) => 
  (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    switch (type) {
      case 'checkbox':
        onChange((e.target as HTMLInputElement).checked);
        break;
      case 'number':
        onChange(e.target.value === '' ? null : Number(e.target.value));
        break;
      default:
        onChange(e.target.value);
    }
  };

export const Field = ({ name, schema, control, label, error }: FieldProps) => {
  const type = getInputType(schema);
  const meta = schema?.spec?.meta || {};

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, onChange, value, ...field } }) => {
        const baseProps = {
          ...field,
          ref,
          formNoValidate: true,
          onChange: handleFieldChange(type, onChange)
        };

        const valueProps = type === 'checkbox' 
          ? { checked: getFieldValue(type, value) }
          : { value: getFieldValue(type, value) };

        const extraProps = {
          ...(type === 'select' || type === 'radio' ? { options: meta.options } : {}),
          ...(type === 'textarea' ? { rows: meta.rows } : {})
        };

        return (
          <FormField
            type={type as any}
            label={label}
            error={error}
            inputProps={{
              ...baseProps,
              ...valueProps,
              ...extraProps
            }}
          />
        );
      }}
    />
  );
}; 