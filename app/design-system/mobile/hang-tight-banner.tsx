import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Clock, Loader } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

function HangTightBanner() {
  const theme = useTheme<Theme>();
  return (
    <Box
      style={{
        backgroundColor: theme.colors.foreground,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        maxWidth: 360,
      }}
    >
      <Clock size={18} color="#fff" />
      <Box flex={1}>
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Hang tight!</Text>
        <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>
          Admin will review your request
        </Text>
      </Box>
    </Box>
  );
}

function ProcessingBanner() {
  const theme = useTheme<Theme>();
  return (
    <Box
      style={{
        backgroundColor: theme.colors.foreground,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        maxWidth: 360,
      }}
    >
      <Loader size={18} color={theme.colors.secondaryGreen} />
      <Box flex={1}>
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Processing...</Text>
        <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>
          Your request is being processed
        </Text>
      </Box>
    </Box>
  );
}

export default function HangTightBannerScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Hang Tight Banner" totalItems={2} />

        <ComponentSection
          title="Hang Tight (Pending Approval)"
          githubUrls={[]}
          usageCode={`// Used in project-overview-browser to show pending approval state
// Positioned as floating banner above the bottom sheet

// In the project overview screen (absolute positioned):
<Box style={{
  position: 'absolute', bottom: 220, left: 16, right: 16, zIndex: 40,
  alignItems: 'center',
}}>
  <Box style={{
    backgroundColor: theme.colors.foreground,
    borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  }}>
    <Clock size={18} color="#fff" />
    <Box flex={1}>
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Hang tight!</Text>
      <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>
        Admin will review your request
      </Text>
    </Box>
  </Box>
</Box>`}
        >
          <Box alignItems="center" paddingVertical="md">
            <HangTightBanner />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Processing State"
          githubUrls={[]}
          usageCode={`<Box style={{
  backgroundColor: theme.colors.foreground,
  borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14,
  flexDirection: 'row', alignItems: 'center', gap: 12,
}}>
  <Loader size={18} color={theme.colors.secondaryGreen} />
  <Box flex={1}>
    <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Processing...</Text>
    <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>
      Your request is being processed
    </Text>
  </Box>
</Box>`}
        >
          <Box alignItems="center" paddingVertical="md">
            <ProcessingBanner />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
