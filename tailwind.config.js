/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-bg': '#f5f5f5',
        'light-surface': '#ffffff',
        'light-border': '#e0e0e0',
        'dark-bg': '#1e1e1e',
        'dark-surface': '#2d2d2d',
        'dark-border': '#444444',
        'primary': '#3498db',
        'secondary': '#2980b9',
        'success': '#27ae60',
        'warning': '#f39c12',
        'danger': '#e74c3c',
      },
      boxShadow: {
        'light': '0 1px 3px rgba(0,0,0,0.1)',
        'dark': '0 1px 3px rgba(0,0,0,0.3)',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}