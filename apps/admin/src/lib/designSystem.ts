/**
 * Sistema de Diseño Gallinapp - Admin
 * Reutiliza el sistema de diseño de apps/web
 */

// Reutilizar colores del sistema de diseño principal
export const colors = {
  primary: {
    500: '#345DAD',
    600: '#2D5199',
    700: '#254480',
  },
  secondary: {
    500: '#35354C',
  },
  success: {
    500: '#2E7D32',
  },
  warning: {
    500: '#FF9800',
  },
  error: {
    500: '#F44336',
  },
  info: {
    500: '#2196F3',
  },
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
}

export const designSystem = {
  colors,
} as const

export type DesignSystem = typeof designSystem

