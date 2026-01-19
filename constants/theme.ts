/**
 * TaskTag Design System - Restyle Theme
 * 
 * This theme is adapted from the TaskTag Design System repository
 * (https://github.com/dedekysf/Tasktagdesignsystem) for use with React Native
 * and Shopify Restyle.
 * 
 * Original design system uses CSS variables, which have been converted to
 * Restyle theme tokens for React Native compatibility.
 */

import { createTheme } from '@shopify/restyle';

const palette = {
  // Brand Colors
  brandGreen: '#00d9a5',
  secondaryGreen: '#18a87d',
  darkGreen: '#035b60',
  vividYellow: '#fbbd42',
  alertRed: '#ff4444',

  // Text Colors
  textPrimary: '#0a1629',
  textSecondary: '#303742',
  textSecondary70: 'rgba(48, 55, 66, 0.7)',

  // Pastel Colors
  pastelBlue: '#1572a1',
  pastelPurple: '#655d8a',
  pastelMagenta: '#a85796',
  pastelOrange: '#cc7351',
  pastelYellow: '#e6b566',
  brightYellow: '#fbe676',

  // Light Background Colors
  lightPeach: '#ffece6',
  lightPurple: '#f2def3',
  lightLavender: '#f6eaf8',
  lightLavenderBlue: '#ebe7ff',
  lightMint: '#dcf2ec',
  lightSky: '#dceeff',
  lightPink: '#ffdada',
  lightCream: '#fdf4e0',

  // Neutrals
  white: '#ffffff',
  grey01: '#fafbfc',
  grey02: '#f7f8fa',
  grey03: '#e8e8e8',
  grey04: '#bdbdbd',
  grey05: '#828282',
  grey06: '#303742',
  grey07: '#303742',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Vivid Colors
  blue: '#138eff',
  purple: '#7b61ff',
  lightMagenta: '#c072cd',
  darkMagenta: '#a620b2',
  orange: '#fc7f5b',

  // Transparent
  transparent: 'transparent',
};

export const theme = createTheme({
  colors: {
    // Semantic Colors
    background: palette.white,
    foreground: palette.textPrimary,
    card: palette.white,
    cardForeground: palette.textPrimary,
    popover: palette.white,
    popoverForeground: palette.textPrimary,
    primary: palette.secondaryGreen,
    primaryForeground: palette.white,
    secondary: palette.grey02,
    secondaryForeground: palette.textPrimary,
    muted: palette.grey03,
    mutedForeground: palette.textSecondary,
    accent: palette.brandGreen,
    accentForeground: palette.white,
    destructive: 'rgba(255, 68, 68, 0.1)',
    destructiveForeground: palette.alertRed,
    border: palette.grey03,
    input: palette.white,
    inputBackground: palette.white,
    ring: palette.brandGreen,

    // Brand Colors
    brandGreen: palette.brandGreen,
    secondaryGreen: palette.secondaryGreen,
    darkGreen: palette.darkGreen,
    vividYellow: palette.vividYellow,
    alertRed: palette.alertRed,

    // Text Colors
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textSecondary70: palette.textSecondary70,

    // Pastel Colors
    pastelBlue: palette.pastelBlue,
    pastelPurple: palette.pastelPurple,
    pastelMagenta: palette.pastelMagenta,
    pastelOrange: palette.pastelOrange,
    pastelYellow: palette.pastelYellow,
    brightYellow: palette.brightYellow,

    // Light Background Colors
    lightPeach: palette.lightPeach,
    lightPurple: palette.lightPurple,
    lightLavender: palette.lightLavender,
    lightLavenderBlue: palette.lightLavenderBlue,
    lightMint: palette.lightMint,
    lightSky: palette.lightSky,
    lightPink: palette.lightPink,
    lightCream: palette.lightCream,

    // Neutrals
    white: palette.white,
    grey01: palette.grey01,
    grey02: palette.grey02,
    grey03: palette.grey03,
    grey04: palette.grey04,
    grey05: palette.grey05,
    grey06: palette.grey06,
    grey07: palette.grey07,
    black: palette.black,
    overlay: palette.overlay,

    // Vivid Colors
    blue: palette.blue,
    purple: palette.purple,
    lightMagenta: palette.lightMagenta,
    darkMagenta: palette.darkMagenta,
    orange: palette.orange,

    // Chart Colors
    chart1: palette.secondaryGreen,
    chart2: palette.blue,
    chart3: palette.alertRed,
    chart4: palette.vividYellow,
    chart5: palette.purple,

    // Transparent
    transparent: palette.transparent,
  },

  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 56,
    '7xl': 64,
  },

  sizes: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 10,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 25,
      elevation: 20,
    },
  },

  borderRadii: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
    // Semantic tokens
    button: 8,
    card: 24,
  },

  textVariants: {
    defaults: {
      color: 'foreground',
      fontFamily: 'Inter_400Regular',
    },
  
    h1: {
      fontSize: 32,
      lineHeight: 36,
      fontFamily: 'Inter_600SemiBold',
    },
  
    h2: {
      fontSize: 22,
      lineHeight: 32,
      fontFamily: 'Inter_600SemiBold',
    },
  
    h3: {
      fontSize: 18,
      lineHeight: 24,
      fontFamily: 'Inter_500Medium',
    },
  
    h4: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Inter_600SemiBold',
    },
  
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Inter_400Regular',
    },
  
    label: {
      fontSize: 14,
      lineHeight: 16,
      fontFamily: 'Inter_500Medium',
    },
  
    labelEmphasized: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Inter_600SemiBold',
    },
  
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: 'Inter_400Regular',
    },
  
    button: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Inter_500Medium',
      color: 'primaryForeground',
    },
  
    link: {
      fontSize: 14,
      lineHeight: 16,
      fontFamily: 'Inter_400Regular',
      color: 'blue',
      textDecorationLine: 'underline',
    },
  
    metadata: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: 'Inter_400Regular',
      color: 'grey05',
    },
  },
  

  buttonVariants: {
    defaults: {
      borderRadius: 'button',
      paddingVertical: 'md',
      paddingHorizontal: 'lg',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 40,
    },
    primary: {
      backgroundColor: 'primary',
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: 'black',
      borderWidth: 0,
    },
    destructive: {
      backgroundColor: 'alertRed',
      borderWidth: 0,
    },
    blue: {
      backgroundColor: 'blue',
      borderWidth: 0,
    },
    outlinePrimary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'primary',
    },
    outlineSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'black',
    },
    outlineDestructive: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'alertRed',
    },
    outlineBlue: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'blue',
    },
    ghostPrimary: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    ghostSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    ghostDestructive: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    ghostBlue: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    disabled: {
      backgroundColor: 'muted',
      borderWidth: 0,
      opacity: 0.5,
    },
  },

  breakpoints: {
    phone: 0,
    tablet: 768,
  },
});

export type Theme = typeof theme;

// Legacy Colors export for backwards compatibility
export const Colors = {
  light: {
    text: palette.textPrimary,
    background: palette.white,
    tint: palette.blue,
    icon: palette.grey05,
    tabIconDefault: palette.grey05,
    tabIconSelected: palette.blue,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

// Legacy Fonts export for backwards compatibility
import { Platform } from 'react-native';

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
