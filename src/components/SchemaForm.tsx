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
    formState: { errors },
    trigger
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    // reValidateMode: 'onChange'
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const handleFormSubmit = async (data: any) => {
    const isValid = await trigger();
    if (isValid) {
      onSubmit(data);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
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