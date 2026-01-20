/**
 * Sidebar Menu Item Component
 */

import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Box, Text } from './primitives';

interface SidebarMenuItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function SidebarMenuItem({ label, isActive, onClick }: SidebarMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const showActiveColor = isActive || isHovered;

  return (
    <Pressable
      onPress={onClick}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <Box
        paddingVertical="sm"
        paddingHorizontal="md"
        marginBottom="xs"
        borderRadius="m"
        backgroundColor="transparent"
      >
        <Text
          variant="webSecondaryBody"
          color={showActiveColor ? 'secondaryGreen' : 'textSecondary'}
          fontWeight="400"
        >
          {label}
        </Text>
      </Box>
    </Pressable>
  );
}
