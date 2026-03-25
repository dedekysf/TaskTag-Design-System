import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import React from 'react';
import { ScrollView, View } from 'react-native';

const ElevationCard = ({ label, description, shadowStyle }: { label: string, description: string, shadowStyle: any }) => (
  <Card
    padding="md"
    // Ensure the card itself doesn't have a big shadow that confuses the demo
    borderWidth={1}
    borderColor="grey02"
    flexDirection="row"
    alignItems="center"
    gap="md"
  >
    {/* The object demonstrating the shadow */}
    <Box
      width={48}
      height={48}
      backgroundColor="white"
      borderRadius="s"
      style={shadowStyle}
    />

    <Box flex={1}>
      <Text variant="label" marginBottom="xs">{label}</Text>
      <Text variant="caption" color="grey05" style={{ fontSize: 10 }}>{description}</Text>
    </Box>
  </Card>
);


export default function ElevationScreen() {
  const totalItems = 4;

  // Manual mapping of shadows to match the CSS values provided in the image/globals.css
  // ...

  // Shadows definition skipped for brevity as we are just inserting the header

  const shadows = {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 8
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 25,
      elevation: 12
    },
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Elevation" totalItems={totalItems} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
          {/* Row 1 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <ElevationCard
              label="elevation-sm"
              description="#0000000d 0px 1px 3px 0px"
              shadowStyle={shadows.sm}
            />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <ElevationCard
              label="elevation-md"
              description="#0000001a 0px 4px 6px -1px, #0000000f 0px 2px 4px -1px"
              shadowStyle={shadows.md}
            />
          </View>
          <View style={{ width: '31%', minWidth: 300 }}>
            <ElevationCard
              label="elevation-lg"
              description="#0000001a 0px 10px 15px -3px, #0000000d 0px 4px 6px -2px"
              shadowStyle={shadows.lg}
            />
          </View>

          {/* Row 2 */}
          <View style={{ width: '31%', minWidth: 300 }}>
            <ElevationCard
              label="elevation-xl"
              description="#0000001a 0px 20px 25px -5px, #0000000a 0px 10px 10px -5px"
              shadowStyle={shadows.xl}
            />
          </View>
        </View>
      </Box>
    </ScrollView>
  );
}
