import { Control, UseFormRegister, useFieldArray } from 'react-hook-form';

import { FormFields } from './FormFields';
import React from 'react';

interface ArrayFieldProps {
  name: string;
  control: Control<any>;
  schema: any;
  label: string;
  errors?: any;
  register: UseFormRegister<any>;
}

export const ArrayField = ({ name, control, schema, label, errors, register }: ArrayFieldProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name
  });

  return (
    <div className="array-field">
      <label>{label}</label>
      {fields.map((field, index) => (
        <div key={field.id} className="array-item">
          <FormFields
            schema={schema}
            register={register}
            control={control}
            errors={errors?.[index] || {}}
            prefix={`${name}.${index}`}
          />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({})}>
        Add {label}
      </button>
    </div>
  );
}; 