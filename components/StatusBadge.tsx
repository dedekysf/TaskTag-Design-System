import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';

export interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const theme = useTheme<Theme>();
  
  const normalizedStatus = status.toLowerCase();
  
  let bgColor = theme.colors.grey02;
  let textColor = theme.colors.grey05;

  if (normalizedStatus === 'active' || normalizedStatus === 'approved') {
    bgColor = theme.colors.lightMint;
    textColor = theme.colors.secondaryGreen;
  } else if (normalizedStatus === 'pending' || normalizedStatus === 'in progress') {
    bgColor = theme.colors.pastelOrange;
    textColor = theme.colors.orange;
  } else if (normalizedStatus === 'disabled' || normalizedStatus === 'rejected') {
    bgColor = theme.colors.lightPink;
    textColor = theme.colors.alertRed;
  }

  return (
    <Box 
      paddingHorizontal="sm"
      paddingVertical="xs"
      borderRadius="full"
      style={{ backgroundColor: bgColor }}
      alignSelf="flex-start"
    >
      <Text 
        fontSize={11} 
        fontWeight="700" 
        style={{ color: textColor }}
      >
        {status.toUpperCase()}
      </Text>
    </Box>
  );
}
