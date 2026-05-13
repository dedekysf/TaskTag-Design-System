import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { Text } from './primitives';
import { ChevronDown, LucideIcon } from 'lucide-react-native';

export type FormSelectSize = 'sm' | 'md' | 'lg';

export interface FormSelectProps {
  /** Input size: sm or md */
  size?: FormSelectSize;
  /** Label text */
  label?: string;
  /** The selected value text to display */
  value: string;
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Error message to display */
  errorMessage?: string;
  /** Required field */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Called when the select is pressed */
  onPress: () => void;
  /** Custom icon component on the left */
  leftIcon?: React.ReactNode;
  /** Whether to show the chevron icon on the right */
  showChevron?: boolean;
  /** Custom style to override container */
  style?: ViewStyle;
}

export function FormSelect({
  size = 'md',
  label,
  value,
  placeholder = 'Select an option',
  errorMessage,
  required = false,
  disabled = false,
  onPress,
  leftIcon,
  showChevron = true,
  style,
}: FormSelectProps) {
  const theme = useTheme<Theme>();
  const [isFocused, setIsFocused] = useState(false);

  const isError = !!errorMessage;

  const sizeConfig = {
    sm: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      fontSize: 14,
      height: 32,
    },
    md: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      height: 40,
    },
    lg: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      height: 48,
    },
  };

  const currentSize = sizeConfig[size];

  const borderColor = isError
    ? theme.colors.alertRed
    : isFocused
    ? theme.colors.black
    : theme.colors.border;

  return (
    <View style={{ width: '100%' }}>
      {label && (
        <Text
          variant="labelMedium"
          style={{
            marginBottom: 8,
            color: isError ? theme.colors.alertRed : theme.colors.textPrimary,
          }}
        >
          {label}
          {required && <Text style={{ color: theme.colors.alertRed }}> *</Text>}
        </Text>
      )}

      <Pressable
        disabled={disabled}
        onPress={onPress}
        onHoverIn={() => setIsFocused(true)}
        onHoverOut={() => setIsFocused(false)}
        style={({ pressed }) => [
          {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: disabled ? theme.colors.grey04 : borderColor,
            borderRadius: 8,
            backgroundColor: disabled ? theme.colors.grey03 : theme.colors.inputBackground || theme.colors.white,
            minHeight: currentSize.height,
            paddingHorizontal: currentSize.paddingHorizontal,
            opacity: pressed && !disabled ? 0.7 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
          } as ViewStyle,
          style,
        ]}
      >
        {leftIcon && (
          <View style={{ marginRight: 8 }}>
            {leftIcon}
          </View>
        )}

        <Text
          style={{
            flex: 1,
            fontSize: currentSize.fontSize,
            color: !value ? theme.colors.grey04 : disabled ? theme.colors.grey04 : theme.colors.textPrimary,
            fontFamily: 'Inter_400Regular',
          }}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>

        {showChevron && (
          <View style={{ marginLeft: 8 }}>
            <ChevronDown size={16} color={disabled ? theme.colors.grey04 : theme.colors.grey05} />
          </View>
        )}
      </Pressable>

      {errorMessage && (
        <Text
          variant="label"
          style={{
            marginTop: 4,
            color: theme.colors.alertRed,
          }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}
