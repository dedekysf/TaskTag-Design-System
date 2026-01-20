
import { createTheme } from '@shopify/restyle';

// Brand Colors
const brand = {
  brandGreen: '#00d9a5',
  secondaryGreen: '#18a87d',
  darkGreen: '#035b60',
  vividYellow: '#fbbd42',
  alertRed: '#ff4444',
};

// Text Colors
const textColors = {
  textPrimary: '#0a1629',
  textSecondary: '#303742',
};

// Pastel Colors
const pastel = {
  pastelBlue: '#1572a1',
  pastelPurple: '#655d8a',
  pastelMagenta: '#a85796',
  pastelOrange: '#cc7351',
  pastelYellow: '#e6b566',
  brightYellow: '#fbe676',
};

// Light Background Colors
const lightBackground = {
  lightPeach: '#ffece6',
  lightPurple: '#f2def3',
  lightLavender: '#f6eaf8',
  lightLavenderBlue: '#ebe7ff',
  lightMint: '#dcf2ec',
  lightSky: '#dceeff',
  lightPink: '#ffdada',
  lightCream: '#fdf4e0',
};

// Neutrals
const neutrals = {
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
};

// Vivid Colors
const vivid = {
  blue: '#138eff',
  purple: '#7b61ff',
  lightMagenta: '#c072cd',
  darkMagenta: '#a620b2',
  orange: '#fc7f5b',
};

// Semantic Colors
const semantic = {
  background: neutrals.white,
  foreground: textColors.textPrimary,
  card: neutrals.white,
  cardForeground: textColors.textPrimary,
  popover: neutrals.white,
  popoverForeground: textColors.textPrimary,
  primary: brand.secondaryGreen,
  primaryForeground: neutrals.white,
  secondary: neutrals.grey02,
  secondaryForeground: textColors.textPrimary,
  muted: neutrals.grey03,
  mutedForeground: textColors.textSecondary,
  accent: brand.brandGreen,
  accentForeground: neutrals.white,
  destructive: 'rgba(255, 68, 68, 0.1)',
  destructiveForeground: brand.alertRed,
  border: neutrals.grey03,
  input: neutrals.white,
  inputBackground: neutrals.white,
  ring: brand.brandGreen,

  // Sidebar
  sidebar: neutrals.grey02,
  sidebarForeground: textColors.textSecondary,
  sidebarPrimary: 'rgba(0, 217, 165, 0.1)',
  sidebarPrimaryForeground: brand.brandGreen,
  sidebarAccent: brand.brandGreen,
  sidebarAccentForeground: neutrals.white,
  sidebarBorder: neutrals.grey03,
  sidebarRing: brand.brandGreen,

  // Chart
  chart1: brand.secondaryGreen,
  chart2: vivid.blue,
  chart3: brand.alertRed,
  chart4: brand.vividYellow,
  chart5: vivid.purple,
};

const colors = {
  ...brand,
  ...textColors,
  ...pastel,
  ...lightBackground,
  ...neutrals,
  ...vivid,
  ...semantic,
  transparent: 'transparent',
};

const spacing = {
  '0': 0,
  '4': 4,
  '8': 8,
  '12': 12,
  '16': 16,
  '20': 20,
  '24': 24,
  '32': 32,
  '36': 36,
  '40': 40,
  '48': 48,
  '56': 56,
  '64': 64,
  '80': 80,
  '96': 96,
  '128': 128,
  'xs': 4,
  'sm': 8,
  'md': 16,
  'lg': 24,
  'xl': 32,
  '2xl': 40,
  '3xl': 48,
};

const borderRadii = {
  none: 0,
  '2': 2,
  '4': 4,
  '8': 8,
  '12': 12,
  '16': 16,
  '20': 20,
  '24': 24,
  full: 9999,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  button: 8,
  card: 24,
  // Keeping these for backward compatibility if used elsewhere, but they map to the new values
  s: 4,
  m: 8,
  l: 16,
};

// Component Sizes
const componentSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
};

