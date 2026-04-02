import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { Image as ExpoImage } from 'expo-image';
import { useTheme } from '@shopify/restyle';
import { BatteryFull, Lock, MoreHorizontal, SignalHigh, WifiHigh } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

const TEAM = {
  name: 'Painting Team',
  id: '6771',
};

const STATS = [
  { value: '12', label: 'Total Projects' },
  { value: '60', label: 'Total Tasks' },
];

const COMPLETION = { done: 48, total: 60 };

const MEMBERS = [
  { initials: 'OH', name: 'Oscar H.',   email: 'oscaar@email.com',   role: 'Admin', color: '#18a87d', isInvited: true },
  { initials: 'JR', name: 'Jamie R.',  email: 'jamie.r@email.com',  role: 'Owner', color: '#e65100' },
  { initials: 'AL', name: 'Alex L.',   email: 'alex.l@email.com',   role: 'Member', color: '#388e3c' },
  { initials: 'MK', name: 'Morgan K.', email: 'morgan.k@email.com', role: 'Member', color: '#7b1fa2' },
];

export default function TeamOverviewBrowser() {
  const theme = useTheme<Theme>();
  const [bannerVisible, setBannerVisible] = useState(true);
  const progress = COMPLETION.done / COMPLETION.total;

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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 200 }}>

          {/* Team Header */}
          <Box paddingHorizontal="md" paddingVertical="md" backgroundColor="background">
            <Box flexDirection="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Text variant="webLargeLabel" color="textPrimary">{TEAM.name}</Text>
                <Text variant="webMetadataPrimary" color="grey05" style={{ marginTop: 2 }}>
                  Team ID · {TEAM.id}
                </Text>
              </Box>
              <ExpoImage
                source={require('@/assets/images/sosa-logo.svg')}
                style={{ width: 120, height: 48 }}
                contentFit="contain"
              />
            </Box>
          </Box>

          <Box padding="md" gap="32">

            {/* Overview Section */}
            <Box>
              <Text
                variant="webLabelSmall" color="textSecondary" marginBottom="8"
                style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}
              >
                Overview
              </Text>

              {/* Stat Cards */}
              <Box flexDirection="row" gap="12" marginBottom="12">
                {STATS.map((stat, i) => (
                  <Box
                    key={i} flex={1} backgroundColor="card" borderRadius="xl" padding="md"
                  >
                    <Text variant="h1" color="textPrimary" marginBottom="xs">{stat.value}</Text>
                    <Text variant="webBody" color="textSecondary">{stat.label}</Text>
                  </Box>
                ))}
              </Box>

              {/* Task Completion */}
              <Box backgroundColor="card" borderRadius="xl" padding="md">
                <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="8">
                  <Text variant="webBody" color="textPrimary">Task completion</Text>
                  <Text variant="webMetadataPrimary">
                    <Text color="secondaryGreen" fontWeight="600">{COMPLETION.done}</Text>
                    <Text color="textSecondary"> / {COMPLETION.total}</Text>
                  </Text>
                </Box>
                <Box height={6} backgroundColor="grey03" borderRadius="4">
                  <Box
                    height={6} backgroundColor="secondaryGreen" borderRadius="4"
                    style={{ width: `${progress * 100}%` as any }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Members Section */}
            <Box>
              <Text
                variant="webLabelSmall" color="textSecondary" marginBottom="8"
                style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}
              >
                Members
              </Text>
              <Box backgroundColor="card" borderRadius="xl" style={{ overflow: 'hidden' }}>
                {MEMBERS.map((member, i) => (
                  <Box key={i}>
                    <Box
                      flexDirection="row" alignItems="center" gap="12"
                      paddingHorizontal="md" paddingVertical="12"
                    >
                      {/* Avatar */}
                      <Box
                        width={36} height={36} borderRadius="full"
                        alignItems="center" justifyContent="center"
                        style={{ backgroundColor: member.color }}
                      >
                        <Text variant="webLabelSmall" color="white">{member.initials}</Text>
                      </Box>

                      {/* Info */}
                      <Box flex={1}>
                        <Text variant="webLabelEmphasized" color="textPrimary">{member.name}</Text>
                        <Text variant="webMetadataPrimary" color="grey05" style={{ marginTop: 2 }}>{member.email}</Text>
                      </Box>

                      {/* Role */}
                      <Text 
                        variant="webMetadataPrimary" 
                        color={member.isInvited ? 'secondaryGreen' : 'textSecondary'}
                        style={{ fontWeight: member.isInvited ? '600' : 'normal' }}
                      >
                        {member.role}
                      </Text>
                    </Box>
                    {i < MEMBERS.length - 1 && (
                      <Box height={1} backgroundColor="border" marginHorizontal="md" />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

          </Box>
        </ScrollView>

        {/* Dev Note Banner */}
        {bannerVisible && (
          <View style={{ position: 'absolute', bottom: 220, left: 16, right: 16, backgroundColor: '#fbe676', borderRadius: 12, padding: 16, gap: 4, zIndex: 40 }}>
            <Pressable
              onPress={() => setBannerVisible(false)}
              style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Text variant="webLabelEmphasized" style={{ color: '#000', fontSize: 16, lineHeight: 16 }}>×</Text>
            </Pressable>
            <Text variant="webLabelEmphasized" style={{ color: '#000' }}>Note for Dev</Text>
            <Text variant="webMetadataPrimary" style={{ color: '#000', lineHeight: 18, paddingRight: 20 }}>
              After user presses Join This Team on previous page, if already have the app open it. If not, direct to this page.
            </Text>
          </View>
        )}

        {/* Fixed Bottom Download Banner */}
        <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: '#000000', borderRadius: 12, padding: 16, zIndex: 10 }}>
          <View style={{ marginBottom: 4 }}>
            <Text variant="webLabelEmphasized" color="white">Welcome to the team!</Text>
          </View>
          <Text variant="webSecondaryBody" style={{ color: '#E0E0E0', marginBottom: 16, lineHeight: 20 }}>
            You've been added to the team. Download the app to jump in, create tasks, and stay in the loop.
          </Text>
          <Button
            variant="fill"
            size="lg"
            style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen, borderRadius: 8 }}
            onPress={() => { if (typeof window !== 'undefined') window.open('https://play.google.com/store/apps/details?id=com.eloveit.TaskTag', '_blank'); }}
          >
            <Text variant="webLabelEmphasized" color="white">Download App</Text>
          </Button>
        </View>

      </Box>
    </Box>
  );
}
