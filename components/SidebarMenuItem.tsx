/**
 * Sidebar Menu Item Component
 */

import React from 'react';
import { Pressable } from 'react-native';
import { Box, Text } from './primitives';

interface SidebarMenuItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function SidebarMenuItem({ label, isActive, onClick }: SidebarMenuItemProps) {
  return (
    <Pressable onPress={onClick}>
      <Box
        paddingVertical="sm"
        paddingHorizontal="md"
        marginBottom="xs"
        borderRadius="md"
        backgroundColor={isActive ? 'lightMint' : 'transparent'}
      >
        <Text
          variant="caption"
          color={isActive ? 'primary' : 'textSecondary'}
          fontWeight={isActive ? '600' : '400'}
        >
          {label}
        </Text>
      </Box>
    </Pressable>
  );
}
