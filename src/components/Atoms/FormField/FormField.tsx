import React, { useId } from 'react';
import { Select, SelectOption } from '../Select/Select';

import { Input } from '../Input/Input';

type BaseFieldProps = {
  label?: string;
  error?: string;
  id?: string;
};

type InputFieldProps = BaseFieldProps & {
  type: 'text' | 'number' | 'date' | 'datetime-local' | 'time' | 'checkbox';
  inputProps: Omit<React.ComponentProps<typeof Input>, 'type' | 'hasError'>;
};

type SelectFieldProps = BaseFieldProps & {
  type: 'select';
  inputProps: Omit<React.ComponentProps<typeof Select>, 'hasError'>;
};

type FormFieldProps = InputFieldProps | SelectFieldProps;

export const FormField = ({
  label,
  error,
  type,
  inputProps,
  id: providedId
}: FormFieldProps) => {
  const generatedId = useId();
  const id = providedId || generatedId;

  const renderInput = () => {
    if (type === 'select') {
      return (
        <Select
          id={id}
          hasError={!!error}
          {...(inputProps as React.ComponentProps<typeof Select>)}
        />
      );
    }

    return (
      <Input
        id={id}
        type={type}
        hasError={!!error}
        {...(inputProps as React.ComponentProps<typeof Input>)}
      />
    );
  };

  return (
    <div className="mb-4 flex flex-col">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}; 