import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { BatteryFull, Hammer, Lock, MoreHorizontal, SignalHigh, User, Users, WifiHigh } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView } from 'react-native';

const TASK_DATA = {
  title: 'Deep clean the kitchen appliances',
  project: 'LA Avenue 37 D',
  assigner: 'James Hammer',
  date: 'Dec 15 - Dec 20',
  description: 'Please verify the exact location where the electrical meter rack should be installed. Check the site plans and confirm with the electrical contractor before proceeding.',
};

export default function JoinTasktag() {
  const theme = useTheme<Theme>();

  return (
    <Box flex={1} backgroundColor="background" alignItems="center">
      <Box flex={1} width="100%" maxWidth={480} backgroundColor="grey02">

        {/* Status Bar */}
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
        </Box>

        {/* Browser Header */}
        <Box
          paddingHorizontal="md" paddingBottom="sm"
          backgroundColor="background" borderBottomWidth={1} borderColor="border"
        >
          <Box flexDirection="row" alignItems="center" gap="sm">
            <Box
              flex={1} flexDirection="row" alignItems="center" justifyContent="center"
              backgroundColor="grey02" paddingHorizontal="12" paddingVertical="12"
              gap="sm" borderRadius="sm"
            >
              <Lock size={12} color={theme.colors.grey05} />
              <Text variant="webLabelSmall" color="foreground">tasktag.com</Text>
            </Box>
            <Pressable style={{ padding: 4 }}>
              <MoreHorizontal size={20} color={theme.colors.foreground} strokeWidth={2} />
            </Pressable>
          </Box>
        </Box>

        {/* TaskTag Logo + Sign Up */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" paddingHorizontal="md" paddingVertical="12" backgroundColor="card">
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ width: 100, height: 30 }}
            resizeMode="contain"
          />
          <Pressable onPress={() => router.push('/prototype/m-join-task-non-user/join-tasktag-signup')}>
            <Text variant="webSecondaryBody" style={{ fontSize: 14, color: theme.colors.secondaryGreen, fontWeight: '600' }}>Sign Up</Text>
          </Pressable>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40, paddingHorizontal: 16, paddingTop: 24 }}>

          {/* Heading */}
          <Box style={{ marginBottom: 16 }}>
            <Text variant="mobileHeading22" color="foreground" textAlign="center">
              You've been assigned a task
            </Text>
            <Text variant="mobileBody" color="textSecondary" textAlign="center" style={{ marginTop: 4 }}>
              by James Hammer
            </Text>
          </Box>

          {/* Task Card */}
          <Box backgroundColor="card" style={{ borderRadius: 16, marginBottom: 24 }} padding="md" gap="md" borderWidth={1} borderColor="border">
            {/* Top Info Group (Grey background) */}
            <Box backgroundColor="grey02" borderRadius="md" padding="md" gap="md">
              {/* Title */}
              <Text variant="mobileLargeLabel" color="foreground">
                {TASK_DATA.title}
              </Text>

              {/* Project & Assigner Row */}
              <Box flexDirection="row" alignItems="center" gap="md">
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Hammer size={14} color={theme.colors.secondaryGreen} strokeWidth={2.5} />
                  <Text variant="mobileMetadataPrimary" color="textSecondary">{TASK_DATA.project}</Text>
                </Box>
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Box width={14} height={14} borderRadius="full" backgroundColor="darkGreen" alignItems="center" justifyContent="center">
                    <User size={10} color="white" />
                  </Box>
                  <Text variant="mobileMetadataPrimary" color="textSecondary">{TASK_DATA.assigner}</Text>
                </Box>
              </Box>
            </Box>


            {/* Priority & Date Row (Action Pills Style) */}
            <Box flexDirection="row" alignItems="center" gap="sm" marginBottom="xs">
              <Box
                flexDirection="row" alignItems="center"
                backgroundColor="card"
                paddingHorizontal="sm"
                height={28}
                borderRadius="full"
                gap="xs"
                borderWidth={1}
                borderColor="border"
              >
                <Text variant="mobileMetadataPrimary" color="alertRed">
                  High Priority
                </Text>
              </Box>
              <Box
                flexDirection="row" alignItems="center"
                backgroundColor="card"
                paddingHorizontal="sm"
                height={28}
                borderRadius="full"
                gap="xs"
                borderWidth={1}
                borderColor="border"
              >
                <Text variant="mobileMetadataPrimary" color="textSecondary">
                  Due: {TASK_DATA.date}
                </Text>
              </Box>
            </Box>

            {/* Description */}
            <Box gap="xs">
              <Text variant="mobileLabelSmall" color="foreground">Description</Text>
              <Text variant="mobileMetadataPrimary" color="textSecondary" style={{ lineHeight: 18 }}>
                {TASK_DATA.description}
              </Text>
            </Box>

            {/* Assigned To */}
            <Box gap="xs">
              <Text variant="mobileLabelSmall" color="foreground">Assigned To</Text>
              <Box flexDirection="row" alignItems="center" gap="xs">
                <Users size={12} color={theme.colors.textSecondary} strokeWidth={2} />
                <Text variant="mobileMetadataPrimary" color="textSecondary">3 people working on this task</Text>
              </Box>
            </Box>
          </Box>

          {/* Request to Join Button */}
          <Box marginBottom="8">
            <Button
              variant="fill"
              size="lg"
              style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen, borderRadius: 12 }}
              onPress={() => router.push('/prototype/m-join-task-non-user/join-tasktag-signup' as any)}
            >
              <Text variant="webLabelEmphasized" color="white">Join This Task</Text>
            </Button>
          </Box>

          {/* Already on TaskTag */}
          <Box flexDirection="row" justifyContent="center" style={{ gap: 4, marginTop: 24 }}>
            <Text variant="webSecondaryBody" color="textSecondary">Already on TaskTag?</Text>
            <Pressable>
              <Text variant="webSecondaryBody" color="secondaryGreen" style={{ fontWeight: '600' }}>Log in</Text>
            </Pressable>
          </Box>

        </ScrollView>

      </Box>
    </Box>
  );
}
