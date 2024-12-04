import * as yup from 'yup';

export const buildDefaultValues = (schema: yup.AnyObjectSchema) => {
  const defaults: Record<string, any> = {};
  const fields = schema.fields || {};

  Object.entries(fields).forEach(([fieldName, fieldSchema]: [string, any]) => {
    if (fieldSchema instanceof yup.ObjectSchema) {
      defaults[fieldName] = buildDefaultValues(fieldSchema);
    } else if (fieldSchema instanceof yup.ArraySchema) {
      defaults[fieldName] = [];
    } else {
      defaults[fieldName] = fieldSchema.spec.default ?? getTypeDefault(fieldSchema);
    }
  });

  return defaults;
};

const getTypeDefault = (schema: any) => {
  if (schema instanceof yup.StringSchema) return '';
  if (schema instanceof yup.NumberSchema) return null;
  if (schema instanceof yup.BooleanSchema) return false;
  if (schema instanceof yup.DateSchema) return null;
  return null;
}; 