import * as yup from 'yup';

import { Control, UseFormRegister, useFieldArray } from 'react-hook-form';

import { ArrayField } from './ArrayField';
import { Field } from './Field';
import React from 'react';

interface FormFieldsProps {
  schema: any;
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: any;
  prefix?: string;
}

export const FormFields = ({ schema, register, control, errors, prefix = '' }: FormFieldsProps) => {
  const fields = schema.fields || {};
  
  return (
    <>
      {Object.entries(fields).map(([fieldName, fieldSchema]: [string, any]) => {
        const fullPath = prefix ? `${prefix}.${fieldName}` : fieldName;
        const label = fieldSchema.spec.label || fieldName;
        const error = errors[fieldName]?.message;

        if (fieldSchema instanceof yup.ObjectSchema) {
          return (
            <div key={fieldName} className="object-field">
              <h4>{label}</h4>
              <FormFields
                schema={fieldSchema}
                register={register}
                control={control}
                errors={errors[fieldName] || {}}
                prefix={fullPath}
              />
            </div>
          );
        }

        if (fieldSchema instanceof yup.ArraySchema) {
          return (
            <ArrayField
              key={fieldName}
            register={register}
            name={fullPath}
              control={control}
              schema={fieldSchema.innerType}
              label={label}
              errors={errors[fieldName]}
            />
          );
        }

        return (
          <Field
            key={fieldName}
            name={fullPath}
            schema={fieldSchema}
            register={register}
            label={label}
            error={error}
          />
        );
      })}
    </>
  );
}; 