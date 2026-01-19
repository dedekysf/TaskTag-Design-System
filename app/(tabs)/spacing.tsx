import React from 'react';
import { ScrollView, View } from 'react-native';
import { Box, Text } from '@/components/primitives';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';

export default function SpacingScreen() {
  const theme = useTheme<Theme>();

  const spacingTokens = [
    { key: 'none', label: 'None', value: 0 },
    { key: 'xs', label: 'XS', value: theme.spacing.xs },
    { key: 'sm', label: 'SM', value: theme.spacing.sm },
    { key: 'md', label: 'MD', value: theme.spacing.md },
    { key: 'lg', label: 'LG', value: theme.spacing.lg },
    { key: 'xl', label: 'XL', value: theme.spacing.xl },
    { key: '2xl', label: '2XL', value: theme.spacing['2xl'] },
    { key: '3xl', label: '3XL', value: theme.spacing['3xl'] },
    { key: '4xl', label: '4XL', value: theme.spacing['4xl'] },
    { key: '5xl', label: '5XL', value: theme.spacing['5xl'] },
    { key: '6xl', label: '6XL', value: theme.spacing['6xl'] },
    { key: '7xl', label: '7XL', value: theme.spacing['7xl'] },
  ];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <Text variant="h1" marginBottom="xl">Spacing</Text>
        <Text variant="body" marginBottom="xl" color="textSecondary">
          Spacing tokens menggunakan multiples of 4px
        </Text>

        <Box gap="lg">
          {spacingTokens.map((token) => (
            <Box key={token.key}>
              <Box flexDirection="row" alignItems="center" gap="md" marginBottom="sm">
                <Box width={60}>
                  <Text variant="label">{token.label}</Text>
                </Box>
                <Box width={80}>
                  <Text variant="caption" color="grey05">{token.value}px</Text>
                </Box>
                <Box flex={1}>
                  <Box
                    height={24}
                    width={token.value}
                    backgroundColor="primary"
                    borderRadius="xs"
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </ScrollView>
  );
}
