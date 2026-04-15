import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { BatteryFull, Check, Hammer, Lock, MoreHorizontal, SignalHigh, User, Users, WifiHigh, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

const TASK_DATA = {
  title: 'Deep clean the kitchen appliances',
  project: 'LA Avenue 37 D',
  assigner: 'James Hammer',
  date: 'Dec 15 - Dec 20',
  description: 'Please verify the exact location where the electrical meter rack should be installed. Check the site plans and confirm with the electrical contractor before proceeding.',
};

export default function TaskOverviewBrowser() {
  const theme = useTheme<Theme>();
  const [bannerVisible, setBannerVisible] = useState(true);
  const [sheetVisible, setSheetVisible] = useState(true);

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
          <Box flexDirection="row" alignItems="center" gap="8">
            <Box
              flex={1} flexDirection="row" alignItems="center" justifyContent="center"
              backgroundColor="grey02" paddingHorizontal="12" paddingVertical="12"
              gap="8" borderRadius="8"
            >
              <Lock size={12} color={theme.colors.grey05} />
              <Text variant="webLabelSmall" color="foreground">tasktag.com</Text>
            </Box>
            <Pressable style={{ padding: 4 }}>
              <MoreHorizontal size={20} color={theme.colors.foreground} strokeWidth={2} />
            </Pressable>
          </Box>
        </Box>

        {/* App Header */}
        <Box
          flexDirection="row" alignItems="center" justifyContent="space-between"
          style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' }}
        >
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ width: 100, height: 30 }}
            resizeMode="contain"
          />
          <Pressable>
            <Box width={36} height={36} borderRadius="full" backgroundColor="grey02" alignItems="center" justifyContent="center">
              <User size={20} color={theme.colors.grey05} />
            </Box>
          </Pressable>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 16, paddingTop: 16 }}>

          {/* Task Card */}
          <Box backgroundColor="card" style={{ borderRadius: 16 }} padding="md" gap="md" borderWidth={1} borderColor="border">
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

            {/* Priority & Date Row */}
            <Box flexDirection="row" alignItems="center" gap="sm" marginBottom="xs">
              <Box
                flexDirection="row" alignItems="center"
                backgroundColor="card" paddingHorizontal="sm" height={28}
                borderRadius="full" gap="xs" borderWidth={1} borderColor="border"
              >
                <Text variant="mobileMetadataPrimary" color="alertRed">High Priority</Text>
              </Box>
              <Box
                flexDirection="row" alignItems="center"
                backgroundColor="card" paddingHorizontal="sm" height={28}
                borderRadius="full" gap="xs" borderWidth={1} borderColor="border"
              >
                <Text variant="mobileMetadataPrimary" color="textSecondary">Due: {TASK_DATA.date}</Text>
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

          {/* Download Banner */}
          <Box
            backgroundColor="secondary" padding="16" borderRadius={12}
            style={{ backgroundColor: '#000000' }}
          >
            <View style={{ marginBottom: 4 }}>
              <Text variant="webLabelEmphasized" color="white">You&apos;re all set.</Text>
            </View>
            <Text variant="webSecondaryBody" style={{ color: '#E0E0E0', marginBottom: 16, lineHeight: 20 }}>
              Download the app to see your jobs, message the crew, and stay on top of every task.
            </Text>
            <Button
              variant="fill" color="primary" size="lg"
              onPress={() => { if (typeof window !== 'undefined') window.open('https://play.google.com/store/apps/details?id=com.eloveit.TaskTag', '_blank'); }}
              style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen, borderRadius: 8 }}
            >
              <Text variant="webLabelEmphasized" color="white">Download the App</Text>
            </Button>
          </Box>
        </ScrollView>

        {/* Bottom Sheet */}
        {sheetVisible && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, justifyContent: 'flex-end' }}>
            <Pressable
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
              onPress={() => setSheetVisible(false)}
            />

            {/* Note for Dev */}
            {bannerVisible && (
              <Box backgroundColor="brightYellow" borderRadius="xl" padding="md" marginHorizontal="md" marginBottom="sm" gap="xs">
                <Pressable
                  onPress={() => setBannerVisible(false)}
                  style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
                  hitSlop={8}
                >
                  <X size={16} color="#000" />
                </Pressable>
                <Text variant="webLabelEmphasized" color="grey07">Note for Dev</Text>
                <Text variant="webMetadataPrimary" color="grey07" style={{ lineHeight: 18, paddingRight: 20 }}>
                  If already have the app after sign up, open the app. If not, go to this page after sign up.
                </Text>
              </Box>
            )}

            <View style={{ backgroundColor: theme.colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}>
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{ width: 40, height: 4, backgroundColor: theme.colors.border, borderRadius: 2 }} />
              </View>
              <View style={{ alignItems: 'center', paddingVertical: 8, marginBottom: 24 }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.lightMint, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Check size={28} color={theme.colors.secondaryGreen} strokeWidth={2.5} />
                </View>
                <Text variant="mobileHeading22" color="textPrimary" style={{ marginBottom: 8, textAlign: 'center' }}>
                  You&apos;ve joined this task
                </Text>
                <Text variant="mobileBody" color="textSecondary" style={{ textAlign: 'center', lineHeight: 22 }}>
                  {TASK_DATA.title}
                </Text>
              </View>
              <Button
                variant="fill"
                size="lg"
                style={{ width: '100%', backgroundColor: theme.colors.foreground, borderRadius: 12 }}
                onPress={() => setSheetVisible(false)}
              >
                <Text variant="mobileLargeLabel" color="white">Go to Task</Text>
              </Button>
            </View>
          </View>
        )}

      </Box>
    </Box>
  );
}
