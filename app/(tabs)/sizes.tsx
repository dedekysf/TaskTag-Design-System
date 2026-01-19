import React from 'react';
import { ScrollView, View } from 'react-native';
import { Box, Text } from '@/components/primitives';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';

export default function SizesScreen() {
  const theme = useTheme<Theme>();

  const sizes = [
    { key: 'xs', label: 'Extra Small', value: theme.sizes.xs },
    { key: 'sm', label: 'Small', value: theme.sizes.sm },
    { key: 'md', label: 'Medium', value: theme.sizes.md },
    { key: 'lg', label: 'Large', value: theme.sizes.lg },
    { key: 'xl', label: 'Extra Large', value: theme.sizes.xl },
  ];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <Text variant="h1" marginBottom="xl">Sizes</Text>
        <Text variant="body" marginBottom="xl" color="textSecondary">
          Component size tokens untuk buttons, inputs, dan components lainnya
        </Text>

        <Box gap="lg">
          {sizes.map((size) => (
            <Box key={size.key} flexDirection="row" alignItems="center" gap="md">
              <Box width={120}>
                <Text variant="label">{size.label}</Text>
              </Box>
              <Box width={80}>
                <Text variant="caption" color="grey05">{size.value}px</Text>
              </Box>
              <Box flex={1}>
                <Box
                  width={size.value}
                  height={size.value}
                  backgroundColor="primary"
                  borderRadius="md"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text variant="caption" color="white">{size.key.toUpperCase()}</Text>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </ScrollView>
  );
}
