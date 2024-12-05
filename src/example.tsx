import * as yup from 'yup';

import { createSelectField, getSchemaAndField } from './utils/schemaHelpers';

import Form from './components/Organisms/Form/Form';

// Mock function to simulate API call
const fetchFormData = (populate: boolean) => {
    if (populate) {
      return {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
          bio: 'Full-stack developer with 5 years of experience',
          preferences: {
            newsletter: true,
            theme: 'dark'
          }
        },
        addresses: [{
          street: '123 Main St',
          unit: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
          isDefault: true,
          type: 'home',
          phoneNumbers: [
            { number: 1234567890, type: 'mobile', primary: true },
            { number: 9876543210, type: 'work', primary: false }
          ],
          deliveryInstructions: 'Leave with doorman'
        }],
        emergencyContacts: [{
          name: 'Jane Doe',
          relationship: 'spouse',
          phoneNumbers: [
            { number: 5555555555, type: 'mobile' }
          ]
        }],
        birthDate: '1990-01-01',
        appointmentTime: '2024-03-20T14:30'
      };
    }
    return null;
  };
  
  const schema = yup.object({
    personalInfo: yup.object({
      name: getSchemaAndField({
        type: 'string',
        required: true,
        fieldLabel: 'Full Name'
      }),
      email: getSchemaAndField({
        type: 'string',
        required: true,
        fieldLabel: 'Email'
      }).email(),
      age: getSchemaAndField({
        type: 'number',
        required: false,
        fieldLabel: 'Age'
      }),
      bio: getSchemaAndField({
        type: 'string',
        required: false,
        fieldLabel: 'Biography'
      }).max(500),
      preferences: yup.object({
        newsletter: getSchemaAndField({
          type: 'boolean',
          required: false,
          fieldLabel: 'Subscribe to Newsletter',
          defaultValue: false
        }),
        theme: createSelectField({
          options: [
            { value: 'light', label: 'Light Theme' },
            { value: 'dark', label: 'Dark Theme' },
            { value: 'system', label: 'System Default' }
          ],
          fieldLabel: 'Theme Preference',
          defaultValue: 'system',
          required: false
        })
      }).label('Preferences')
    }).label('Personal Information'),
  
    addresses: yup.array().of(
      yup.object({
        street: getSchemaAndField({
          type: 'string',
          required: true,
          fieldLabel: 'Street'
        }),
        unit: getSchemaAndField({
          type: 'string',
          required: false,
          fieldLabel: 'Unit/Apt'
        }),
        city: getSchemaAndField({
          type: 'string',
          required: true,
          fieldLabel: 'City'
        }),
        state: getSchemaAndField({
          type: 'string',
          required: true,
          fieldLabel: 'State'
        }),
        zipCode: getSchemaAndField({
          type: 'string',
          required: true,
          fieldLabel: 'ZIP Code'
        }).matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
        country: getSchemaAndField({
          type: 'string',
          required: true,
          fieldLabel: 'Country'
        }),
        isDefault: getSchemaAndField({
          type: 'boolean',
          required: false,
          fieldLabel: 'Default Address',
          defaultValue: false
        }),
        type: getSchemaAndField({
          type: 'string',
          required: false,
          fieldLabel: 'Address Type',
          defaultValue: 'home'
        }).oneOf(['home', 'work', 'other']),
        phoneNumbers: yup.array().of(
          yup.object({
            number: getSchemaAndField({
              type: 'number',
              required: true,
              fieldLabel: 'Phone Number'
            }),
            type: getSchemaAndField({
              type: 'string',
              required: false,
              fieldLabel: 'Type',
              defaultValue: 'mobile'
            }).oneOf(['home', 'work', 'mobile']),
            primary: getSchemaAndField({
              type: 'boolean',
              required: false,
              fieldLabel: 'Primary Number',
              defaultValue: false
            })
          })
        ).min(1, 'At least one phone number is required').default([]).required('Phone numbers are required').label('Phone Numbers'),
        deliveryInstructions: getSchemaAndField({
          type: 'string',
          required: false,
          fieldLabel: 'Delivery Instructions'
        })
      })
    ).min(1, 'At least one address is required').default([]).required('Addresses are required').label('Addresses'),
  
    emergencyContacts: yup.array().of(
      yup.object({
        name: getSchemaAndField({
          type: 'string',
          required: true,
          fieldLabel: 'Contact Name'
        }),
        relationship: getSchemaAndField({
          type: 'string',
          required: true,
          fieldLabel: 'Relationship',
          defaultValue: ''
        }).oneOf(['spouse', 'parent', 'child', 'sibling', 'friend', 'other']),
        phoneNumbers: yup.array().of(
          yup.object({
            number: getSchemaAndField({
              type: 'number',
              required: false,
              fieldLabel: 'Phone Number'
            }),
            type: getSchemaAndField({
              type: 'string',
              required: false,
              fieldLabel: 'Type',
              defaultValue: 'mobile'
            }).oneOf(['home', 'work', 'mobile'])
          })
        ).min(1, 'At least one phone number is required').default([]).label('Phone Numbers')
      })
    ).min(1, 'At least one contact is required').default([]).label('Emergency Contacts'),
  
    birthDate: getSchemaAndField({
      type: 'date',
      required: true,
      fieldLabel: 'Birth Date'
    }),
  
    appointmentTime: getSchemaAndField({
      type: 'datetime',
      required: true,
      fieldLabel: 'Appointment Time'
    })
  }).required();

  type Type = yup.InferType<typeof schema>;
  console.log('schema:', schema)
  
  export const MyForm = () => {
    const initialValues = fetchFormData(false);
  
    const handleSubmit = (data) => {
      console.log('Form submitted:', data);
    };
  
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                User Profile Form
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