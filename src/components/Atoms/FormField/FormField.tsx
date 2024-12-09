import * as yup from 'yup';

import { Radio, RadioOption } from '../Radio/Radio';
import React, { useId } from 'react';
import { Select, SelectOption } from '../Select/Select';

import { Input } from '../Input/Input';
import { Range } from '../Range/Range';
import { Textarea } from '../Textarea/Textarea';

type BaseFieldProps = {
  hasError: boolean;
  fieldProps: any;
  id?: string;
  schema: any;
};

type InputFieldProps = BaseFieldProps & {
  type: 'text' | 'number' | 'date' | 'datetime-local' | 'time' | 'checkbox' | 'password' | 'email' | 'url';
  fieldProps: Omit<React.ComponentProps<typeof Input>, 'type' | 'hasError'>;
};

type TextareaFieldProps = BaseFieldProps & {
  type: 'textarea';
  fieldProps: Omit<React.ComponentProps<typeof Textarea>, 'hasError'>;
};

type SelectFieldProps = BaseFieldProps & {
  type: 'select';
  fieldProps: Omit<React.ComponentProps<typeof Select>, 'hasError'>;
};

type RadioFieldProps = BaseFieldProps & {
  type: 'radio';
  fieldProps: Omit<React.ComponentProps<typeof Radio>, 'hasError'>;
};

type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps | RadioFieldProps;

export const FormField = ({
  hasError,
  fieldProps,
  schema,
  id
}: BaseFieldProps) => {
  let Component: React.ForwardRefExoticComponent<any> = Input;
  const additionalProps = { hasError, id };

  if (schema.spec?.meta?.type) {
    switch (schema.spec?.meta?.type) {
      case 'select':
        Component = Select;
        break;
      case 'textarea':
        Component = Textarea;
        break;
      case 'radio':
        Component = Radio;
        break;
      case 'range':
        Component = Range;
        break;
      default:
        break;
    }
  } else if (schema instanceof yup.StringSchema) {
    additionalProps.type = "text";
  } else if (schema instanceof yup.NumberSchema) {
    additionalProps.type = "number";
  } else if (schema instanceof yup.BooleanSchema) {
    additionalProps.type = "checkbox";
  }

  return <Component 
    {...fieldProps} 
    {...(schema.spec?.meta ?? {})} 
    {...additionalProps} 
    value={fieldProps.value === null ? '' : fieldProps.value} 
  />;
} 