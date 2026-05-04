/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand
        navy: {
          900: '#0A2540',
          800: '#0F2C4D',
          700: '#163559',
          600: '#1C4A6E',
        },
        teal: {
          200: '#A4E4DA',
          300: '#6CD3C5',
          400: '#3DBDB0',
          500: '#1FA59B',
        },
        // Light theme semantic
        bg: '#EEF4F7',
        'bg-alt': '#F4F8FA',
        surface: '#FFFFFF',
        'surface-alt': '#F7FAFB',
        divider: '#E3EBEF',
        border: '#D9E2E7',
        // Text
        'text-primary': '#0E1B2C',
        'text-secondary': '#4A5C6E',
        'text-tertiary': '#7A8A98',
        // Status
        success: '#1FA59B',
        warning: '#E0A23A',
        danger: '#D04E5C',
        'pulse-red': '#FF6E7A',
        // Dark theme
        'dark-bg': '#06121F',
        'dark-surface': '#0E1F30',
        'dark-surface-alt': '#13283C',
        'dark-divider': '#1E3247',
        'dark-border': '#264159',
        'dark-text-primary': '#F4F8FA',
        'dark-text-secondary': '#A8B6C2',
        'dark-text-tertiary': '#7A8A98',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 6px 16px rgba(10, 37, 64, 0.06)',
        'card-dark': '0 6px 16px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-ring': 'pulseRing 1.6s ease-out infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
