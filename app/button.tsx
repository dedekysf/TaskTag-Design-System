import { Button } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { ChevronLeft, ChevronRight, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function ButtonScreen() {
  const totalItems = 3;

  const variants = [
    { label: 'FILL', type: 'fill' },
    { label: 'OUTLINE', type: 'outline' },
    { label: 'GHOST', type: 'ghost' },
  ] as const;

  const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

  const getIconSize = (size: string) => {
    switch (size) {
      case 'xl': return 24;
      case 'lg': return 24;
      case 'md': return 20;
      case 'sm': return 16;
      case 'xs': return 12;
      default: return 16;
    }
  };

  const getTextSize = (size: string) => {
    return size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'lg' ? 16 : size === 'xl' ? 18 : 16;
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Button" totalItems={totalItems} itemLabel="variants" />

        {/* 1. Button Variants Section */}
        <Box marginBottom="xl">
          {variants.map((v) => (
            <Box key={v.type} marginBottom="lg">
              <Text variant="label" marginBottom="sm" style={{ textTransform: 'uppercase', color: '#828282' }}>{v.label}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                <Button variant={v.type} color="primary" size="md">
                  Primary
                </Button>
                <Button variant={v.type} color="secondary" size="md">
                  Black
                </Button>
                <Button variant={v.type} color="destructive" size="md">
                  Destructive
                </Button>
                <Button variant={v.type} color="blue" size="md">
                  Blue
                </Button>
                <Button variant={v.type} color="primary" size="md" disabled>
                  Disabled
                </Button>
              </View>
            </Box>
          ))}
        </Box>

        {/* 2. Rectangular Button Section */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="lg">Rectangular Button</Text>
          {sizes.map((size) => (
            <Box key={`rect-${size}`} marginBottom="lg">
              <Text variant="label" marginBottom="sm" style={{ textTransform: 'uppercase', color: '#828282' }}>{size.toUpperCase()}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                <Button variant="fill" color="secondary" size={size}>
                  Button
                </Button>
                <Button variant="fill" color="secondary" size={size} style={{ flexDirection: 'row', gap: 8 }}>
                  <ChevronLeft size={getIconSize(size)} color="white" />
                  <Text color="white" fontWeight="500" style={{ fontSize: getTextSize(size) }}>Left Icon</Text>
                </Button>
                <Button variant="fill" color="secondary" size={size} style={{ flexDirection: 'row', gap: 8 }}>
                  <Text color="white" fontWeight="500" style={{ fontSize: getTextSize(size) }}>Right Icon</Text>
                  <ChevronRight size={getIconSize(size)} color="white" />
                </Button>
                <Button variant="fill" color="secondary" size={size} isIconOnly>
                  <User size={getIconSize(size)} color="white" />
                </Button>
              </View>
            </Box>
          ))}
        </Box>

        {/* 3. Rounded Button Section */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="lg">Rounded Button</Text>
          {sizes.map((size) => (
            <Box key={`round-${size}`} marginBottom="lg">
              <Text variant="label" marginBottom="sm" style={{ textTransform: 'uppercase', color: '#828282' }}>{size.toUpperCase()}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                <Button variant="fill" color="secondary" size={size} style={{ borderRadius: 9999 }}>
                  Button
                </Button>
                <Button variant="fill" color="secondary" size={size} style={{ flexDirection: 'row', gap: 8, borderRadius: 9999 }}>
                  <ChevronLeft size={getIconSize(size)} color="white" />
                  <Text color="white" fontWeight="500" style={{ fontSize: getTextSize(size) }}>Left Icon</Text>
                </Button>
                <Button variant="fill" color="secondary" size={size} style={{ flexDirection: 'row', gap: 8, borderRadius: 9999 }}>
                  <Text color="white" fontWeight="500" style={{ fontSize: getTextSize(size) }}>Right Icon</Text>
                  <ChevronRight size={getIconSize(size)} color="white" />
                </Button>
                <Button variant="fill" color="secondary" size={size} style={{ borderRadius: 9999 }} isIconOnly>
                  <User size={getIconSize(size)} color="white" />
                </Button>
              </View>
            </Box>
          ))}
        </Box>

      </Box>
    </ScrollView>
  );
}
