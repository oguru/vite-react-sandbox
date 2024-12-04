import * as yup from 'yup';

type SchemaOptions = {
  defaultValue?: any;
  fieldLabel?: string;
  validationLabel?: string;
  required?: boolean;
};


export const getSchema = (type: string, options: SchemaOptions = {}) => {
  const { defaultValue, fieldLabel, validationLabel, required = true } = options;
  let schema;

  switch (type) {
    case 'string':
      schema = yup.string();
      break;
    case 'number':
      schema = yup.number().transform(value => (Number.isNaN(value) ? null : value)).nullable();
      break;
    case 'boolean':
      schema = yup.boolean();
      break;
    case 'date':
      schema = yup.string().meta({ date: true }).matches(/^\d{4}-\d{2}-\d{2}$/, 'Must be in the format YYYY-MM-DD');
      break;
    case 'datetime':
      schema = yup.string().meta({ datetime: true }).matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Must be in the format YYYY-MM-DDTHH:MM');
      break;
    default:
      throw new Error(`Unsupported type: ${type}`);
  }

  if (defaultValue !== undefined) {
    schema = schema.default(defaultValue);
  }

  if (fieldLabel) {
    schema = schema.meta({ label: fieldLabel });
  }

  if (validationLabel) {
    schema = schema.label(validationLabel);
  }

  if (required) {
    schema = schema.required(`${validationLabel || 'Field'} is required`);
  }

  return schema;
}; 