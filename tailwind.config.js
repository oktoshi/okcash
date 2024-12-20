/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    // @ts-expect-error - tailwindcss plugin types
    require('@tailwindcss/typography'),
  ],
};