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
    name,
    shouldUnregister: true
  });

  const handleAppend = () => {
    append({}, { shouldFocus: false });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

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
          <button type="button" onClick={() => handleRemove(index)}>
            Remove
          </button>
        </div>
      ))}
      {(Array.isArray(errors) ? errors.root?.message : errors?.message) && (
        <p style={{color: 'red'}} className="text-sm text-red-500">
          {Array.isArray(errors) ? errors.root?.message : errors?.message}
        </p>
      )}
      <button type="button" onClick={handleAppend}>
        Add {label}
      </button>
    </div>
  );
}; 