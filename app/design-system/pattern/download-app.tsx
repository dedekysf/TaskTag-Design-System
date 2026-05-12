import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Image as ExpoImage } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';

function DownloadAppSection({ variant }: { variant: 'web' | 'mobile' }) {
  const theme = useTheme<Theme>();
  const isWeb = variant === 'web';

  return (
    <Box alignItems="center" style={{ paddingVertical: isWeb ? 32 : 20 }}>
      <Text
        variant={isWeb ? 'webHeading22' : 'webLargeLabel'}
        style={{ color: theme.colors.textSecondary, marginBottom: 8, textAlign: 'center' }}
      >
        Download The App
      </Text>
      <Text
        variant={isWeb ? 'webBody' : 'webMetadataPrimary'}
        style={{ color: theme.colors.textSecondary, marginBottom: isWeb ? 20 : 16, textAlign: 'center' }}
      >
        Get the most of Tasktag by installing our new mobile app.
      </Text>
      <Box flexDirection="row" gap="24" justifyContent="center">
        <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
          <ExpoImage
            source={require('@/assets/images/app-store.svg')}
            style={{ width: isWeb ? 140 : 120, height: isWeb ? 44 : 40 }}
            contentFit="contain"
          />
        </Pressable>
        <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
          <ExpoImage
            source={require('@/assets/images/play-store.svg')}
            style={{ width: isWeb ? 148 : 135, height: isWeb ? 44 : 40 }}
            contentFit="contain"
          />
        </Pressable>
      </Box>
    </Box>
  );
}

export default function DownloadAppScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Download App Section" totalItems={2} />

        <ComponentSection
          title="Web Version"
          githubUrls={[]}
          usageCode={`// Used in web email invitation flows
// app/prototype/project-invitation-expired-by-email/index.tsx
<Box alignItems="center" marginBottom="xl" marginTop="xl">
  <Text variant="webHeading22" style={{ color: theme.colors.textSecondary, marginBottom: 8, textAlign: 'center' }}>
    Download The App
  </Text>
  <Text variant="webBody" style={{ color: theme.colors.textSecondary, marginBottom: 20, textAlign: 'center' }}>
    Get the most of Tasktag by installing our new mobile app.
  </Text>
  <Box flexDirection="row" gap="24" justifyContent="center">
    <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
      <ExpoImage source={require('@/assets/images/app-store.svg')} style={{ width: 140, height: 44 }} contentFit="contain" />
    </Pressable>
    <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
      <ExpoImage source={require('@/assets/images/play-store.svg')} style={{ width: 148, height: 44 }} contentFit="contain" />
    </Pressable>
  </Box>
</Box>`}
        >
          <DownloadAppSection variant="web" />
        </ComponentSection>

        <ComponentSection
          title="Mobile Version"
          githubUrls={[]}
          usageCode={`// Used in mobile email invitation flows
// app/prototype/m-project-invitation-expired-by-email/index.tsx
<Box alignItems="center" marginBottom="lg" marginTop="lg">
  <Text variant="webLargeLabel" style={{ color: TTTheme.colors.textSecondary, marginBottom: 8, textAlign: 'center' }}>
    Download The App
  </Text>
  <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.textSecondary, marginBottom: 16, textAlign: 'center' }}>
    Get the most of Tasktag by installing our new mobile app.
  </Text>
  <Box flexDirection="row" gap="24" justifyContent="center">
    <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
      <ExpoImage source={require('@/assets/images/app-store.svg')} style={{ width: 120, height: 40 }} contentFit="contain" />
    </Pressable>
    <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
      <ExpoImage source={require('@/assets/images/play-store.svg')} style={{ width: 135, height: 40 }} contentFit="contain" />
    </Pressable>
  </Box>
</Box>`}
        >
          <DownloadAppSection variant="mobile" />
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
