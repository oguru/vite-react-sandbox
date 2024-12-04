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
        }]
      };
    }
    return null;
  };
  
  const schema = yup.object({
    personalInfo: yup.object({
      name: yup.string().required().label('Full Name'),
      email: yup.string().email().required().label('Email'),
      age: yup.number().nullable().transform((value) => {
        return Number.isNaN(value) ? null : value;
      }).min(18, 'Must be at least 18 years old').required('Age is required').label('Age'),
      bio: yup.string().max(500).label('Biography'),
      preferences: yup.object({
        newsletter: yup.boolean().default(false).label('Subscribe to Newsletter'),
        theme: yup.string().oneOf(['light', 'dark', 'system']).default('system').label('Theme Preference')
      }).label('Preferences')
    }).label('Personal Information'),
  
    addresses: yup.array().of(
      yup.object({
        street: yup.string().required().label('Street'),
        unit: yup.string().label('Unit/Apt'),
        city: yup.string().required().label('City'),
        state: yup.string().required().label('State'),
        zipCode: yup.string().matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code').required().label('ZIP Code'),
        country: yup.string().required().label('Country'),
        isDefault: yup.boolean().default(false).label('Default Address'),
        type: yup.string().oneOf(['home', 'work', 'other']).default('home').label('Address Type'),
        phoneNumbers: yup.array().of(
          yup.object({
            number: yup.number().nullable().transform((value) => {
              return Number.isNaN(value) ? null : value;
            }).required('Phone number is required').label('Phone Number'),
            type: yup.string().oneOf(['home', 'work', 'mobile']).default('mobile').label('Type'),
            primary: yup.boolean().default(false).label('Primary Number')
          })
        ).min(1, 'At least one phone number is required').default([]).label('Phone Numbers'),
        deliveryInstructions: yup.string().label('Delivery Instructions')
      })
    ).default([]).label('Addresses'),
  
    emergencyContacts: yup.array().of(
      yup.object({
        name: yup.string().required().label('Contact Name'),
        relationship: yup.string().required().oneOf([
          'spouse', 'parent', 'child', 'sibling', 'friend', 'other'
        ]).label('Relationship'),
        phoneNumbers: yup.array().of(
          yup.object({
            number: yup.number().nullable().transform((value) => {
              return Number.isNaN(value) ? null : value;
            }).required('Phone number is required').label('Phone Number'),
            type: yup.string().oneOf(['home', 'work', 'mobile']).default('mobile').label('Type')
          })
        ).min(1, 'At least one phone number is required').default([]).label('Phone Numbers')
      })
    ).default([]).label('Emergency Contacts')
  }).required();
  
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