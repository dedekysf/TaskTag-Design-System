import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { ScrollView, View } from 'react-native';

const SizeCard = ({ label, description, sizeValue }: { label: string, description: string, sizeValue: number }) => (
  <Card
    flexDirection="row"
    alignItems="center"
    gap="md"
    padding="md"
  >
    <Box
      width={sizeValue}
      height={sizeValue}
      backgroundColor="secondaryGreen"
      borderRadius="s"
    />
    <Box>
      <Text variant="label" marginBottom="xs">{label}</Text>
      <Text variant="caption" color="grey05">{description}</Text>
    </Box>
  </Card>
);


export default function SizesScreen() {
  const theme = useTheme<Theme>();
  const totalItems = 5; // Static count

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Sizes" totalItems={totalItems} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
          {/* Row 1 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <SizeCard label="size-xs" description="24px" sizeValue={theme.componentSizes.xs} />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <SizeCard label="size-sm" description="32px" sizeValue={theme.componentSizes.sm} />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <SizeCard label="size-md" description="40px" sizeValue={theme.componentSizes.md} />
          </View>

          {/* Row 2 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <SizeCard label="size-lg" description="48px" sizeValue={theme.componentSizes.lg} />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <SizeCard label="size-xl" description="56px" sizeValue={theme.componentSizes.xl} />
          </View>
        </View>
      </Box>
    </ScrollView>
  );
}
