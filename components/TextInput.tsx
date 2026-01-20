
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { LucideIcon, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, TouchableOpacity, View } from 'react-native';
import { Text } from './primitives';

export type TextInputSize = 'sm' | 'md';

export interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
    /** Input size: sm or md */
    size?: TextInputSize;
    /** Label text */
    label?: string;
    /** Error message to display */
    errorMessage?: string;
    /** Icon component from lucide-react-native */
    icon?: LucideIcon;
    /** Show clear button (X icon) when input has value */
    showClearButton?: boolean;
    /** Show character counter (only works when no icon) */
    showCounter?: boolean;
    /** Change handler with text */
    onChangeText?: (text: string) => void;
    /** Required field */
    required?: boolean;
    /** Disabled state */
    disabled?: boolean;
}

export function TextInput({
    size = 'md',
    label,
    errorMessage,
    icon: Icon,
    showClearButton = true,
    showCounter = false,
    onChangeText,
    value,
    maxLength,
    disabled = false,
    required = false,
    placeholder,
    ...rest
}: TextInputProps) {
    const theme = useTheme<Theme>();
    const [internalValue, setInternalValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const currentValue = value !== undefined ? value : internalValue;
    const isError = !!errorMessage;

    const handleChangeText = (text: string) => {
        if (onChangeText) {
            onChangeText(text);
        } else {
            setInternalValue(text);
        }
    };

    const handleClear = () => {
        handleChangeText('');
    };

    const sizeConfig = {
        sm: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            fontSize: 14,
            height: 32,
            iconSize: 16,
        },
        md: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            fontSize: 16,
            height: 48, // Adjusted to match source variable md which is usually 48 or 40. Source logic used var(--size-md) which is 40px in my theme. Wait source says height: var(--size-md) for md.
            iconSize: 18,
        },
    };

    // Correction: theme.ts defines sm:32, md:40. So height should be 40 for md.
    const correctedSizeConfig = {
        ...sizeConfig,
        md: { ...sizeConfig.md, height: 40 }
    }

    const currentSize = correctedSizeConfig[size];

    const borderColor = isError
        ? theme.colors.alertRed
        : isFocused
            ? theme.colors.black
            : theme.colors.border;

    const shouldShowClearButton = showClearButton && currentValue.length > 0 && !disabled;

    return (
        <View style={{ width: '100%', marginBottom: 16 }}>
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

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: disabled ? theme.colors.grey04 : borderColor,
                    borderRadius: 8,
                    backgroundColor: disabled ? theme.colors.grey03 : theme.colors.inputBackground,
                    minHeight: currentSize.height,
                    paddingHorizontal: currentSize.paddingHorizontal,
                }}
            >
                {Icon && (
                    <View style={{ marginRight: 8 }}>
                        <Icon
                            size={currentSize.iconSize}
                            color={disabled ? theme.colors.grey04 : theme.colors.grey05}
                        />
                    </View>
                )}

                <RNTextInput
                    value={currentValue}
                    onChangeText={handleChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.mutedForeground}
                    editable={!disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    maxLength={maxLength}
                    style={{
                        flex: 1,
                        paddingVertical: currentSize.paddingVertical,
                        fontSize: currentSize.fontSize,
                        color: disabled ? theme.colors.grey04 : theme.colors.textPrimary,
                        fontFamily: 'Inter_400Regular',
                        height: '100%', // Ensure it fills container height logic
                        outline: 'none', // For web
                    } as any}
                    {...rest}
                />

                {shouldShowClearButton && (
                    <TouchableOpacity onPress={handleClear} disabled={disabled} style={{ marginLeft: 8 }}>
                        <X size={currentSize.iconSize} color={theme.colors.grey05} />
                    </TouchableOpacity>
                )}

                {/* Counter - simplified placement */}
                {!Icon && maxLength && showCounter && (
                    <Text variant="caption" color="grey05" style={{ marginLeft: 8 }}>
                        {maxLength - currentValue.length}
                    </Text>
                )}
            </View>

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
