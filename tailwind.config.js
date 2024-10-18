/** @type {import('tailwindcss').Config} */
const { createThemes } = require('tw-colors');
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    createThemes({
      light: {
        'primary': '#f4f7fa',
        'text': '#333',
        'background': '#f1f1f1',
        'border': '#4CAF50',
        'code-background': '#e8e8e8',
        'example-background': '#f9f9f9',
        'example-border': '#ccc',
        'example-box-shadow': 'rgba(0, 0, 0, 0.1)',
        'modal-box-shadow': 'rgba(0, 0, 0, 0.3)',
      },
      dark: {
        'primary': 'steelblue',
        'secondary': 'darkblue',
        'brand': '#F3F3F3',
      }
    })
  ],
}

