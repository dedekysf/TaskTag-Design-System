import { Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { TextStyle } from 'react-native';

export interface HighlightTextProps {
  text: string;
  query: string;
  baseStyle?: TextStyle | any;
  highlightColor?: string;
}

export function HighlightText({ 
  text, 
  query, 
  baseStyle, 
  highlightColor 
}: HighlightTextProps) {
  const theme = useTheme<Theme>();
  const defaultHighlightColor = highlightColor || theme.colors.pastelYellow; // Using a theme color (or '#FFF176')

  if (!query) return <Text style={baseStyle}>{text}</Text>;
  
  const lower = text.toLowerCase();
  const lowerQ = query.toLowerCase();
  const idx = lower.indexOf(lowerQ);
  
  if (idx === -1) return <Text style={baseStyle}>{text}</Text>;
  
  return (
    <Text style={baseStyle}>
      {text.slice(0, idx)}
      <Text style={[baseStyle, { backgroundColor: defaultHighlightColor }]}>
        {text.slice(idx, idx + query.length)}
      </Text>
      {text.slice(idx + query.length)}
    </Text>
  );
}
