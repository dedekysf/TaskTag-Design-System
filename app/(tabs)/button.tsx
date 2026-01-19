import React from 'react';
import { ScrollView, View, Platform } from 'react-native';
import { Box, Text } from '@/components/primitives';
import { Button } from '@/components/Button';

export default function ButtonScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <Text variant="h1" marginBottom="xl">Button Component</Text>

        {/* Fill Variants */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="md">Fill Variants</Text>
          <View style={{ gap: 8 }}>
            <Button variant="fill" color="primary" size="md">
              Primary Fill
            </Button>
            <Button variant="fill" color="secondary" size="md">
              Secondary Fill
            </Button>
            <Button variant="fill" color="destructive" size="md">
              Destructive Fill
            </Button>
            <Button variant="fill" color="blue" size="md">
              Blue Fill
            </Button>
          </View>
        </Box>

        {/* Outline Variants */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="md">Outline Variants</Text>
          <View style={{ gap: 8 }}>
            <Button variant="outline" color="primary" size="md">
              Primary Outline
            </Button>
            <Button variant="outline" color="secondary" size="md">
              Secondary Outline
            </Button>
            <Button variant="outline" color="destructive" size="md">
              Destructive Outline
            </Button>
            <Button variant="outline" color="blue" size="md">
              Blue Outline
            </Button>
          </View>
        </Box>

        {/* Ghost Variants */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="md">Ghost Variants</Text>
          <View style={{ gap: 8 }}>
            <Button variant="ghost" color="primary" size="md">
              Primary Ghost
            </Button>
            <Button variant="ghost" color="secondary" size="md">
              Secondary Ghost
            </Button>
            <Button variant="ghost" color="destructive" size="md">
              Destructive Ghost
            </Button>
            <Button variant="ghost" color="blue" size="md">
              Blue Ghost
            </Button>
          </View>
        </Box>

        {/* Sizes */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="md">Sizes</Text>
          <View style={{ gap: 8 }}>
            <Button variant="fill" color="primary" size="xl">
              Extra Large
            </Button>
            <Button variant="fill" color="primary" size="lg">
              Large
            </Button>
            <Button variant="fill" color="primary" size="md">
              Medium (Default)
            </Button>
            <Button variant="fill" color="primary" size="sm">
              Small
            </Button>
            <Button variant="fill" color="primary" size="xs">
              Extra Small
            </Button>
          </View>
        </Box>

        {/* States */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="md">States</Text>
          <View style={{ gap: 8 }}>
            <Button variant="fill" color="primary" size="md" disabled>
              Disabled
            </Button>
            <Button variant="fill" color="primary" size="md" loading>
              Loading
            </Button>
            <Button
              variant="fill"
              color="primary"
              size="md"
              onPress={() => {
                if (Platform.OS === 'web') {
                  alert('Button pressed!');
                } else {
                  console.log('Button pressed!');
                }
              }}
            >
              With onPress
            </Button>
          </View>
        </Box>
      </Box>
    </ScrollView>
  );
}
