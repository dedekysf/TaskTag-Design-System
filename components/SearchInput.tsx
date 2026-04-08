import { Box } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Search } from 'lucide-react-native';
import React from 'react';
import { TextInput, TextInputProps, ViewStyle } from 'react-native';

export interface SearchInputProps extends Omit<TextInputProps, 'style'> {
  style?: ViewStyle | any;
  containerStyle?: ViewStyle;
}

export function SearchInput({ style, containerStyle, ...rest }: SearchInputProps) {
  const theme = useTheme<Theme>();

  return (
    <Box 
      flexDirection="row" 
      alignItems="center" 
      backgroundColor="grey01" 
      borderRadius="lg" 
      paddingHorizontal="md"
      height={40}
      style={containerStyle}
    >
      <Search size={18} color={theme.colors.grey04} />
      <TextInput 
        placeholderTextColor={theme.colors.grey04}
        style={[
          { 
            flex: 1, 
            marginLeft: 8, 
            fontSize: 14, 
            color: theme.colors.foreground,
            outlineStyle: 'none'
          } as any,
          style
        ]}
        {...rest}
      />
    </Box>
  );
}
