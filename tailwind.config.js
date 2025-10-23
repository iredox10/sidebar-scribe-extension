/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-bg': '#f5f7fa',
        'light-surface': '#ffffff',
        'light-border': '#e1e8ed',
        'light-hover': '#f0f4f8',
        'dark-bg': '#1a202c',
        'dark-surface': '#2d3748',
        'dark-border': '#4a5568',
        'dark-hover': '#4a5568',
        'primary': {
          DEFAULT: '#667eea',
          light: '#7c3aed',
          dark: '#5a67d8',
        },
        'secondary': '#5a67d8',
        'success': {
          DEFAULT: '#48bb78',
          dark: '#38a169',
        },
        'warning': {
          DEFAULT: '#ed8936',
          dark: '#dd6b20',
        },
        'danger': {
          DEFAULT: '#f56565',
          light: '#fc8181',
        },
        'purple': {
          DEFAULT: '#764ba2',
        }
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'light': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'md': '0 6px 20px rgba(0, 0, 0, 0.12)',
        'lg': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'dark': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'dark-md': '0 6px 20px rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 10px 30px rgba(0, 0, 0, 0.6)',
        'colored': '0 4px 12px rgba(102, 126, 234, 0.2)',
        'colored-dark': '0 4px 12px rgba(102, 126, 234, 0.3)',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in': 'slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}