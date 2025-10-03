/**
 * Design Tokens - Sistema de Diseño 2025
 * Centraliza todos los valores de diseño para consistencia
 */

export const designTokens = {
  // Colores Primarios
  colors: {
    primary: {
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
    },
    
    // Gradientes
    gradients: {
      red: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
      blue: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
      green: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
      yellow: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
      purple: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))',
      modern: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
    },
    
    // Glass Morphism
    glass: {
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.1)',
      strong: 'rgba(255, 255, 255, 0.15)',
    },
    
    // Bordes
    borders: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      strong: 'rgba(255, 255, 255, 0.3)',
    },
  },
  
  // Espaciado
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  // Border Radius
  borderRadius: {
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
  },
  
  // Sombras
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(255, 255, 255, 0.3)',
  },
  
  // Blur Effects
  blur: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
  },
  
  // Animaciones
  animations: {
    duration: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.6s',
      slower: '1s',
    },
    
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    
    spring: {
      gentle: { type: 'spring', stiffness: 300, damping: 30 },
      bouncy: { type: 'spring', stiffness: 400, damping: 25 },
      stiff: { type: 'spring', stiffness: 500, damping: 30 },
    },
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-Index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

// Utilidades para generar estilos dinámicos
export const createGlassMorphism = (opacity: number = 0.05) => ({
  background: `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: designTokens.shadows.glass,
});

export const createGlow = (color: string, intensity: number = 0.3) => ({
  boxShadow: `0 0 20px ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`,
});

export const createGradient = (color1: string, color2: string, opacity: number = 0.2) => ({
  background: `linear-gradient(135deg, ${color1}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, ${color2}${Math.round(opacity * 0.5 * 255).toString(16).padStart(2, '0')})`,
});

// Configuraciones predefinidas para componentes comunes
export const componentConfigs = {
  card: {
    className: 'glass-morphism rounded-2xl p-6 hover-lift',
    animation: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
    },
  },
  
  button: {
    className: 'glass-morphism hover-glow px-6 py-3 rounded-xl transition-all duration-300',
    animation: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: designTokens.animations.spring.gentle,
    },
  },
  
  tab: {
    className: 'relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 cursor-pointer group',
    animation: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    },
  },
} as const;

export default designTokens;
