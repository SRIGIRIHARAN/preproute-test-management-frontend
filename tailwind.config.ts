import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F6EF7',
          hover: '#3B5BEB',
          foreground: '#FFFFFF',
        },
        navy: '#1E1B4B',
        surface: '#F0F4FF',
        border: '#E5E7EB',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
} satisfies Config;
