import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { ScrollView, View } from 'react-native';

const getAlternativeColorFormat = (color: string) => {
  if (color.startsWith('#')) {
    // Hex to RGB
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (result) {
      return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
    }
    // Try short hex format e.g. #FFF
    result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(color);
    if (result) {
      return `rgb(${parseInt(result[1] + result[1], 16)}, ${parseInt(result[2] + result[2], 16)}, ${parseInt(result[3] + result[3], 16)})`;
    }
    return color;
  } else if (color.startsWith('rgb')) {
    // RGB/RGBA to Hex
    const sep = color.indexOf(',') > -1 ? ',' : ' ';
    const parts = color.substring(color.indexOf('(') + 1).split(')')[0].split(sep);

    // Safety check
    if (parts.length < 3) return color;

    const r = parseInt(parts[0].trim());
    const g = parseInt(parts[1].trim());
    const b = parseInt(parts[2].trim());

    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    let hex = '#' + toHex(r) + toHex(g) + toHex(b);

    if (parts.length > 3) {
      const aStr = parts[3].trim();
      // If alpha is a float 0-1
      const a = parseFloat(aStr);
      if (!isNaN(a)) {
        const alphaInt = Math.round(a * 255);
        hex += toHex(alphaInt);
      }
    }

    return hex;
  }
  return color;
};

const ColorCard = ({ label, name, colorKey, theme }: { label: string, name: string, colorKey: keyof Theme['colors'], theme: Theme }) => {
  const colorValue = theme.colors[colorKey];
  const isLight = ['white', 'grey01', 'grey02', 'lightPeach', 'lightPurple', 'lightMint', 'lightSky', 'lightCream', 'lightLavender', 'lightLavenderBlue', 'lightPink'].includes(colorKey as string);
  const displayValue = getAlternativeColorFormat(colorValue as string);

  // Ensure Hex is always displayed first
  const showAlternativeFirst = (colorValue as string).startsWith('rgb') || (colorValue as string).startsWith('rgba');
  const firstValue = showAlternativeFirst ? displayValue : colorValue;
  const secondValue = showAlternativeFirst ? colorValue : displayValue;

  return (
    <Card
      flexDirection="row"
      alignItems="center"
      padding="md"
      gap="md"
      style={{ width: '32%', marginBottom: 16, marginRight: '1%' }}
    >
      {/* Color Swatch */}
      <Box
        width={64}
        height={64}
        borderRadius="m"
        backgroundColor={colorKey as any}
        borderWidth={isLight ? 1 : 0}
        borderColor="border"
      />

      {/* Info */}
      <Box>
        <Text variant="labelMedium" marginBottom="xs">{name}</Text>
        <Text variant="caption" color="grey05">{firstValue}</Text>
        <Text variant="caption" color="grey04" fontSize={10}>{secondValue}</Text>
      </Box>
    </Card>
  );
};

export default function ColorsScreen() {
  const theme = useTheme<Theme>();

  const colorSections = [
    {
      title: 'Brand Colors',
      colors: [
        { name: 'brandGreen', label: 'Brand Green', key: 'brandGreen' },
        { name: 'secondaryGreen', label: 'Secondary Green', key: 'secondaryGreen' },
        { name: 'darkGreen', label: 'Dark Green', key: 'darkGreen' },
      ],
    },
    {
      title: 'Text Colors',
      colors: [
        { name: 'textPrimary', label: 'Text Primary', key: 'textPrimary' },
        { name: 'textSecondary', label: 'Text Secondary', key: 'textSecondary' },
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
        { name: 'grey06', label: 'Grey 06', key: 'grey06' },
        { name: 'grey07', label: 'Grey 07', key: 'grey07' },
        { name: 'black', label: 'Black', key: 'black' },
        { name: 'overlay', label: 'Overlay', key: 'overlay' },
      ],
    },
    {
      title: 'Vivid Colors',
      colors: [
        { name: 'blue', label: 'Blue', key: 'blue' },
        { name: 'purple', label: 'Purple', key: 'purple' },
        { name: 'lightMagenta', label: 'Light Magenta', key: 'lightMagenta' },
        { name: 'darkMagenta', label: 'Dark Magenta', key: 'darkMagenta' },
        { name: 'orange', label: 'Orange', key: 'orange' },
        { name: 'vividYellow', label: 'Vivid Yellow', key: 'vividYellow' },
        { name: 'alertRed', label: 'Alert Red', key: 'alertRed' },
      ],
    },
    {
      title: 'Pastel Colors',
      colors: [
        { name: 'pastelBlue', label: 'Pastel Blue', key: 'pastelBlue' },
        { name: 'pastelPurple', label: 'Pastel Purple', key: 'pastelPurple' },
        { name: 'pastelMagenta', label: 'Pastel Magenta', key: 'pastelMagenta' },
        { name: 'pastelOrange', label: 'Pastel Orange', key: 'pastelOrange' },
        { name: 'pastelYellow', label: 'Pastel Yellow', key: 'pastelYellow' },
        { name: 'brightYellow', label: 'Bright Yellow', key: 'brightYellow' },
      ],
    },
    {
      title: 'Light Background Colors',
      colors: [
        { name: 'lightPeach', label: 'Light Peach', key: 'lightPeach' },
        { name: 'lightPurple', label: 'Light Purple', key: 'lightPurple' },
        { name: 'lightLavender', label: 'Light Lavender', key: 'lightLavender' },
        { name: 'lightLavenderBlue', label: 'Light Lavender Blue', key: 'lightLavenderBlue' },
        { name: 'lightMint', label: 'Light Mint', key: 'lightMint' },
        { name: 'lightSky', label: 'Light Sky', key: 'lightSky' },
        { name: 'lightPink', label: 'Light Pink', key: 'lightPink' },
        { name: 'lightCream', label: 'Light Cream', key: 'lightCream' },
      ],
    },
  ];

  const totalColors = colorSections.reduce((acc, section) => acc + section.colors.length, 0);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Colors" totalItems={totalColors} />

        {colorSections.map((section) => (
          <Box key={section.title} marginBottom="xl">
            <Text variant="h2" marginBottom="md">{section.title}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
              {section.colors.map((color) => (
                <ColorCard
                  key={color.key}
                  label={color.label}
                  name={color.name}
                  colorKey={color.key as keyof Theme['colors']}
                  theme={theme}
                />
              ))}
            </View>
          </Box>
        ))}
      </Box>
    </ScrollView>
  );
}
