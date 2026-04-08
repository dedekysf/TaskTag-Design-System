import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';
export type AvatarType = 'photo' | 'text' | 'icon';

export interface AvatarProps {
  size?: AvatarSize;
  type?: AvatarType;
  src?: ImageSourcePropType | string | null;
  initials?: string;
  icon?: LucideIcon;
  color?: keyof Theme['colors'] | string; // Can be a theme color name or hash
}

const sizeConfig = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
};

export function Avatar({ 
  size = 'md', 
  type = 'photo', 
  src, 
  initials, 
  icon: IconComp,
  color = 'grey03' 
}: AvatarProps) {
  const theme = useTheme<Theme>();
  const numericSize = sizeConfig[size];
  
  // Resolve color dynamically
  const resolvedColor = Object.keys(theme.colors).includes(color as string) 
    ? theme.colors[color as keyof Theme['colors']] 
    : color;

  if (type === 'photo' && src) {
    const tempSrc = typeof src === 'string' ? { uri: src } : src;
    return (
      <Image 
        source={tempSrc} 
        style={{ 
          width: numericSize, 
          height: numericSize, 
          borderRadius: numericSize / 2,
          borderWidth: 1, 
          borderColor: theme.colors.border
        }} 
      />
    );
  }

  // Base circle rendering for text and icon
  return (
    <Box 
      width={numericSize} 
      height={numericSize} 
      borderRadius="full" 
      alignItems="center" 
      justifyContent="center" 
      style={{ backgroundColor: resolvedColor }}
    >
      {type === 'icon' && IconComp ? (
         <IconComp size={numericSize * 0.5} color={theme.colors.white} />
      ) : (
        <Text 
          style={{ 
            color: theme.colors.white, 
            fontWeight: '700', 
            fontSize: numericSize * 0.35 
          }}
        >
          {initials?.toUpperCase() || ''}
        </Text>
      )}
    </Box>
  );
}
