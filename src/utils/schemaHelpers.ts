import * as yup from 'yup';

import { isAfter, isBefore, isValid, parse } from 'date-fns';

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm";
export const DATE_TIME_FORMAT_SECONDS = "yyyy-MM-dd'T'HH:mm:ss";
export const TIME_FORMAT = 'HH:mm';
export const TIME_FORMAT_SECONDS = 'HH:mm:ss';
const MAX_DATE = '9999-12-31';

export interface FieldOption {
  value: string;
  label: string;
}

type SchemaOptions = {
  type: 'text' | 'number' | 'password' | 'email' | 'url' | 'tel' | 'search' | 
        'date' | 'datetime-local' | 'time' | 'month' | 'week' | 'color' |
        'checkbox' | 'radio' | 'range' | 'file' |
        'textarea' | 'select'; // Non-HTML input types for special components
  required?: boolean;
  fieldLabel?: string;
  validationLabel?: string;
  defaultValue?: any;
  rows?: number; // For textarea
  options?: FieldOption[]; // For radio and select
  min?: number | string;
  max?: number | string;
  step?: number;
};

type StringSchema = yup.StringSchema<string | null>;
type NumberSchema = yup.NumberSchema<number | null>;
type BooleanSchema = yup.BooleanSchema<boolean | null>;

// Union type for all possible schema returns
type SchemaType = StringSchema | NumberSchema | BooleanSchema;

type SchemaWithDefault<T> = {
  default: (value: any) => T;
  meta: (value: any) => T;
  label: (value: string) => T;
  required: (message: string) => T;
};

function addDefault<T extends SchemaWithDefault<T>>(schema: T, defaultValue?: any): T {
  return defaultValue !== undefined ? schema.default(defaultValue) : schema;
}

function addFieldLabel<T extends SchemaWithDefault<T>>(schema: T, fieldLabel?: string): T {
  return fieldLabel ? schema.meta({ label: fieldLabel }) : schema;
}

function addValidationLabel<T extends SchemaWithDefault<T>>(schema: T, validationLabel?: string): T {
  return validationLabel ? schema.label(validationLabel) : schema;
}

function addRequired<T extends SchemaWithDefault<T>>(schema: T, required: boolean, validationLabel?: string): T {
  return required ? schema.required(`${validationLabel || 'Field'} is required`) : schema;
}

const addDateValidation = (schema: StringSchema, type: string, min?: string, max?: string): StringSchema => {
  let validatedSchema = schema;

  // Add test for valid date format
  validatedSchema = validatedSchema.test(
    'valid-date',
    'Invalid date format',
    (value) => {
      if (!value) return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
  );

  if (min) {
    validatedSchema = validatedSchema.test(
      'min-date',
      `Must be after ${min}`,
      (value) => {
        if (!value) return true;
        const date = new Date(value);
        const minDate = new Date(min);
        return isValid(date) && isValid(minDate) && !isBefore(date, minDate);
      }
    );
  }

  if (max) {
    validatedSchema = validatedSchema.test(
      'max-date',
      `Must be before ${max}`,
      (value) => {
        if (!value) return true;
        const date = new Date(value);
        const maxDate = new Date(max);
        return isValid(date) && isValid(maxDate) && !isAfter(date, maxDate);
      }
    );
  }

  return validatedSchema;
};

export const getFieldSchema = (options: SchemaOptions) => {
  const { 
    type, 
    required = true, 
    fieldLabel, 
    validationLabel, 
    defaultValue, 
    rows,
    options: fieldOptions,
    min,
    max,
    step
  } = options;

  let schema: any;

  switch (type) {
    case 'text':
    // case 'password':
    // case 'email':
    // case 'url':
    case 'tel':
    case 'search':
    case 'color':
    case 'file':
      schema = yup.string().meta({ type });
      break;
    case 'textarea':
      schema = yup.string().meta({ type: 'textarea' });
      if (rows) {
        schema = schema.meta({ ...schema.spec?.meta, rows });
      }
      break;
    case 'password':
      schema = yup.string().meta({ type: 'password' });
      break;
    case 'url':
      schema = yup.string().url('Please enter a valid URL').meta({ type: 'url' });
      break;
    case 'email':
      schema = yup.string()
        .email('Please enter a valid email address')
        .meta({ type: 'email' });
      break;
    case 'radio':
    case 'select':
      if (!fieldOptions?.length) {
        throw new Error(`options are required for ${type} fields`);
      }
      schema = yup.string()
        .oneOf(
          fieldOptions.map(opt => opt.value),
          'Please select a valid option'
        )
        .meta({ 
          type,
          options: fieldOptions
        });
      break;
    case 'number':
    case 'range': {
      let numberSchema = yup.number().nullable().meta({ type });
      
      if (typeof min === 'number') {
        numberSchema = numberSchema.min(min);
      }
      if (typeof max === 'number') {
        numberSchema = numberSchema.max(max);
      }
      if (type === 'range') {
        numberSchema = numberSchema.meta({ 
          ...numberSchema.spec?.meta,
          step: step,
          min: min ?? 0,
          max: max ?? 100
        });
      }
      schema = numberSchema;
      break;
    }
    case 'checkbox': {
      schema = yup.boolean().meta({ type });
      break;
    }
    case 'date':
    case 'datetime-local':
    case 'time':
    case 'month':
    case 'week': {
      schema = yup.string().meta({ type, min, max: max || MAX_DATE });
      schema = addDateValidation(
        schema, 
        type, 
        min as string | undefined, 
        (max || MAX_DATE) as string
      );
      break;
    }
    default:
      throw new Error(`Unsupported field type: ${type}`);
  }

  schema = addDefault(schema, defaultValue);
  schema = addFieldLabel(schema, fieldLabel);
  schema = addValidationLabel(schema, validationLabel);
  schema = addRequired(schema, required, validationLabel);
  
  return schema;
};