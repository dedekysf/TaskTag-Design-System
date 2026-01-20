import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { ScrollView, View } from 'react-native';

const SpacingCard = ({ label, description }: { label: string, description: string }) => (
  <Card
    padding="md"
    justifyContent="center"
  >
    <Text variant="label" marginBottom="xs">{label}</Text>
    <Text variant="caption" color="grey05">{description}</Text>
  </Card>
);


export default function SpacingScreen() {
  const theme = useTheme<Theme>();
  const totalItems = 12; // Static count

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Spacing" totalItems={totalItems} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
          {/* Row 1 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <SpacingCard label="spacing-0" description="0px" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <SpacingCard label="spacing-4" description="4px" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <SpacingCard label="spacing-8" description="8px" />
          </View>

          {/* Row 2 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <SpacingCard label="spacing-12" description="12px" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <SpacingCard label="spacing-16" description="16px" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <SpacingCard label="spacing-20" description="20px" />
          </View>

          {/* Row 3 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <SpacingCard label="spacing-24" description="24px" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <SpacingCard label="spacing-32" description="32px" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <SpacingCard label="spacing-40" description="40px" />
          </View>

          {/* Row 4 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <SpacingCard label="spacing-48" description="48px" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <SpacingCard label="spacing-56" description="56px" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <SpacingCard label="spacing-64" description="64px" />
          </View>
        </View>
      </Box>
    </ScrollView>
  );
}
