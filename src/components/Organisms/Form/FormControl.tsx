import * as yup from 'yup';

import { Control, Controller } from 'react-hook-form';
import React, { useId } from 'react';

import { FieldWrapper } from '../../Molecules/FieldWrapper/FieldWrapper';
import { FormField } from '../../Atoms/FormField/FormField';
import { Input } from '../../Atoms/Input/Input';
import { Radio } from '../../Atoms/Radio/Radio';
import { Select } from '../../Atoms/Select/Select';
import { Textarea } from '../../Atoms/Textarea/Textarea';

interface FormControlProps {
  name: string;
  control: Control<any>;
  type: string;
  label?: string;
  schema: any;
  error?: string;
  options?: any[];
  rows?: number;
}

export const FormControl = ({ name, control, schema, type, label, error }: FormControlProps) => {
  const renderField = (fieldProps: any, schema) => {
    
    let Component: React.ForwardRefExoticComponent<any> = Input;
    const additionalProps = {};

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
        default:
          break;
      }
    } else if (schema instanceof yup.StringSchema) {
      additionalProps.type = "text"
    } else if (schema instanceof yup.NumberSchema) {
      additionalProps.type = "number"
    } else if (schema instanceof yup.BooleanSchema) {
      additionalProps.type = "checkbox"
    }

    return <Component {...fieldProps} {...(schema.spec?.meta ?? {})} {...additionalProps} />;
  }
  
  const id = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FieldWrapper label={label} error={error} id={id}>
          <FormField fieldProps={field} id={id} hasError={!!error} schema={schema} />
          {/* {renderField({ ...field, id }, schema)} */}
        </FieldWrapper>
      )}
    />
  );
};

// interface FieldProps {
//   name: string;
//   schema: any;
//   control: Control<any>;
//   label: string;
//   error?: string;
// }

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

// const getFieldValue = (type: string, value: any) => {
//   switch (type) {
//     case 'checkbox':
//       return Boolean(value);
//     case 'number':
//       return value ?? '';
//     default:
//       return value ?? '';
//   }
// };

// const handleFieldChange = (type: string, onChange: (value: any) => void) => 
//   (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     switch (type) {
//       case 'checkbox':
//         onChange((e.target as HTMLInputElement).checked);
//         break;
//       case 'number':
//         onChange(e.target.value === '' ? null : Number(e.target.value));
//         break;
//       default:
//         onChange(e.target.value);
//     }
//   };

// export const FormControl = ({ name, schema, control, label, error }: FieldProps) => {
//   const type = getInputType(schema);
//   const meta = schema?.spec?.meta || {};

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field: { ref, onChange, value, ...field } }) => {
//         const baseProps = {
//           ...field,
//           ref,
//           formNoValidate: true,
//           onChange: handleFieldChange(type, onChange)
//         };

//         const valueProps = type === 'checkbox' 
//           ? { checked: getFieldValue(type, value) }
//           : { value: getFieldValue(type, value) };

//         const extraProps = {
//           ...(type === 'select' || type === 'radio' ? { options: meta.options } : {}),
//           ...(type === 'textarea' ? { rows: meta.rows } : {})
//         };

//         return (
//           <FormField
//             type={type as any}
//             label={label}
//             error={error}
//             inputProps={{
//               ...baseProps,
//               ...valueProps,
//               ...extraProps
//             }}
//           />
//         );
//       }}
//     />
//   );
// }; 