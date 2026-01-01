import type { Config } from 'tailwindcss'

/**
 * Configuración de Tailwind v4 para Gallinapp Admin
 * Reutiliza el sistema de diseño de apps/web
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        // Colores primarios - Azul marca Gallinapp (#345DAD)
        primary: {
          50: '#E8EBF5',
          100: '#C3CCE8',
          200: '#9DADD9',
          300: '#778EC9',
          400: '#5A75B8',
          500: '#345DAD',
          600: '#2D5199',
          700: '#254480',
          800: '#1E3766',
          900: '#132547',
          DEFAULT: '#345DAD',
        },
        // Colores secundarios - Gris azulado oscuro marca (#35354C)
        secondary: {
          50: '#E8E8EA',
          100: '#C3C3C7',
          200: '#9D9DA3',
          300: '#777780',
          400: '#5A5A64',
          500: '#35354C',
          600: '#2D2D41',
          700: '#252536',
          800: '#1E1E2B',
          900: '#13131C',
          DEFAULT: '#35354C',
        },
        // Colores semánticos
        success: {
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#2E7D32',
          600: '#388E3C',
          700: '#2E7D32',
          800: '#1B5E20',
          900: '#1B5E20',
          DEFAULT: '#2E7D32',
        },
        warning: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FF9800',
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
          DEFAULT: '#FF9800',
        },
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
          DEFAULT: '#F44336',
        },
        info: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
          DEFAULT: '#2196F3',
        },
        // Colores neutros
        neutral: {
          0: '#FFFFFF',
          50: '#F8F9FA',
          100: '#F1F3F4',
          200: '#E8EAED',
          300: '#DADCE0',
          400: '#BDC1C6',
          500: '#9AA0A6',
          600: '#80868B',
          700: '#5F6368',
          800: '#3C4043',
          900: '#202124',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #345DAD 0%, #254480 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #35354C 0%, #252536 100%)',
      },
      boxShadow: {
        'colored': '0 10px 25px -5px rgba(52, 93, 173, 0.3)',
        'colored-lg': '0 20px 40px -10px rgba(52, 93, 173, 0.4)',
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
} satisfies Config

