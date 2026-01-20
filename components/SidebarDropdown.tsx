/**
 * Sidebar Dropdown Component
 */

import { Theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import React, { ReactNode, useState } from 'react';
import { Pressable } from 'react-native';
import { Box, Text } from './primitives';

interface SidebarDropdownProps {
  label: string;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function SidebarDropdown({ label, isOpen, isActive, onToggle, children }: SidebarDropdownProps) {
  const theme = useTheme<Theme>();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box>
      <Pressable
        onPress={onToggle}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingVertical="md"
          paddingHorizontal="md"
          marginBottom="xs"
          borderRadius="m"
          backgroundColor={isActive || isHovered ? 'grey02' : 'transparent'}
        >
          <Text
            variant="webLabelEmphasized"
            color="textPrimary"
            fontWeight="400"
          >
            {label}
          </Text>
          <MaterialIcons
            name={isOpen ? 'keyboard-arrow-down' : 'keyboard-arrow-right'}
            size={20}
            color={theme.colors.textPrimary}
          />
        </Box>
      </Pressable>

      {isOpen && (
        <Box marginLeft="md" marginBottom="xs">
          {children}
        </Box>
      )}
    </Box>
  );
}
