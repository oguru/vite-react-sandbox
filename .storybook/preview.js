/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Components'],
      },
    },
  },
};

export default preview;
