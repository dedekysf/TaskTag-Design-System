import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Lock, MoreHorizontal } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';

function MobileBrowserHeader({ url = 'tasktag.com' }: { url?: string }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      paddingHorizontal="md" paddingBottom="sm"
      backgroundColor="background" borderBottomWidth={1} borderColor="border"
    >
      <Box flexDirection="row" alignItems="center" gap="8">
        <Box
          flex={1} flexDirection="row" alignItems="center" justifyContent="center"
          backgroundColor="grey02" paddingHorizontal="12" paddingVertical="12"
          gap="8" borderRadius="8"
        >
          <Lock size={12} color={theme.colors.grey05} />
          <Text variant="webLabelSmall" color="foreground">{url}</Text>
        </Box>
        <Pressable style={{ padding: 4 }}>
          <MoreHorizontal size={20} color={theme.colors.foreground} strokeWidth={2} />
        </Pressable>
      </Box>
    </Box>
  );
}

export default function MobileBrowserHeaderScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Mobile Browser Header" totalItems={2} />

        <ComponentSection
          title="Default"
          githubUrls={[]}
          usageCode={`// Used below the status bar in mobile web prototype screens
// Shows a simulated browser address bar
import { Lock, MoreHorizontal } from 'lucide-react-native';

<Box
  paddingHorizontal="md" paddingBottom="sm"
  backgroundColor="background" borderBottomWidth={1} borderColor="border"
>
  <Box flexDirection="row" alignItems="center" gap="8">
    {/* Address bar */}
    <Box
      flex={1} flexDirection="row" alignItems="center" justifyContent="center"
      backgroundColor="grey02" paddingHorizontal="12" paddingVertical="12"
      gap="8" borderRadius="8"
    >
      <Lock size={12} color={theme.colors.grey05} />
      <Text variant="webLabelSmall" color="foreground">tasktag.com</Text>
    </Box>
    {/* More options button */}
    <Pressable style={{ padding: 4 }}>
      <MoreHorizontal size={20} color={theme.colors.foreground} strokeWidth={2} />
    </Pressable>
  </Box>
</Box>`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            <MobileBrowserHeader url="tasktag.com" />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="With Custom URL"
          githubUrls={[]}
          usageCode={`<MobileBrowserHeader url="app.tasktag.com/invite/abc123" />`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            <MobileBrowserHeader url="app.tasktag.com/invite/abc123" />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
