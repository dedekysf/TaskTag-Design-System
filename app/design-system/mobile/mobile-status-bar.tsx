import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { BatteryFull, SignalHigh, WifiHigh } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';

function MobileStatusBar({ bg = 'background' }: { bg?: string }) {
  const theme = useTheme<Theme>();
  const bgColor = (theme.colors as any)[bg] ?? bg;
  return (
    <Box
      flexDirection="row" alignItems="center" justifyContent="space-between"
      paddingHorizontal="xl" paddingTop="md" paddingBottom="sm"
      style={{ backgroundColor: bgColor }}
    >
      <Text color="foreground" paddingLeft="8" style={{ fontWeight: '600', fontSize: 15 }}>9:41</Text>
      <Box flexDirection="row" alignItems="center" gap="8" paddingRight="8">
        <SignalHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
        <WifiHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
        <BatteryFull size={22} color={theme.colors.foreground} strokeWidth={2} />
      </Box>
    </Box>
  );
}

export default function MobileStatusBarScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Mobile Status Bar" totalItems={2} />

        <ComponentSection
          title="Light Background"
          githubUrls={[]}
          usageCode={`// Used at top of all mobile prototype screens
import { BatteryFull, SignalHigh, WifiHigh } from 'lucide-react-native';

<Box
  flexDirection="row" alignItems="center" justifyContent="space-between"
  paddingHorizontal="xl" paddingTop="md" paddingBottom="sm"
  backgroundColor="background"
>
  <Text color="foreground" paddingLeft="8" style={{ fontWeight: '600', fontSize: 15 }}>9:41</Text>
  <Box flexDirection="row" alignItems="center" gap="8" paddingRight="8">
    <SignalHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
    <WifiHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
    <BatteryFull size={22} color={theme.colors.foreground} strokeWidth={2} />
  </Box>
</Box>`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            <MobileStatusBar bg="background" />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Grey Background"
          githubUrls={[]}
          usageCode={`<Box
  flexDirection="row" alignItems="center" justifyContent="space-between"
  paddingHorizontal="xl" paddingTop="md" paddingBottom="sm"
  backgroundColor="grey02"
>
  <Text color="foreground" paddingLeft="8" style={{ fontWeight: '600', fontSize: 15 }}>9:41</Text>
  <Box flexDirection="row" alignItems="center" gap="8" paddingRight="8">
    <SignalHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
    <WifiHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
    <BatteryFull size={22} color={theme.colors.foreground} strokeWidth={2} />
  </Box>
</Box>`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            <MobileStatusBar bg="grey02" />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
