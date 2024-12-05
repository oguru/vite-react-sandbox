import { Radio, RadioOption } from '../Radio/Radio';
import React, { useId } from 'react';
import { Select, SelectOption } from '../Select/Select';

import { Input } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';

type BaseFieldProps = {
  label?: string;
  error?: string;
  id?: string;
};

type InputFieldProps = BaseFieldProps & {
  type: 'text' | 'number' | 'date' | 'datetime-local' | 'time' | 'checkbox' | 'password' | 'email' | 'url';
  inputProps: Omit<React.ComponentProps<typeof Input>, 'type' | 'hasError'>;
};

type TextareaFieldProps = BaseFieldProps & {
  type: 'textarea';
  inputProps: Omit<React.ComponentProps<typeof Textarea>, 'hasError'>;
};

type SelectFieldProps = BaseFieldProps & {
  type: 'select';
  inputProps: Omit<React.ComponentProps<typeof Select>, 'hasError'>;
};

type RadioFieldProps = BaseFieldProps & {
  type: 'radio';
  inputProps: Omit<React.ComponentProps<typeof Radio>, 'hasError'>;
};

type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps | RadioFieldProps;

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

    if (type === 'textarea') {
      return (
        <Textarea
          id={id}
          hasError={!!error}
          {...(inputProps as React.ComponentProps<typeof Textarea>)}
        />
      );
    }

    if (type === 'radio') {
      return (
        <Radio
          id={id}
          hasError={!!error}
          {...(inputProps as React.ComponentProps<typeof Radio>)}
        />
      );
    }

    const sanitizedInputProps = {
      ...inputProps,
      value: inputProps.value === null ? '' : inputProps.value
    } as React.ComponentProps<typeof Input>;

    return (
      <Input
        id={id}
        type={type}
        hasError={!!error}
        {...sanitizedInputProps}
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