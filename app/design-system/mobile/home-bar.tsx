import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { ScrollView, View } from 'react-native';

function HomeBar({ dark = true }: { dark?: boolean }) {
  return (
    <Box alignItems="center" justifyContent="center" style={{ paddingVertical: 8, paddingBottom: 10 }}>
      <View style={{
        width: 134, height: 5, borderRadius: 100,
        backgroundColor: dark ? '#1a1a1a' : '#e0e0e0',
      }} />
    </Box>
  );
}

export default function HomeBarScreen() {
  const theme = useTheme<Theme>();
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Home Bar" totalItems={2} />

        <ComponentSection
          title="Dark (Light Background)"
          githubUrls={[]}
          usageCode={`// iOS home indicator — placed at the very bottom of mobile screens
<Box alignItems="center" justifyContent="center" style={{ paddingVertical: 8, paddingBottom: 10 }}>
  <View style={{ width: 134, height: 5, borderRadius: 100, backgroundColor: '#1a1a1a' }} />
</Box>`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#fff' }}>
            <HomeBar dark={true} />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Light (Dark Background)"
          githubUrls={[]}
          usageCode={`// On dark backgrounds, use a lighter indicator
<Box alignItems="center" justifyContent="center" style={{ paddingVertical: 8, paddingBottom: 10 }}>
  <View style={{ width: 134, height: 5, borderRadius: 100, backgroundColor: '#e0e0e0' }} />
</Box>`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#1a1a1a' }}>
            <HomeBar dark={false} />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
