/**
 * Button Component - TaskTag Design System
 * 
 * Refactored from React web component to React Native with Restyle
 * Source: https://github.com/dedekysf/Tasktagdesignsystem/blob/main/src/components/Button.tsx
 */

import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { ActivityIndicator, Platform, Pressable, PressableProps, ViewStyle } from 'react-native';
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
  /** Custom button variant from theme (overrides standard logic) */
  isIconOnly?: boolean;
  /** Custom button variant from theme (overrides standard logic) */
  buttonVariant?: keyof Theme['buttonVariants'];
  /** Custom style */
  style?: ViewStyle;
}

// Size configurations matching source CSS variables
const sizeConfig = {
  xl: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
    minHeight: 56,
    iconSize: 56, // For icon only
    fontSize: 18,
    borderRadius: 8,
  },
  lg: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
    minHeight: 48,
    iconSize: 48,
    fontSize: 16,
    borderRadius: 8,
  },
  md: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
    minHeight: 40,
    iconSize: 40,
    fontSize: 16,
    borderRadius: 8,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    minHeight: 32,
    iconSize: 32,
    fontSize: 14,
    borderRadius: 8,
  },
  xs: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
    minHeight: 24,
    iconSize: 24,
    fontSize: 12,
    borderRadius: 8,
  },
};

export function Button({
  variant = 'fill',
  color = 'primary',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  isIconOnly = false,
  buttonVariant,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme<Theme>();
  const [isHovered, setIsHovered] = React.useState(false);
  const sizeStyle = sizeConfig[size];

  // Determine button styles based on variant and color
  const getButtonStyles = (): ViewStyle => {
    if (buttonVariant) {
      const styles = theme.buttonVariants[buttonVariant] as any;
      return {
        backgroundColor: theme.colors[styles.backgroundColor as keyof Theme['colors']] || styles.backgroundColor,
      };
    }

    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: sizeStyle.borderRadius,
      paddingVertical: isIconOnly ? 0 : sizeStyle.paddingVertical,
      paddingHorizontal: isIconOnly ? 0 : sizeStyle.paddingHorizontal,
      minHeight: sizeStyle.minHeight,
      minWidth: isIconOnly ? sizeStyle.iconSize : 0,
      // Force square if icon only
      ...(isIconOnly ? { width: sizeStyle.iconSize, height: sizeStyle.iconSize } : {}),
    };

    if (disabled) {
      if (variant === 'fill') return { ...baseStyle, backgroundColor: theme.colors.grey03 };
      if (variant === 'outline') return { ...baseStyle, backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.grey03 };
      if (variant === 'ghost') return { ...baseStyle, backgroundColor: 'transparent' };
      return baseStyle;
    }

    if (variant === 'fill') {
      if (color === 'primary') return { ...baseStyle, backgroundColor: theme.colors.primary };
      if (color === 'secondary') return { ...baseStyle, backgroundColor: theme.colors.black };
      if (color === 'destructive') return { ...baseStyle, backgroundColor: theme.colors.alertRed };
      if (color === 'blue') return { ...baseStyle, backgroundColor: theme.colors.blue };
    }

    const getHoverBackgroundColor = () => {
      if (color === 'primary') return theme.colors.lightMint;
      if (color === 'secondary') return 'rgba(0, 0, 0, 0.08)';
      if (color === 'destructive') return theme.colors.lightPink; // mapped from theme
      if (color === 'blue') return theme.colors.lightSky;
      return theme.colors.grey02;
    };

    if (variant === 'outline') {
      const bg = (isHovered && !disabled) ? getHoverBackgroundColor() : 'transparent';
      const outlineBase = { ...baseStyle, backgroundColor: bg, borderWidth: 1 };
      if (color === 'primary') return { ...outlineBase, borderColor: theme.colors.primary };
      if (color === 'secondary') return { ...outlineBase, borderColor: theme.colors.black };
      if (color === 'destructive') return { ...outlineBase, borderColor: theme.colors.alertRed };
      if (color === 'blue') return { ...outlineBase, borderColor: theme.colors.blue };
    }

    if (variant === 'ghost') {
      const bg = (isHovered && !disabled) ? getHoverBackgroundColor() : 'transparent';
      return { ...baseStyle, backgroundColor: bg };
    }

    return { ...baseStyle, backgroundColor: theme.colors.primary };
  };

  const getTextColor = (): string => {
    if (disabled) return theme.colors.grey05;

    if (variant === 'fill') {
      if (color === 'secondary') return theme.colors.white;
      if (color === 'destructive') return theme.colors.white;
      if (color === 'blue') return theme.colors.white;
      return theme.colors.primaryForeground;
    }

    // Outline and Ghost
    if (color === 'primary') return theme.colors.primary;
    if (color === 'secondary') return theme.colors.black;
    if (color === 'destructive') return theme.colors.alertRed;
    if (color === 'blue') return theme.colors.blue;

    return theme.colors.primary;
  };

  const buttonStyle = getButtonStyles();
  const textColor = getTextColor();

  return (
    <Pressable
      disabled={disabled || loading}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        buttonStyle,
        {
          opacity: pressed && !disabled && !loading ? 0.7 : (isHovered && variant === 'fill' ? 0.9 : 1),
          transform: [{ scale: pressed && !disabled && !loading ? 0.98 : 1 }],
        },
        style,
        Platform.OS === 'web' && ({ cursor: disabled || loading ? 'not-allowed' : 'pointer' } as any),
      ]}
      {...rest}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={{ marginRight: sizeStyle.gap }}
        />
      )}
      {typeof children === 'string' ? (
        <Text
          variant="button"
          style={{
            color: textColor,
            fontSize: sizeStyle.fontSize,
            fontWeight: '500', // var(--font-weight-medium)
            gap: sizeStyle.gap,
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
