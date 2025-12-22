/**
 * Sistema de Diseño Gallinapp - Web
 * Basado en los colores y principios de diseño de la app mobile
 */

export const designSystem = {
  colors: {
    // Colores primarios - Azul marca Gallinapp
    primary: {
      50: '#E8EBF5',
      100: '#C3CCE8',
      200: '#9DADD9',
      300: '#778EC9',
      400: '#5A75B8',
      500: '#345DAD',  // Principal
      600: '#2D5199',
      700: '#254480',
      800: '#1E3766',
      900: '#132547',
    },
    
    // Colores secundarios - Gris azulado oscuro marca
    secondary: {
      50: '#E8E8EA',
      100: '#C3C3C7',
      200: '#9D9DA3',
      300: '#777780',
      400: '#5A5A64',
      500: '#35354C',  // Principal
      600: '#2D2D41',
      700: '#252536',
      800: '#1E1E2B',
      900: '#13131C',
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
    },
    
    // Colores específicos del dominio avícola
    poultry: {
      egg: '#FFD700',        // Dorado - huevos
      chicken: '#D2B48C',    // Beige - pollos
      feed: '#8B4513',       // Marrón - alimento
      health: '#4CAF50',     // Verde - salud/bienestar
      growth: '#66BB6A',     // Verde claro - crecimiento
    },
    
    // Colores para módulos específicos
    modules: {
      ponedoras: '#345DAD',    // Azul marca
      levantes: '#5A75B8',     // Azul medio
      engorde: '#778EC9',      // Azul claro
    },
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #345DAD 0%, #254480 100%)',
    primaryLight: 'linear-gradient(135deg, #5A75B8 0%, #345DAD 100%)',
    secondary: 'linear-gradient(135deg, #35354C 0%, #252536 100%)',
    success: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
    warning: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    hero: 'linear-gradient(135deg, #E8EBF5 0%, #FFFFFF 50%, #E8EBF5 100%)',
    card: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(52, 93, 173, 0.05)',
    base: '0 1px 3px 0 rgba(52, 93, 173, 0.1), 0 1px 2px 0 rgba(52, 93, 173, 0.06)',
    md: '0 4px 6px -1px rgba(52, 93, 173, 0.1), 0 2px 4px -1px rgba(52, 93, 173, 0.06)',
    lg: '0 10px 15px -3px rgba(52, 93, 173, 0.1), 0 4px 6px -2px rgba(52, 93, 173, 0.05)',
    xl: '0 20px 25px -5px rgba(52, 93, 173, 0.1), 0 10px 10px -5px rgba(52, 93, 173, 0.04)',
    colored: '0 10px 25px -5px rgba(52, 93, 173, 0.3)',
  },
  
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },
  
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  typography: {
    fontFamily: {
      sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
} as const

export type DesignSystem = typeof designSystem









