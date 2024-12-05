import * as yup from 'yup';

import { createSelectField, getSchemaAndField } from './utils/schemaHelpers';

import Form from './components/Organisms/Form/Form';

// Mock function to simulate API call
const fetchFormData = (populate: boolean) => {
    if (populate) {
      return {
        textField: 'Sample text',
        numberField: 42,
        booleanField: true,
        dateField: '2023-10-10',
        selectField: 'option1',
        items: [{
          name: 'First Item',
          tags: ['tag1', 'tag2']
        }]
      };
    }
    return null;
  };
  
  const schema = yup.object({
    textField: getSchemaAndField({
      type: 'string',
      required: true,
      fieldLabel: 'Text Field'
    }),
    numberField: getSchemaAndField({
      type: 'number',
      required: true,
      fieldLabel: 'Number Field'
    }),
    booleanField: getSchemaAndField({
      type: 'boolean',
      required: true,
      fieldLabel: 'Boolean Field'
    }),
    dateField: getSchemaAndField({
      type: 'date',
      required: true,
      fieldLabel: 'Date Field'
    }),
    selectField: getSchemaAndField({
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ],
      fieldLabel: 'Select Field',
      required: true,
      type: 'select'
    }),
    items: yup.array().of(
      yup.object({
        name: getSchemaAndField({
          type: 'string',
          required: true,
          fieldLabel: 'Item Name'
        }),
        tags: yup.array().of(
          yup.string().required('Tag is required')
        ).min(1, 'At least one tag is required')
      })
    ).min(1, 'At least one item is required')
  }).required();

  type FormType = yup.InferType<typeof schema>;
  console.log('schema:', schema)
  
  export const MyForm = () => {
    const initialValues = fetchFormData(true);
  
    const handleSubmit = (data: FormType) => {
      console.log('Form submitted:', data);
    };
  
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Simplified Form
              </h1>
              <Form
                schema={schema}
                onSubmit={handleSubmit}
                initialValues={initialValues}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };