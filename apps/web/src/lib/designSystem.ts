/**
 * Sistema de Diseño Gallinapp - Web (Premium SaaS Edition)
 * Basado en Tailwind v4
 */

export const designSystem = {
  colors: {
    brand: {
      primary: '#345DAD',
      secondary: '#635BFF',
      dark: '#0A2540',
    },
    text: {
      heading: '#0A2540',
      body: '#425466',
      muted: '#697386',
      inverse: '#FFFFFF',
    },
    background: {
      page: '#F6F9FC',
      card: '#FFFFFF',
      dark: '#0A2540',
    },
    border: '#E6EBF1',
  },
  
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },

  shadows: {
    premium: '0 15px 35px 0 rgba(50,50,93,0.1), 0 5px 15px 0 rgba(0,0,0,0.07)',
    floating: '0 50px 100px -20px rgba(50,50,93,0.25), 0 30px 60px -30px rgba(0,0,0,0.3)',
  }
} as const;
