/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        bubble: '0 10px 40px -15px rgba(15, 23, 42, 0.45)'
      }
    }
  },
  plugins: []
};
