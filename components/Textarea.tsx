
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, View } from 'react-native';
import { Text } from './primitives';

export type TextareaSize = 'sm' | 'md';

export interface TextareaProps extends Omit<RNTextInputProps, 'style'> {
    /** Textarea size: sm or md */
    size?: TextareaSize;
    /** Label text */
    label?: string;
    /** Error message to display */
    errorMessage?: string;
    /** Required field */
    required?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Number of visible rows (approximated by height) */
    rows?: number;
}

export function Textarea({
    size = 'md',
    label,
    errorMessage,
    value,
    onChangeText,
    maxLength = 1000,
    disabled = false,
    required = false,
    placeholder,
    rows = 4,
    ...rest
}: TextareaProps) {
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

    const sizeConfig = {
        sm: {
            padding: 8,
            fontSize: 14,
        },
        md: {
            padding: 8,
            fontSize: 16,
        },
    };

    const currentSize = sizeConfig[size];
    const lineHeight = 20; // Approx
    const minHeight = rows * lineHeight + (currentSize.padding * 2);

    const borderColor = isError
        ? theme.colors.alertRed
        : isFocused
            ? theme.colors.black
            : theme.colors.border;

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
                    borderWidth: 1,
                    borderColor: disabled ? theme.colors.grey04 : borderColor,
                    borderRadius: 8,
                    backgroundColor: disabled ? theme.colors.grey03 : theme.colors.inputBackground,
                    padding: currentSize.padding,
                }}
            >
                <RNTextInput
                    value={currentValue}
                    onChangeText={handleChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.mutedForeground}
                    editable={!disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    multiline
                    maxLength={maxLength}
                    style={{
                        fontSize: currentSize.fontSize,
                        color: disabled ? theme.colors.grey04 : theme.colors.textPrimary,
                        fontFamily: 'Inter_400Regular',
                        minHeight: minHeight,
                        textAlignVertical: 'top',
                        outline: 'none', // For web
                    } as any}
                    {...rest}
                />

                {maxLength && (
                    <Text
                        variant="caption"
                        color="grey05"
                        style={{
                            alignSelf: 'flex-end',
                            marginTop: 4,
                        }}
                    >
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
