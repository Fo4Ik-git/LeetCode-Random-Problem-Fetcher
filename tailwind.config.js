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
        'secondary': 'darkblue',
        'brand': '#F3F3F3',
      },
      dark: {
        'primary': 'steelblue',
        'secondary': 'darkblue',
        'brand': '#F3F3F3',
      }
    })
  ],
}

