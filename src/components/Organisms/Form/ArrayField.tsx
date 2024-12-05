import * as yup from 'yup';

import { Control, UseFormRegister, useFieldArray } from 'react-hook-form';
import { buildDefaultValues, getTypeDefault } from '../../../utils/schema';

import { Field } from './Field';
import { FormFields } from './FormFields';

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
    if (schema instanceof yup.ObjectSchema) {
      const defaultValue = buildDefaultValues(schema);
      append(defaultValue);
    } else {
      console.log('schema.innerType:', schema.innerType)
      console.log('schema:', schema)
      const defaultValue = getTypeDefault(schema.innerType || schema);
      append(defaultValue, { shouldFocus: false });
    }
  };

  return (
    <div className="array-field">
      <label>{label}</label>
      {fields.map((field, index) => {
        const fieldValue = typeof field === 'object' && !schema.innerType?.fields 
          ? Object.values(field).filter(val => typeof val === 'string').join('')
          : field;

        return (
          <div key={field.id} className="array-item">
            {schema instanceof yup.ObjectSchema ? (
              <FormFields
                schema={schema}
                register={register}
                control={control}
                errors={errors?.[index] || {}}
                prefix={`${name}.${index}`}
              />
            ) : (
              <Field
                name={`${name}.${index}`}
                schema={schema.innerType || schema}
                control={control}
                label=""
                error={errors?.[index]?.message}
              />
            )}
            <button 
              type="button" 
              onClick={() => remove(index)}
              className="ml-2 px-2 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        );
      })}
      {(Array.isArray(errors) ? errors.root?.message : errors?.message) && (
        <p className="text-sm text-red-500">
          {Array.isArray(errors) ? errors.root?.message : errors?.message}
        </p>
      )}
      <button 
        type="button" 
        onClick={handleAppend}
        className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
      >
        Add {label}
      </button>
    </div>
  );
}; 