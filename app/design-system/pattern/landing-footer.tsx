import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { ScrollView, View } from 'react-native';

function LandingFooter({ variant }: { variant: 'web' | 'mobile' }) {
  const theme = useTheme<Theme>();
  return (
    <Box alignItems="center" gap="24" paddingBottom="xl" paddingTop="lg">
      <Text variant="webSecondaryBody" style={{ color: theme.colors.grey05, textAlign: 'center' }}>
        Have questions? Contact our support team
      </Text>
      <Box flexDirection="row" alignItems="center" gap="sm" flexWrap="wrap" justifyContent="center">
        <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey05, textDecorationLine: 'underline' }}>Terms & conditions</Text>
        <View style={{ width: 1, height: 12, backgroundColor: theme.colors.grey03 }} />
        <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey05, textDecorationLine: 'underline' }}>Privacy policy</Text>
        <View style={{ width: 1, height: 12, backgroundColor: theme.colors.grey03 }} />
        <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey05, textDecorationLine: 'underline' }}>Contact us</Text>
      </Box>
      <Text variant="webSecondaryBody" style={{ color: theme.colors.grey05, textAlign: 'center' }}>
        © 2026 Tasktag, Houston, Texas 77001
      </Text>
    </Box>
  );
}

export default function LandingFooterScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Landing Footer" totalItems={1} />

        <ComponentSection
          title="Email Invitation Footer"
          githubUrls={[]}
          usageCode={`// Used at the bottom of all email invitation landing pages
// Consistent across web and mobile variants

<Box alignItems="center" gap="24" paddingBottom="xl">
  <Text variant="webSecondaryBody" style={{ color: theme.colors.grey05, textAlign: 'center' }}>
    Have questions? Contact our support team
  </Text>

  {/* Legal links with dividers */}
  <Box flexDirection="row" alignItems="center" gap="sm">
    <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey05, textDecorationLine: 'underline' }}>
      Terms & conditions
    </Text>
    <View style={{ width: 1, height: 12, backgroundColor: theme.colors.grey03 }} />
    <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey05, textDecorationLine: 'underline' }}>
      Privacy policy
    </Text>
    <View style={{ width: 1, height: 12, backgroundColor: theme.colors.grey03 }} />
    <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey05, textDecorationLine: 'underline' }}>
      Contact us
    </Text>
  </Box>

  <Text variant="webSecondaryBody" style={{ color: theme.colors.grey05, textAlign: 'center' }}>
    © 2026 Tasktag, Houston, Texas 77001
  </Text>
</Box>`}
        >
          <Box style={{ borderRadius: 8, borderWidth: 1, borderColor: '#e8e8e8', padding: 16 }}>
            <LandingFooter variant="web" />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
