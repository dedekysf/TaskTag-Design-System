import React from 'react';
import { ScrollView, View } from 'react-native';
import { Box, Text } from '@/components/primitives';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';

export default function ColorsScreen() {
  const theme = useTheme<Theme>();

  const colorSections = [
    {
      title: 'Brand Colors',
      colors: [
        { name: 'brandGreen', label: 'Brand Green', key: 'brandGreen' },
        { name: 'secondaryGreen', label: 'Secondary Green', key: 'secondaryGreen' },
        { name: 'darkGreen', label: 'Dark Green', key: 'darkGreen' },
        { name: 'vividYellow', label: 'Vivid Yellow', key: 'vividYellow' },
        { name: 'alertRed', label: 'Alert Red', key: 'alertRed' },
      ],
    },
    {
      title: 'Text Colors',
      colors: [
        { name: 'textPrimary', label: 'Text Primary', key: 'textPrimary' },
        { name: 'textSecondary', label: 'Text Secondary', key: 'textSecondary' },
        { name: 'textSecondary70', label: 'Text Secondary 70%', key: 'textSecondary70' },
      ],
    },
    {
      title: 'Neutrals',
      colors: [
        { name: 'white', label: 'White', key: 'white' },
        { name: 'grey01', label: 'Grey 01', key: 'grey01' },
        { name: 'grey02', label: 'Grey 02', key: 'grey02' },
        { name: 'grey03', label: 'Grey 03', key: 'grey03' },
        { name: 'grey04', label: 'Grey 04', key: 'grey04' },
        { name: 'grey05', label: 'Grey 05', key: 'grey05' },
        { name: 'black', label: 'Black', key: 'black' },
      ],
    },
    {
      title: 'Vivid Colors',
      colors: [
        { name: 'blue', label: 'Blue', key: 'blue' },
        { name: 'purple', label: 'Purple', key: 'purple' },
        { name: 'orange', label: 'Orange', key: 'orange' },
      ],
    },
    {
      title: 'Semantic Colors',
      colors: [
        { name: 'primary', label: 'Primary', key: 'primary' },
        { name: 'secondary', label: 'Secondary', key: 'secondary' },
        { name: 'accent', label: 'Accent', key: 'accent' },
        { name: 'destructive', label: 'Destructive', key: 'destructive' },
        { name: 'muted', label: 'Muted', key: 'muted' },
      ],
    },
  ];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <Text variant="h1" marginBottom="xl">Colors</Text>

        {colorSections.map((section) => (
          <Box key={section.title} marginBottom="xl">
            <Text variant="h2" marginBottom="md">{section.title}</Text>
            <View style={{ gap: 12, flexDirection: 'row', flexWrap: 'wrap' }}>
              {section.colors.map((color) => {
                const colorValue = theme.colors[color.key as keyof typeof theme.colors];
                const isLight = ['white', 'grey01', 'grey02', 'lightPeach', 'lightPurple', 'lightMint', 'lightSky', 'lightCream'].includes(color.key);
                
                return (
                  <Box key={color.name} width="30%" marginBottom="md">
                    <Box
                      width="100%"
                      height={100}
                      backgroundColor={color.key as any}
                      borderRadius="md"
                      marginBottom="sm"
                      borderWidth={isLight ? 1 : 0}
                      borderColor="border"
                    />
                    <Text variant="label" marginBottom="xs">{color.label}</Text>
                    <Text variant="caption" color="grey05">{colorValue}</Text>
                  </Box>
                );
              })}
            </View>
          </Box>
        ))}
      </Box>
    </ScrollView>
  );
}
