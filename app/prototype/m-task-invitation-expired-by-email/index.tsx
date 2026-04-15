import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import { Clock } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

const TASK_DATA = {
  title: 'Deep clean the kitchen appliances',
  project: 'LA Avenue 37 D',
  assigner: 'James Hammer',
  date: 'Dec 15 - Dec 20',
};

export default function MJoinTaskNonUserExpired() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: TTTheme.colors.grey02 }}
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 12, paddingTop: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Box width="100%" maxWidth={480}>

        {/* Logo */}
        <Box marginBottom="lg" marginTop="lg" alignItems="center">
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ height: 36, width: 120 }}
            resizeMode="contain"
          />
        </Box>

        {/* Main Card */}
        <Box
          backgroundColor="card"
          borderRadius="xl"
          padding="16"
          paddingBottom="24"
          marginBottom="lg"
        >

          {/* Greeting */}
          <Box marginBottom="24">
            <Text variant="h2" style={{ color: TTTheme.colors.textSecondary, marginBottom: 8 }}>
              Hi Oscar 👋,
            </Text>
            <Text variant="webLargeLabel" style={{ color: TTTheme.colors.textSecondary }}>
              <Text variant="webLargeLabel" style={{ fontWeight: '600', color: TTTheme.colors.textSecondary }}>{TASK_DATA.assigner}</Text>
              {" has assigned you a new task on Tasktag."}
            </Text>
          </Box>

          {/* Task Identity (Grey Box) */}
          <Box backgroundColor="grey02" borderRadius="xl" padding="md" gap="md" marginBottom="24" borderWidth={1} borderColor="grey03">
            {/* Title */}
            <Text variant="mobileLargeLabel" color="foreground">
              {TASK_DATA.title}
            </Text>

            <Box height={1} backgroundColor="grey03" />

            <Box gap="md">
              {/* Project Info */}
              <Box>
                <Text variant="mobileMetadataPrimary" color="grey05" style={{ marginBottom: 4 }}>Project Name</Text>
                <Text variant="mobileLabelSmall" color="foreground">{TASK_DATA.project}</Text>
              </Box>

              {/* Due Date Info */}
              <Box>
                <Text variant="mobileMetadataPrimary" color="grey05" style={{ marginBottom: 4 }}>Due Date</Text>
                <Text variant="mobileLabelSmall" color="foreground">{TASK_DATA.date}</Text>
              </Box>
            </Box>

            <Box height={1} backgroundColor="grey03" />

            {/* Role Info */}
            <Box style={{ gap: 4 }}>
              <Text variant="mobileLabelSmall" style={{ color: TTTheme.colors.textSecondary, textAlign: 'left' }}>
                {"You'll join as a "}
                <Text variant="mobileLabelSmall" style={{ fontWeight: '600', color: TTTheme.colors.textSecondary }}>Assignee</Text>
                {" with"}
              </Text>
              <Text variant="mobileLabelSmall" style={{ color: TTTheme.colors.textSecondary, textAlign: 'left' }}>
                {"3 other people."}
              </Text>
            </Box>
          </Box>

          {/* CTA Button */}
          <Box marginBottom="8">
            <Button
              variant="fill"
              size="lg"
              style={{ width: '100%', backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 8 }}
              onPress={() => router.push('/prototype/m-task-invitation-expired-by-email/invitation-expired' as any)}
            >
              <Text variant="webSecondaryBody" color="white" style={{ fontSize: 16, fontWeight: '400' }}>Accept & Join Task</Text>
            </Button>
          </Box>

          {/* Expiry */}
          <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4">
            <Clock size={14} color={TTTheme.colors.foreground} />
            <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.foreground }}>This invite expires in 7 days</Text>
          </Box>

        </Box>

        {/* Download Section */}
        <Box alignItems="center" marginBottom="lg" marginTop="lg">
          <Text variant="webLargeLabel" style={{ color: TTTheme.colors.textSecondary, marginBottom: 8, textAlign: 'center' }}>
            Download The App
          </Text>
          <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.textSecondary, marginBottom: 16, textAlign: 'center' }}>
            Get the most of Tasktag by installing our new mobile app.
          </Text>
          <Box flexDirection="row" gap="24" justifyContent="center">
            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
              <ExpoImage
                source={require('@/assets/images/app-store.svg')}
                style={{ width: 120, height: 40 }}
                contentFit="contain"
              />
            </Pressable>
            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
              <ExpoImage
                source={require('@/assets/images/play-store.svg')}
                style={{ width: 135, height: 40 }}
                contentFit="contain"
              />
            </Pressable>
          </Box>
        </Box>

        {/* Footer */}
        <Box alignItems="center" gap="24" paddingBottom="xl">
          <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05, textAlign: 'center' }}>
            Have questions? Contact our support team
          </Text>
          <Box flexDirection="row" alignItems="center" gap="sm">
            <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Terms & conditions</Text>
            <Box width={1} height={12} backgroundColor="grey03" />
            <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Privacy policy</Text>
            <Box width={1} height={12} backgroundColor="grey03" />
            <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Contact us</Text>
          </Box>
          <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05, textAlign: 'center' }}>
            © 2026 Tasktag, Houston, Texas 77001
          </Text>
        </Box>

      </Box>
    </ScrollView>
  );
}
