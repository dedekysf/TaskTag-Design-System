import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Calendar, ChevronsDown, ChevronsUp, Equal } from 'lucide-react-native';
import React from 'react';

export type PriorityType = 'high' | 'medium' | 'low';

export interface PriorityBadgeProps {
  priority: PriorityType;
}

export interface DateBadgeProps {
  date: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const theme = useTheme<Theme>();
  const config = {
    high: { color: theme.colors.orange, Icon: ChevronsUp },
    medium: { color: '#f59e0b', Icon: Equal }, // Amber equivalent
    low: { color: theme.colors.secondaryGreen, Icon: ChevronsDown },
  }[priority];

  return (
    <Box 
      width={36} 
      height={36} 
      borderRadius="full" 
      alignItems="center" 
      justifyContent="center" 
      style={{ borderWidth: 1, borderColor: theme.colors.border }}
    >
      <config.Icon size={15} color={config.color} />
    </Box>
  );
}

export function DateBadge({ date }: DateBadgeProps) {
  const theme = useTheme<Theme>();
  return (
    <Box 
      flexDirection="row" 
      alignItems="center" 
      style={{ 
        gap: 6, 
        borderWidth: 1, 
        borderColor: theme.colors.border, 
        borderRadius: 40, 
        paddingHorizontal: 14, 
        paddingVertical: 8, 
        minWidth: 108 
      }}
    >
      <Calendar size={13} color={theme.colors.grey04} />
      <Text style={{ fontSize: 13, color: theme.colors.grey05 }}>{date}</Text>
    </Box>
  );
}
