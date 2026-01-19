import React from 'react';
import { ScrollView, View } from 'react-native';
import { Box, Text } from '@/components/primitives';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';

export default function BorderRadiusScreen() {
  const theme = useTheme<Theme>();

  const radiusTokens = [
    { key: 'none', label: 'None', value: theme.borderRadii.none },
    { key: 'xs', label: 'XS', value: theme.borderRadii.xs },
    { key: 'sm', label: 'SM', value: theme.borderRadii.sm },
    { key: 'md', label: 'MD', value: theme.borderRadii.md },
    { key: 'lg', label: 'LG', value: theme.borderRadii.lg },
    { key: 'xl', label: 'XL', value: theme.borderRadii.xl },
    { key: '2xl', label: '2XL', value: theme.borderRadii['2xl'] },
    { key: '3xl', label: '3XL', value: theme.borderRadii['3xl'] },
    { key: 'full', label: 'Full', value: theme.borderRadii.full },
    { key: 'button', label: 'Button', value: theme.borderRadii.button },
    { key: 'card', label: 'Card', value: theme.borderRadii.card },
  ];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <Text variant="h1" marginBottom="xl">Border Radius</Text>

        <Box gap="lg">
          {radiusTokens.map((token) => (
            <Box key={token.key} flexDirection="row" alignItems="center" gap="md">
              <Box width={100}>
                <Text variant="label">{token.label}</Text>
              </Box>
              <Box width={80}>
                <Text variant="caption" color="grey05">{token.value}px</Text>
              </Box>
              <Box flex={1}>
                <Box
                  width={100}
                  height={100}
                  backgroundColor="primary"
                  borderRadius={token.key as any}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </ScrollView>
  );
}
