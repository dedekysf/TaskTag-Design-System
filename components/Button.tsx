/**
 * Button Component - TaskTag Design System
 * 
 * Refactored from React web component to React Native with Restyle
 * Original source: https://github.com/dedekysf/Tasktagdesignsystem
 * 
 * Features:
 * - Multiple variants: fill (default), outline, ghost
 * - Multiple colors: primary, secondary, destructive, blue
 * - Multiple sizes: xl, lg, md, sm, xs
 * - Disabled state support
 * - Type-safe styling with Restyle
 */

import React from 'react';
import { Pressable, PressableProps, ActivityIndicator, Platform, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';
import { Text } from './primitives';

export type ButtonVariant = 'fill' | 'outline' | 'ghost';
export type ButtonColor = 'primary' | 'secondary' | 'destructive' | 'blue';
export type ButtonSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Button variant: fill, outline, ghost */
  variant?: ButtonVariant;
  /** Button color: primary, secondary, destructive, blue */
  color?: ButtonColor;
  /** Button size: xl, lg, md, sm, xs */
  size?: ButtonSize;
  /** Button content */
  children?: React.ReactNode;
  /** Show loading indicator */
  loading?: boolean;
  /** Custom button variant from theme */
  buttonVariant?: keyof Theme['buttonVariants'];
}

// Size configurations
const sizeConfig = {
  xl: {
    paddingVertical: 'lg' as const,
    paddingHorizontal: '2xl' as const,
    gap: 'md' as const,
    minHeight: 56,
    fontSize: 18,
  },
  lg: {
    paddingVertical: 'md' as const,
    paddingHorizontal: 'xl' as const,
    gap: 'sm' as const,
    minHeight: 48,
    fontSize: 16,
  },
  md: {
    paddingVertical: 'md' as const,
    paddingHorizontal: 'lg' as const,
    gap: 'sm' as const,
    minHeight: 40,
    fontSize: 16,
  },
  sm: {
    paddingVertical: 'md' as const,
    paddingHorizontal: 'md' as const,
    gap: 'sm' as const,
    minHeight: 32,
    fontSize: 14,
  },
  xs: {
    paddingVertical: 'xs' as const,
    paddingHorizontal: 'sm' as const,
    gap: 'xs' as const,
    minHeight: 24,
    fontSize: 12,
  },
};

export function Button({
  variant = 'fill',
  color = 'primary',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  buttonVariant,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme<Theme>();
  const sizeStyle = sizeConfig[size];

  // Determine button variant based on variant and color
  const getButtonVariant = (): keyof Theme['buttonVariants'] => {
    if (buttonVariant) return buttonVariant;
    if (disabled) return 'disabled';
    
    const colorCapitalized = color.charAt(0).toUpperCase() + color.slice(1);
    
    if (variant === 'outline') {
      const variantKey = `outline${colorCapitalized}` as keyof Theme['buttonVariants'];
      if (variantKey in theme.buttonVariants) {
        return variantKey;
      }
      // Fallback to primary if variant doesn't exist
      return 'outlinePrimary';
    }
    
    if (variant === 'ghost') {
      const variantKey = `ghost${colorCapitalized}` as keyof Theme['buttonVariants'];
      if (variantKey in theme.buttonVariants) {
        return variantKey;
      }
      // Fallback to primary if variant doesn't exist
      return 'ghostPrimary';
    }
    
    // Fill variant - return color directly
    return color as keyof Theme['buttonVariants'];
  };

  // Determine text color based on variant and color
  const getTextColor = (): keyof Theme['colors'] => {
    if (disabled) return 'mutedForeground';
    
    if (variant === 'outline' || variant === 'ghost') {
      if (color === 'primary') return 'primary';
      if (color === 'secondary') return 'black';
      if (color === 'destructive') return 'alertRed';
      if (color === 'blue') return 'blue';
    }
    
    // Fill variant
    if (color === 'secondary') return 'white';
    if (color === 'destructive') return 'white';
    if (color === 'blue') return 'white';
    return 'primaryForeground'; // primary
  };

  const buttonVariantKey = getButtonVariant();
  const textColorKey = getTextColor();

  // Get variant styles from theme
  const variantStyles = theme.buttonVariants[buttonVariantKey] || theme.buttonVariants.defaults;

  // Build style object manually using theme values
  const buttonStyle: ViewStyle = {
    borderRadius: theme.borderRadii.button,
    paddingVertical: theme.spacing[sizeStyle.paddingVertical],
    paddingHorizontal: theme.spacing[sizeStyle.paddingHorizontal],
    minHeight: sizeStyle.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: theme.colors[variantStyles.backgroundColor as keyof typeof theme.colors] || theme.colors.primary,
    borderWidth: variantStyles.borderWidth ?? 0,
    ...(variantStyles.borderColor ? { 
      borderColor: theme.colors[variantStyles.borderColor as keyof typeof theme.colors] 
    } : {}),
    ...(variantStyles.opacity !== undefined ? { opacity: variantStyles.opacity } : {}),
  };

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        buttonStyle,
        {
          opacity: pressed && !disabled && !loading ? 0.7 : (buttonStyle.opacity ?? 1),
        },
        style,
      ]}
      {...rest}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'fill' && color !== 'secondary' ? '#ffffff' : undefined}
          style={{ marginRight: sizeStyle.gap === 'sm' ? 4 : sizeStyle.gap === 'md' ? 12 : 8 }}
        />
      )}
      {typeof children === 'string' ? (
        <Text
          variant="button"
          color={textColorKey}
          style={{
            fontSize: sizeStyle.fontSize,
            fontWeight: Platform.select({ ios: '500', android: '500', default: '500' }),
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
