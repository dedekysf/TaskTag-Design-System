import React from 'react';
import { ScrollView, View } from 'react-native';
import { Box, Text } from '@/components/primitives';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';

export default function ElevationScreen() {
  const theme = useTheme<Theme>();

  const elevations = [
    { key: 'sm', label: 'Small' },
    { key: 'md', label: 'Medium' },
    { key: 'lg', label: 'Large' },
    { key: 'xl', label: 'Extra Large' },
  ];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <Text variant="h1" marginBottom="xl">Elevation (Shadows)</Text>

        <Box gap="xl">
          {elevations.map((elevation) => {
            const shadow = theme.shadows[elevation.key as keyof typeof theme.shadows];
            
            return (
              <Box key={elevation.key} alignItems="center">
                <Text variant="label" marginBottom="md">{elevation.label}</Text>
                <Box
                  width={150}
                  height={150}
                  backgroundColor="white"
                  borderRadius="md"
                  justifyContent="center"
                  alignItems="center"
                  style={shadow}
                >
                  <Text variant="caption" color="textSecondary">{elevation.key}</Text>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </ScrollView>
  );
}
