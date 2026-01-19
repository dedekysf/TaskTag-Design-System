/**
 * Sidebar Dropdown Component
 */

import React, { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Box, Text } from './primitives';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';

interface SidebarDropdownProps {
  label: string;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function SidebarDropdown({ label, isOpen, isActive, onToggle, children }: SidebarDropdownProps) {
  const theme = useTheme<Theme>();

  return (
    <Box>
      <Pressable onPress={onToggle}>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingVertical="md"
          paddingHorizontal="md"
          marginBottom="xs"
          borderRadius="md"
          backgroundColor={isActive ? 'lightMint' : 'transparent'}
        >
          <Text
            variant="label"
            color={isActive ? 'primary' : 'textSecondary'}
            fontWeight={isActive ? '600' : '400'}
          >
            {label}
          </Text>
          <MaterialIcons
            name={isOpen ? 'keyboard-arrow-down' : 'keyboard-arrow-right'}
            size={20}
            color={isActive ? theme.colors.primary : theme.colors.textSecondary}
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
