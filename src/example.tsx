import * as yup from 'yup';

import { SchemaForm } from "./components/SchemaForm";

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
      name: yup.string().default('').required().label('Full Name'),
      email: yup.string().email().default('').required().label('Email'),
      age: yup.number().transform((value) => {
        return Number.isNaN(value) ? null : value;
      })
      .nullable().default(null).label('Age'),
      bio: yup.string().max(500).default('').label('Biography'),
      preferences: yup.object({
        newsletter: yup.boolean().default(false).label('Subscribe to Newsletter'),
        theme: yup.string().oneOf(['light', 'dark', 'system']).default('system').label('Theme Preference')
      }).label('Preferences')
    }).label('Personal Information'),
  
    addresses: yup.array().of(
      yup.object({
        street: yup.string().default('').required().label('Street'),
        unit: yup.string().default('').label('Unit/Apt'),
        city: yup.string().default('').required().label('City'),
        state: yup.string().default('').required().label('State'),
        zipCode: yup.string().matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code').default('').required().label('ZIP Code'),
        country: yup.string().default('').required().label('Country'),
        isDefault: yup.boolean().default(false).label('Default Address'),
        type: yup.string().oneOf(['home', 'work', 'other']).default('home').label('Address Type'),
        phoneNumbers: yup.array().of(
          yup.object({
            number: yup.number()
              .transform((value) => {
                return Number.isNaN(value) ? null : value;
              })
              .nullable()
              .required('Please enter a valid phone number')
              .typeError('Please enter a valid phone number')
              .label('Phone Number'),
            type: yup.string()
              .oneOf(['home', 'work', 'mobile'])
              .default('mobile')
              .label('Type'),
            primary: yup.boolean()
              .default(false)
              .label('Primary Number')
          })
        ).min(1, 'At least one phone number is required').default([]).required('Phone numbers are required').label('Phone Numbers'),
        deliveryInstructions: yup.string().default('').label('Delivery Instructions')
      })
    ).min(1, 'At least one address is required').default([]).required('Addresses are required').label('Addresses'),
  
    emergencyContacts: yup.array().of(
      yup.object({
        name: yup.string().default('').required().label('Contact Name'),
        relationship: yup.string().default('').required().oneOf([
          'spouse', 'parent', 'child', 'sibling', 'friend', 'other'
        ]).label('Relationship'),
        phoneNumbers: yup.array().of(
          yup.object({
            number: yup.number().nullable().default(null).label('Phone Number'),
            type: yup.string().oneOf(['home', 'work', 'mobile']).default('mobile').label('Type')
          })
        ).min(1, 'At least one phone number is required').default([]).label('Phone Numbers')
      })
    ).min(1, 'At least one contact is required').default([]).label('Emergency Contacts'),
  
    birthDate: yup.string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Birth Date must be in the format YYYY-MM-DD')
      .nullable()
      .default(null)
      .required()
      .meta({ date: true })
      .label('Birth Date'),
  
    appointmentTime: yup.string()
      .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Appointment Time must be in the format YYYY-MM-DDTHH:MM')
      .nullable()
      .default(null)
      .required()
      .meta({ datetime: true })
      .label('Appointment Time'),
  }).required();

  type Type = yup.InferType<typeof schema>;
  
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
              <SchemaForm
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