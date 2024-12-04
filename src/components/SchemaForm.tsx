import * as yup from 'yup';

import { FormFields } from './FormFields';
import { buildDefaultValues } from '../utils/schema';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface SchemaFormProps {
  schema: yup.AnyObjectSchema;
  onSubmit: (data: any) => void;
  initialValues?: any;
}

export const SchemaForm = ({ schema, onSubmit, initialValues }: SchemaFormProps) => {
  const defaultValues = buildDefaultValues(schema);
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormFields
        schema={schema}
        register={register}
        control={control}
        errors={errors}
      />
      <button type="submit">Submit</button>
    </form>
  );
}; 