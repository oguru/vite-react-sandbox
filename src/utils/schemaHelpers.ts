import * as yup from 'yup';

import { isAfter, isBefore, isValid, parse } from 'date-fns';

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm";
export const DATE_TIME_FORMAT_SECONDS = "yyyy-MM-dd'T'HH:mm:ss";
export const TIME_FORMAT = 'HH:mm';
export const TIME_FORMAT_SECONDS = 'HH:mm:ss';

export enum DateFieldType {
  DATE = 'date',
  DATE_TIME = 'datetime',
  DATE_TIME_SECONDS = 'datetime-seconds',
  TIME = 'time',
  TIME_SECONDS = 'time-seconds'
}

// Input/validation formats (what HTML inputs return)
export const INPUT_DATE_FORMAT = 'yyyy-MM-dd';
export const INPUT_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm";
export const INPUT_DATE_TIME_SECONDS_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
export const INPUT_TIME_FORMAT = 'HH:mm';
export const INPUT_TIME_SECONDS_FORMAT = 'HH:mm:ss';

// Example display formats (can be customized)
export const DISPLAY_DATE_FORMAT = 'dd/MM/yyyy';
export const DISPLAY_DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const DISPLAY_DATE_TIME_SECONDS_FORMAT = 'dd/MM/yyyy HH:mm:ss';
export const DISPLAY_TIME_FORMAT = 'HH:mm';
export const DISPLAY_TIME_SECONDS_FORMAT = 'HH:mm:ss';

type SelectOption = {
  value: string;
  label: string;
};

type SchemaOptions = {
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'datetime-seconds' | 'select';
  defaultValue?: any;
  fieldLabel?: string;
  validationLabel?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  selectOptions?: Array<{ value: string; label: string }>;
};

// Define more specific return types for each schema type
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

// Get the input format based on type
const getInputFormat = (type: string): string => {
  switch (type) {
    case 'date':
      return INPUT_DATE_FORMAT;
    case 'datetime':
      return INPUT_DATE_TIME_FORMAT;
    case 'datetime-seconds':
      return INPUT_DATE_TIME_SECONDS_FORMAT;
    case 'time':
      return INPUT_TIME_FORMAT;
    case 'time-seconds':
      return INPUT_TIME_SECONDS_FORMAT;
    default:
      return INPUT_DATE_FORMAT;
  }
};

export const getSchemaAndField = (options: SchemaOptions): SchemaType => {
  const { 
    type,
    defaultValue, 
    fieldLabel, 
    validationLabel, 
    required = true,
    min, 
    max,
    selectOptions 
  } = options;
  
  let schema: SchemaType;

  switch (type) {
    case 'string': {
      schema = yup.string().nullable() as StringSchema;
      break;
    }
    case 'number': {
      let numberSchema = yup.number().nullable();
      numberSchema = numberSchema.transform((value) => {
        return Number.isNaN(value) ? null : value;
      });
      
      if (typeof min === 'number') {
        numberSchema = numberSchema.min(min);
      }
      if (typeof max === 'number') {
        numberSchema = numberSchema.max(max);
      }
      schema = numberSchema as NumberSchema;
      break;
    }
    case 'boolean': {
      schema = yup.boolean().nullable() as BooleanSchema;
      break;
    }
    case 'select': {
      if (!selectOptions?.length) {
        throw new Error('selectOptions are required for select fields');
      }
      schema = yup.string()
        .nullable()
        .oneOf(
          selectOptions.map(opt => opt.value),
          'Please select a valid option'
        )
        .meta({ 
          type: 'select',
          selectOptions 
        }) as StringSchema;
      break;
    }
    case 'date':
    case 'datetime':
    case 'datetime-seconds': {
      let dateSchema = yup.string().nullable();
      dateSchema = dateSchema.meta({ type });
      schema = addDateValidation(dateSchema as StringSchema, type, min as string, max as string);
      break;
    }
    default:
      throw new Error(`Unsupported type: ${type}`);
  }

  schema = addDefault(schema, defaultValue);
  schema = addFieldLabel(schema, fieldLabel);
  schema = addValidationLabel(schema, validationLabel);
  schema = addRequired(schema, required, validationLabel);

  return schema;
};

export const createSelectField = (options: {
  options: SelectOption[];
  required?: boolean;
  fieldLabel?: string;
  validationLabel?: string;
  defaultValue?: string;
}) => {
  const { options: selectOptions, required = true, fieldLabel, validationLabel, defaultValue } = options;
  
  let schema = yup.string()
    .nullable()
    .oneOf(
      selectOptions.map(opt => opt.value),
      `Please select a valid option`
    )
    .meta({ 
      type: 'select',
      selectOptions // Store the full options array in meta for the Field component
    });

  schema = addDefault(schema, defaultValue);
  schema = addFieldLabel(schema, fieldLabel);
  schema = addValidationLabel(schema, validationLabel);
  schema = addRequired(schema, required, validationLabel);

  return schema;
}; 