export const theme = createTheme({
  colors,
  spacing,
  borderRadii,
  breakpoints: {
    phone: 0,
    tablet: 768,
    largeTablet: 1024,
    desktop: 1280,
  },
  textVariants: {
    defaults: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Inter_400Regular',
      color: 'foreground',
    },
    h1: {
      fontSize: 32,
      fontWeight: '600',
      lineHeight: 48, // 1.5 * 32
      fontFamily: 'Inter_600SemiBold',
      color: 'foreground',
    },
    h2: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 33, // 1.5 * 22
      fontFamily: 'Inter_600SemiBold',
      color: 'foreground',
    },
    h3: {
      fontSize: 18,
      fontWeight: '500', // Medium
      lineHeight: 27, // 1.5 * 18
      fontFamily: 'Inter_500Medium',
      color: 'foreground',
    },
    h4: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
      fontFamily: 'Inter_600SemiBold',
      color: 'foreground',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'Inter_400Regular',
      color: 'foreground',
    },
    label: {
      fontSize: 14,
      fontWeight: '500', // Medium in CSS
      lineHeight: 21,
      fontFamily: 'Inter_500Medium',
      color: 'foreground',
    },
    labelMedium: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 21,
      fontFamily: 'Inter_500Medium',
      color: 'foreground',
    },
    button: {
      fontSize: 16,
      fontWeight: '500', // Medium in CSS
      lineHeight: 24,
      fontFamily: 'Inter_500Medium',
      color: 'foreground',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
      fontFamily: 'Inter_400Regular',
      color: 'mutedForeground', // Updated from grey05 in CSS .text-metadata
    },
    // Web Variants explicitly matched
    webHeading32: {
      fontSize: 32,
      fontWeight: '600',
      lineHeight: 36,
      fontFamily: 'Inter_600SemiBold',
      color: 'foreground',
    },
    webHeading22: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 32,
      fontFamily: 'Inter_600SemiBold',
      color: 'foreground',
    },
    webLargeLabel: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
      fontFamily: 'Inter_500Medium',
      color: 'foreground',
    },
    webLabelEmphasized: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
      fontFamily: 'Inter_600SemiBold',
      color: 'foreground',
    },
    webButton: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      fontFamily: 'Inter_500Medium',
      color: 'foreground',
    },
    webLabelSmall: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 16,
      fontFamily: 'Inter_500Medium',
      color: 'foreground',
    },
    webBody: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      fontFamily: 'Inter_400Regular',
      color: 'foreground',
    },
    webEmphasizedBody: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
      fontFamily: 'Inter_600SemiBold',
      color: 'foreground',
    },
    webLink: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 16,
      fontFamily: 'Inter_400Regular',
      color: 'blue',
      textDecorationLine: 'underline',
    },
    webSecondaryBody: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 16,
      fontFamily: 'Inter_400Regular',
      color: 'foreground',
    },
    webMetadataPrimary: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      fontFamily: 'Inter_400Regular',
      color: 'mutedForeground',
    },
    webMetadataSecondary: {
      fontSize: 10,
      fontWeight: '500',
      lineHeight: 12,
      fontFamily: 'Inter_500Medium',
      color: 'mutedForeground',
    },
    // Mobile Variants explicitly matched
    mobileHeading28: {
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 32,
      fontFamily: 'Inter_600SemiBold',
      color: 'foreground',
    },
    mobileHeading22: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 32,
      fontFamily: 'Inter_600SemiBold',
      color: 'foreground',
    },
    mobileLargeLabel: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
      fontFamily: 'Inter_500Medium',
      color: 'foreground',
    },
    mobileLabelEmphasized: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 21,
      fontFamily: 'Inter_600SemiBold',
      color: 'foreground',
    },
    mobileButton: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 21,
      fontFamily: 'Inter_400Regular',
      color: 'foreground',
    },
    mobileLabelSmall: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 16,
      fontFamily: 'Inter_500Medium',
      color: 'foreground',
    },
    mobileBody: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 21,
      fontFamily: 'Inter_400Regular',
      color: 'foreground',
    },
    mobileLink: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 16,
      fontFamily: 'Inter_400Regular',
      color: 'blue',
      textDecorationLine: 'underline',
    },
    mobileSecondaryBody: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 16,
      fontFamily: 'Inter_400Regular',
      color: 'foreground',
      letterSpacing: 0.28,
    },
    mobileMetadataPrimary: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      fontFamily: 'Inter_400Regular',
      color: 'mutedForeground',
    },
    mobileMetadataSecondary: {
      fontSize: 10,
      fontWeight: '500',
      lineHeight: 12,
      fontFamily: 'Inter_500Medium',
      color: 'mutedForeground',
    },
  },
  buttonVariants: {
    defaults: {
      backgroundColor: 'primary',
      paddingVertical: 'md',
      paddingHorizontal: 'lg',
      borderRadius: 'button',
    },
    primary: {
      backgroundColor: 'primary',
    },
    secondary: {
      backgroundColor: 'black', // CSS .btn-secondary
    },
    destructive: {
      backgroundColor: 'alertRed', // CSS .btn-destructive
    },
    blue: {
      backgroundColor: 'blue',
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
    },
    ghostSecondary: {
      backgroundColor: 'transparent',
    },
    ghostDestructive: {
      backgroundColor: 'transparent',
    },
    ghostBlue: {
      backgroundColor: 'transparent',
    },
    disabled: {
      backgroundColor: 'muted',
      opacity: 0.5,
    },
  },
  cardVariants: {
    defaults: {
      backgroundColor: 'card',
      borderRadius: 'card',
      padding: '16',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
  },
  inputVariants: {
    defaults: {
      backgroundColor: 'inputBackground',
      borderWidth: 1,
      borderColor: 'border',
      borderRadius: '8', // string key
      paddingHorizontal: '12',
      paddingVertical: '8',
    },
    focused: {
      borderColor: 'black',
    },
    error: {
      borderColor: 'alertRed',
    },
  },
  zIndices: {
    '10': 10,
    '20': 20,
    '30': 30,
    '40': 40,
    '50': 50,
  },
  componentSizes,
});

export type Theme = typeof theme;
