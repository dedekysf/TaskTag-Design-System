import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import { Clock } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

const PROJECT_DATA = {
  name: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Court',
  team: 'Aquaworks Construction',
  inviter: 'James Hammer',
  memberCount: 12,
};

export default function JoinProjectExpiredNonUserWeb() {
  const theme = useTheme<typeof TTTheme>();

  return (
    <Box flex={1} backgroundColor="grey02">

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingVertical: 64, paddingHorizontal: 40 }}
      >
        <Box width="100%" maxWidth={560}>

          {/* Logo */}
          <Box marginBottom="xl" alignItems="center">
            <Image
              source={require('@/assets/images/tasktag-logo.png')}
              style={{ width: 134, height: 40 }}
              resizeMode="contain"
            />
          </Box>

          {/* Main Invitation Card */}
          <Box
            backgroundColor="card"
            borderRadius="xl"
            padding="24"
            paddingTop="32"
            marginBottom="xl"
          >

            {/* Greeting */}
            <Box marginBottom="24">
              <Text variant="h2" style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>
                Hi Oscar 👋,
              </Text>
              <Text variant="webLargeLabel" style={{ color: theme.colors.textSecondary }}>
                <Text variant="webLargeLabel" style={{ fontWeight: '600', color: theme.colors.textSecondary }}>{PROJECT_DATA.inviter}</Text>
                {" has invited you to join a project on Tasktag."}
              </Text>
            </Box>

            {/* Project Identity (Grey Box) */}
            <Box backgroundColor="grey02" borderRadius="xl" padding="md" gap="md" marginBottom="24" borderWidth={1} borderColor="grey03">
              {/* Project Name */}
              <Text variant="webHeading22" color="foreground">
                {PROJECT_DATA.name}
              </Text>

              <Box height={1} backgroundColor="grey03" />

              <Box gap="sm">
                {/* Address */}
                <Box flexDirection="row" alignItems="center" gap="md">
                  <Box width={120}>
                    <Text variant="webBody" color="grey05" textAlign="left">Address</Text>
                  </Box>
                  <Text variant="webBody" color="foreground">{PROJECT_DATA.address}</Text>
                </Box>

                {/* Team Name */}
                <Box flexDirection="row" alignItems="center" gap="md">
                  <Box width={120}>
                    <Text variant="webBody" color="grey05" textAlign="left">Team Name</Text>
                  </Box>
                  <Text variant="webBody" color="foreground">{PROJECT_DATA.team}</Text>
                </Box>
              </Box>

              <Box height={1} backgroundColor="grey03" />

              {/* Role Info */}
              <Text variant="webBody" style={{ color: theme.colors.textSecondary, textAlign: 'left' }}>
                {"You'll join as a "}
                <Text variant="webBody" style={{ fontWeight: '600', color: theme.colors.textSecondary }}>Member</Text>
                {` with ${PROJECT_DATA.memberCount} other people.`}
              </Text>
            </Box>

            {/* CTA Button */}
            <Box marginBottom="8">
              <Button
                variant="fill"
                size="xl"
                style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen, borderRadius: 8 }}
                onPress={() => router.push('/prototype/project-invitation-expired-by-email/invitation-expired' as any)}
              >
                <Text style={{ fontSize: 16, fontWeight: '400', color: '#fff' }}>Accept & Join Project</Text>
              </Button>
            </Box>

            {/* Expiry */}
            <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4">
              <Clock size={14} color={theme.colors.foreground} />
              <Text variant="webSecondaryBody" style={{ color: theme.colors.foreground }}>This invite expires in 7 days</Text>
            </Box>
          </Box>

          {/* Download Section */}
          <Box alignItems="center" marginBottom="xl" marginTop="xl">
            <Text variant="webHeading22" style={{ color: theme.colors.textSecondary, marginBottom: 8, textAlign: 'center' }}>
              Download The App
            </Text>
            <Text variant="webBody" style={{ color: theme.colors.textSecondary, marginBottom: 20, textAlign: 'center' }}>
              Get the most of Tasktag by installing our new mobile app.
            </Text>
            <Box flexDirection="row" gap="24" justifyContent="center">
              <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
                <ExpoImage
                  source={require('@/assets/images/app-store.svg')}
                  style={{ width: 140, height: 44 }}
                  contentFit="contain"
                />
              </Pressable>
              <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
                <ExpoImage
                  source={require('@/assets/images/play-store.svg')}
                  style={{ width: 148, height: 44 }}
                  contentFit="contain"
                />
              </Pressable>
            </Box>
          </Box>

          {/* Footer */}
          <Box alignItems="center" gap="24" paddingBottom="xl">
            <Text variant="webSecondaryBody" style={{ color: theme.colors.grey05, textAlign: 'center' }}>
              Have questions? Contact our support team
            </Text>
            <Box flexDirection="row" alignItems="center" gap="sm">
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

        </Box>
      </ScrollView>

    </Box>
  );
}
