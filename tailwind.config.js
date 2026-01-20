/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map legacy names to new CSS variables for consistency
        'light-bg': 'var(--bg-primary)',
        'light-surface': 'var(--bg-secondary)',
        'light-border': 'var(--border-color)',
        'light-hover': 'var(--bg-hover)',
        
        'dark-bg': 'var(--bg-primary)',
        'dark-surface': 'var(--bg-secondary)',
        'dark-border': 'var(--border-color)',
        'dark-hover': 'var(--bg-hover)',
        
        'primary': {
          DEFAULT: 'var(--accent-primary)',
          light: 'var(--accent-secondary)',
          dark: 'var(--accent-primary-hover)',
        },
        'secondary': 'var(--accent-secondary)',
        'success': {
          DEFAULT: 'var(--accent-success)',
        },
        'warning': {
          DEFAULT: 'var(--accent-warning)',
        },
        'danger': {
          DEFAULT: 'var(--accent-danger)',
        },
        
        // Semantic names if needed
        'app-bg': 'var(--bg-primary)',
        'sidebar-bg': 'var(--bg-secondary)',
        'input-bg': 'var(--bg-tertiary)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'colored': 'var(--shadow-colored)',
      },
      borderRadius: {
        'sm': 'var(--border-radius-sm)',
        'md': 'var(--border-radius)',
        'lg': '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideInLeft 0.2s ease-out',
      },
    },
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"]'], // Support both class and data-attribute
}
