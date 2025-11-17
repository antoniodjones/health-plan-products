/**
 * Design Tokens
 * Centralized design system values for the Health Plan Products & Benefits Platform
 * 
 * Based on:
 * - CAPS Enterprise Design System v1.0
 * - Brand Colors (Orange, Blue, Green)
 * - Apple-inspired design principles
 * 
 * Usage:
 * import { tokens } from '@/styles/tokens';
 * <div className={`p-${tokens.spacing.lg}`}>
 */

export const tokens = {
  /**
   * COLORS
   * Brand colors, semantic colors, and CAPS journey colors
   */
  colors: {
    // Current Brand Colors (MVP)
    brand: {
      orange: {
        50: '#FFF3E0',
        100: '#FFE0B2',
        200: '#FFCC80',
        300: '#FFB74D',
        400: '#FFA726',
        500: '#FF9834',  // Primary brand color
        600: '#FB8C00',
        700: '#F57C00',
        800: '#EF6C00',
        900: '#E65100',
      },
      blue: {
        50: '#E1F5FE',
        100: '#B3E5FC',
        200: '#81D4FA',
        300: '#4FC3F7',
        400: '#29B6F6',
        500: '#0EA5E9',  // Secondary brand color
        600: '#039BE5',
        700: '#0288D1',
        800: '#0277BD',
        900: '#01579B',
      },
      green: {
        50: '#E8F5E9',
        100: '#C8E6C9',
        200: '#A5D6A7',
        300: '#81C784',
        400: '#66BB6A',
        500: '#22C55E',  // Success brand color
        600: '#43A047',
        700: '#388E3C',
        800: '#2E7D32',
        900: '#1B5E20',
      },
    },

    // CAPS Journey Colors (Production Enhancement)
    journey: {
      prospect: {
        50: '#FFF3E0',
        100: '#FFE0B2',
        200: '#FFCC80',
        300: '#FFB74D',
        400: '#FFA726',
        500: '#FF9100',  // "I need health insurance"
        600: '#FB8C00',
        700: '#F57C00',
        800: '#EF6C00',
        900: '#E65100',
      },
      applicant: {
        50: '#FCE4EC',
        100: '#F8BBD0',
        200: '#F48FB1',
        300: '#F06292',
        400: '#EC407A',
        500: '#E91E63',  // "What plans are available?"
        600: '#D81B60',
        700: '#C2185B',
        800: '#AD1457',
        900: '#880E4F',
      },
      enrollment: {
        50: '#FFFDE7',
        100: '#FFF9C4',
        200: '#FFF59D',
        300: '#FFF176',
        400: '#FFEE58',
        500: '#FDD835',  // Critical conversion moment
        600: '#FBC02D',
        700: '#F9A825',
        800: '#F57F17',
        900: '#F57F17',
      },
      newMember: {
        50: '#E0F7FA',
        100: '#B2EBF2',
        200: '#80DEEA',
        300: '#4DD0E1',
        400: '#26C6DA',
        500: '#00BCD4',  // "How do I use my benefits?"
        600: '#00ACC1',
        700: '#0097A7',
        800: '#00838F',
        900: '#006064',
      },
      activating: {
        50: '#E1F5FE',
        100: '#B3E5FC',
        200: '#81D4FA',
        300: '#4FC3F7',
        400: '#29B6F6',
        500: '#0EA5E9',  // "First actions"
        600: '#039BE5',
        700: '#0288D1',
        800: '#0277BD',
        900: '#01579B',
      },
      engaged: {
        50: '#E8F5E9',
        100: '#C8E6C9',
        200: '#A5D6A7',
        300: '#81C784',
        400: '#66BB6A',
        500: '#4CAF50',  // "Active usage"
        600: '#43A047',
        700: '#388E3C',
        800: '#2E7D32',
        900: '#1B5E20',
      },
    },

    // Semantic Colors
    semantic: {
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#0EA5E9',
    },

    // Gray Scale
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },

  /**
   * TYPOGRAPHY
   * Font families, sizes, weights, line heights
   */
  typography: {
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'system-ui', 'sans-serif'],
      mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
    },

    fontSize: {
      // Display (Large page titles)
      'display-lg': {
        size: '4.5rem',    // 72px
        lineHeight: '1',
        letterSpacing: '-0.02em',
        fontWeight: '700',
      },
      'display': {
        size: '3.75rem',   // 60px
        lineHeight: '1',
        letterSpacing: '-0.02em',
        fontWeight: '700',
      },
      'display-sm': {
        size: '3rem',      // 48px
        lineHeight: '1.2',
        letterSpacing: '-0.02em',
        fontWeight: '600',
      },

      // Headings
      'heading-xl': {
        size: '2.25rem',   // 36px
        lineHeight: '1.25',
        letterSpacing: '-0.01em',
        fontWeight: '600',
      },
      'heading-lg': {
        size: '1.875rem',  // 30px
        lineHeight: '1.3',
        letterSpacing: '-0.01em',
        fontWeight: '600',
      },
      'heading-md': {
        size: '1.5rem',    // 24px
        lineHeight: '1.4',
        fontWeight: '600',
      },
      'heading-sm': {
        size: '1.25rem',   // 20px
        lineHeight: '1.5',
        fontWeight: '600',
      },

      // Body
      'body-xl': {
        size: '1.125rem',  // 18px
        lineHeight: '1.75',
        fontWeight: '400',
      },
      'body-lg': {
        size: '1rem',      // 16px
        lineHeight: '1.75',
        fontWeight: '400',
      },
      'body-md': {
        size: '0.875rem',  // 14px
        lineHeight: '1.5',
        fontWeight: '400',
      },
      'body-sm': {
        size: '0.75rem',   // 12px
        lineHeight: '1.5',
        fontWeight: '400',
      },

      // Labels
      'label-lg': {
        size: '1rem',      // 16px
        lineHeight: '1.5',
        fontWeight: '500',
      },
      'label-md': {
        size: '0.875rem',  // 14px
        lineHeight: '1.5',
        fontWeight: '500',
      },
      'label-sm': {
        size: '0.75rem',   // 12px
        lineHeight: '1.5',
        fontWeight: '500',
      },
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

  /**
   * SPACING
   * Consistent spacing scale based on 4px base unit
   */
  spacing: {
    '0': '0',
    'px': '1px',
    '0.5': '0.125rem',  // 2px
    '1': '0.25rem',     // 4px
    '1.5': '0.375rem',  // 6px
    '2': '0.5rem',      // 8px
    '2.5': '0.625rem',  // 10px
    '3': '0.75rem',     // 12px
    '3.5': '0.875rem',  // 14px
    '4': '1rem',        // 16px
    '5': '1.25rem',     // 20px
    '6': '1.5rem',      // 24px
    '7': '1.75rem',     // 28px
    '8': '2rem',        // 32px
    '9': '2.25rem',     // 36px
    '10': '2.5rem',     // 40px
    '11': '2.75rem',    // 44px
    '12': '3rem',       // 48px
    '14': '3.5rem',     // 56px
    '16': '4rem',       // 64px
    '20': '5rem',       // 80px
    '24': '6rem',       // 96px
    '28': '7rem',       // 112px
    '32': '8rem',       // 128px
  },

  /**
   * COMPONENT SPACING
   * Standardized spacing for specific components
   */
  componentSpacing: {
    page: {
      padding: '1.5rem',  // p-6
      gap: '1.5rem',      // space-y-6
    },
    card: {
      padding: '1.5rem',  // p-6 (STANDARDIZED)
      gap: '1rem',        // space-y-4
    },
    modal: {
      padding: '1.5rem',  // p-6
      gap: '1.5rem',      // space-y-6
    },
    form: {
      fieldGap: '1rem',   // space-y-4
      labelGap: '0.5rem', // space-y-2
    },
    button: {
      paddingX: '1rem',   // px-4
      paddingY: '0.5rem', // py-2
      gap: '0.5rem',      // gap-2 (for icon + text)
    },
    grid: {
      gap: '1rem',        // gap-4
    },
  },

  /**
   * BORDERS
   * Border widths, radius, and colors
   */
  borders: {
    width: {
      none: '0',
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
    radius: {
      none: '0',
      sm: 'calc(0.5rem - 4px)',  // 4px
      md: 'calc(0.5rem - 2px)',  // 6px
      lg: '0.5rem',              // 8px
      xl: '0.75rem',             // 12px
      '2xl': '1rem',             // 16px
      full: '9999px',
    },
    color: {
      default: '#E5E7EB',  // gray-200
      muted: '#F3F4F6',    // gray-100
      strong: '#D1D5DB',   // gray-300
    },
  },

  /**
   * SHADOWS
   * Elevation levels for depth
   */
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  /**
   * ANIMATION
   * Durations, easing functions, and keyframes
   */
  animation: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    keyframes: {
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      slideUp: {
        from: { transform: 'translateY(10px)', opacity: 0 },
        to: { transform: 'translateY(0)', opacity: 1 },
      },
      slideDown: {
        from: { transform: 'translateY(-10px)', opacity: 0 },
        to: { transform: 'translateY(0)', opacity: 1 },
      },
      scaleIn: {
        from: { transform: 'scale(0.95)', opacity: 0 },
        to: { transform: 'scale(1)', opacity: 1 },
      },
      spin: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
      },
    },
  },

  /**
   * BREAKPOINTS
   * Responsive design breakpoints
   */
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  /**
   * Z-INDEX
   * Layering system
   */
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 9999,
  },

  /**
   * OPACITY
   * Standard opacity values
   */
  opacity: {
    0: '0',
    5: '0.05',
    10: '0.1',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1',
  },
} as const;

/**
 * Type exports for TypeScript autocomplete
 */
export type ColorToken = keyof typeof tokens.colors;
export type SpacingToken = keyof typeof tokens.spacing;
export type FontSizeToken = keyof typeof tokens.typography.fontSize;
export type FontWeightToken = keyof typeof tokens.typography.fontWeight;
export type BorderRadiusToken = keyof typeof tokens.borders.radius;
export type ShadowToken = keyof typeof tokens.shadows;
export type AnimationDurationToken = keyof typeof tokens.animation.duration;
export type AnimationEasingToken = keyof typeof tokens.animation.easing;
export type BreakpointToken = keyof typeof tokens.breakpoints;
export type ZIndexToken = keyof typeof tokens.zIndex;
export type OpacityToken = keyof typeof tokens.opacity;

