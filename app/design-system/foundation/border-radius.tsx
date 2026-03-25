import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { ScrollView, View } from 'react-native';

const RadiusCard = ({ label, valueDescription, radiusToken }: { label: string, valueDescription: string, radiusToken: any }) => (
  <Card
    flexDirection="row"
    alignItems="center"
    gap="md"
    padding="md"
  >
    <Box
      width={48}
      height={48}
      backgroundColor="secondaryGreen"
      borderRadius={radiusToken}
    />
    <Box>
      <Text variant="label" marginBottom="xs">{label}</Text>
      <Text variant="caption" color="grey05">{valueDescription}</Text>
    </Box>
  </Card>
);


export default function BorderRadiusScreen() {
  const theme = useTheme<Theme>();
  const totalItems = 15; // Static count

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Border Radius" totalItems={totalItems} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
          {/* Row 1 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-none" valueDescription="0px" radiusToken="none" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-2" valueDescription="2px" radiusToken="2" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-4" valueDescription="4px" radiusToken="4" />
          </View>

          {/* Row 2 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-8" valueDescription="8px" radiusToken="8" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-12" valueDescription="12px" radiusToken="12" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-16" valueDescription="16px" radiusToken="16" />
          </View>

          {/* Row 3 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-20" valueDescription="20px" radiusToken="20" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-24" valueDescription="24px" radiusToken="24" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-full" valueDescription="9999px" radiusToken="full" />
          </View>

          {/* Row 4 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-sm" valueDescription="calc(8px - 4px)" radiusToken="sm" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-md" valueDescription="calc(8px - 2px)" radiusToken="md" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-lg" valueDescription="8px" radiusToken="lg" />
          </View>

          {/* Row 5 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-xl" valueDescription="calc(8px + 4px)" radiusToken="xl" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-button" valueDescription="8px" radiusToken="button" />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <RadiusCard label="radius-card" valueDescription="24px" radiusToken="card" />
          </View>
        </View>
      </Box>
    </ScrollView>
  );
}
