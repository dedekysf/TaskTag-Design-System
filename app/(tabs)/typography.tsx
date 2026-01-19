import React from 'react';
import { ScrollView, View } from 'react-native';
import { Box, Text } from '@/components/primitives';

export default function TypographyScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <Text variant="h1" marginBottom="xl">Typography</Text>

        {/* Headings */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="md">Headings</Text>
          <View style={{ gap: 16 }}>
            <Box>
              <Text variant="caption" color="grey05" marginBottom="xs">H1 - 32px / Semibold (600)</Text>
              <Text variant="h1">Heading 1</Text>
            </Box>
            <Box>
              <Text variant="caption" color="grey05" marginBottom="xs">H2 - 22px / Semibold (600)</Text>
              <Text variant="h2">Heading 2</Text>
            </Box>
            <Box>
              <Text variant="caption" color="grey05" marginBottom="xs">H3 - 18px / Medium (500)</Text>
              <Text variant="h3">Heading 3</Text>
            </Box>
            <Box>
              <Text variant="caption" color="grey05" marginBottom="xs">H4 - 16px / Semibold (600)</Text>
              <Text variant="h4">Heading 4</Text>
            </Box>
          </View>
        </Box>

        {/* Body Text */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="md">Body Text</Text>
          <View style={{ gap: 16 }}>
            <Box>
              <Text variant="caption" color="grey05" marginBottom="xs">Body - 16px / Regular (400)</Text>
              <Text variant="body">
                This is body text. It's used for paragraphs and general content.
              </Text>
            </Box>
            <Box>
              <Text variant="caption" color="grey05" marginBottom="xs">Label - 14px / Medium (500)</Text>
              <Text variant="label">This is label text</Text>
            </Box>
            <Box>
              <Text variant="caption" color="grey05" marginBottom="xs">Label Emphasized - 16px / Semibold (600)</Text>
              <Text variant="labelEmphasized">This is emphasized label text</Text>
            </Box>
            <Box>
              <Text variant="caption" color="grey05" marginBottom="xs">Caption - 12px / Regular (400)</Text>
              <Text variant="caption">This is caption text</Text>
            </Box>
          </View>
        </Box>

        {/* Special Text */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="md">Special Text</Text>
          <View style={{ gap: 16 }}>
            <Box>
              <Text variant="caption" color="grey05" marginBottom="xs">Button - 16px / Medium (500)</Text>
              <Text variant="button">Button Text</Text>
            </Box>
            <Box>
              <Text variant="caption" color="grey05" marginBottom="xs">Link - 14px / Regular (400)</Text>
              <Text variant="link">This is a link</Text>
            </Box>
            <Box>
              <Text variant="caption" color="grey05" marginBottom="xs">Metadata - 12px / Regular (400)</Text>
              <Text variant="metadata">This is metadata text</Text>
            </Box>
          </View>
        </Box>
      </Box>
    </ScrollView>
  );
}
