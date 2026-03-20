/**
 * ChatHeader Component
 */

import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Box, Text } from './primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Maximize2, MoreVertical, X } from 'lucide-react-native';

export function ChatHeader() {
  const theme = useTheme<Theme>();

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      paddingHorizontal="lg"
      paddingVertical="md"
      backgroundColor="background"
      borderBottomWidth={1}
      borderBottomColor="border"
      height={72}
    >
      <Box flexDirection="row" alignItems="center" gap="md">
        {/* Avatar */}
        <Box
          width={40}
          height={40}
          borderRadius="full"
          backgroundColor="orange"
          alignItems="center"
          justifyContent="center"
        >
          <Text variant="label" color="white" fontWeight="600">
            DY
          </Text>
        </Box>
        <Text variant="h3" color="textPrimary" fontWeight="600">
          dedek yusuf15
        </Text>
      </Box>

      <Box flexDirection="row" alignItems="center" gap="lg">
        <Pressable>
          <Maximize2 size={20} color={theme.colors.textSecondary} />
        </Pressable>
        <Pressable>
          <MoreVertical size={20} color={theme.colors.textSecondary} />
        </Pressable>
        <Pressable>
          <X size={24} color={theme.colors.textSecondary} />
        </Pressable>
      </Box>
    </Box>
  );
}
