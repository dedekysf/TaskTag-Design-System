import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Clock, Lock, MoreHorizontal, BatteryFull, SignalHigh, WifiHigh } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View, Image } from 'react-native';

const TEAM = {
  name: 'Painting Team',
  id: '6771',
};

const MEMBERS = [
  { initials: 'JR', name: 'Jamie R.',  role: 'Owner',  color: '#e65100' },
  { initials: 'AL', name: 'Alex L.',   role: 'Member', color: '#388e3c' },
  { initials: 'MK', name: 'Morgan K.', role: 'Member', color: '#7b1fa2' },
];

export default function TeamOverviewBrowser() {
  const theme = useTheme<Theme>();

  return (
    <Box flex={1} backgroundColor="background" alignItems="center">
      <Box flex={1} width="100%" maxWidth={480} backgroundColor="grey02">

        {/* Status Bar */}
        <Box
          flexDirection="row" alignItems="center" justifyContent="space-between"
          paddingHorizontal="xl" paddingTop="md" paddingBottom="sm"
          backgroundColor="card"
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
          backgroundColor="card" borderBottomWidth={1} borderColor="border"
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

          {/* Header */}
          <Box
            backgroundColor="card"
            alignItems="center"
            style={{ paddingTop: 32, paddingBottom: 32, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
          >
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: theme.colors.grey02, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Clock size={40} color={theme.colors.textSecondary} strokeWidth={2} />
            </View>
            <Text variant="h2" style={{ color: theme.colors.foreground, textAlign: 'center', marginBottom: 2 }}>
              Request Sent!
            </Text>
            <Text variant="webSecondaryBody" style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
              You'll be notified when it's approved.
            </Text>
          </Box>

          {/* White Card */}
          <Box backgroundColor="card" borderRadius="xl" margin="md" style={{ overflow: 'hidden' }}>

            {/* Team Identity */}
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="12" padding="md">
              <Box>
                <Text variant="webLargeLabel" color="foreground">{TEAM.name}</Text>
                <Text variant="webMetadataPrimary" color="grey05" style={{ fontSize: 14 }}>ID: {TEAM.id}</Text>
              </Box>
              <Image
                source={require('@/assets/images/sosa-logo.svg')}
                style={{ width: 80, height: 44, borderRadius: 8 }}
                resizeMode="contain"
              />
            </Box>

            <Box height={1} backgroundColor="grey03" />

            {/* Members */}
            {MEMBERS.map((member, i) => (
              <Box key={i}>
                <Box flexDirection="row" alignItems="center" gap="12" paddingHorizontal="md" paddingVertical="12">
                  <Box
                    width={36} height={36} borderRadius="full"
                    alignItems="center" justifyContent="center"
                    style={{ backgroundColor: member.color }}
                  >
                    <Text variant="webLabelSmall" color="white">{member.initials}</Text>
                  </Box>
                  <Box flex={1} style={{ gap: 4 }}>
                    <Text variant="webSecondaryBody" color="foreground" style={{ fontSize: 16 }}>{member.name}</Text>
                    <Text variant="webMetadataPrimary" color="grey05" style={{ fontSize: 12 }}>{member.role}</Text>
                  </Box>
                </Box>
                {i < MEMBERS.length - 1 && <Box height={1} backgroundColor="grey02" marginHorizontal="md" />}
              </Box>
            ))}
          </Box>

        </ScrollView>

        {/* Fixed Bottom Black Banner */}
        <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 40 }}>
          <View style={{ backgroundColor: '#000000', borderRadius: 12, padding: 20 }}>
            <View style={{ marginBottom: 4 }}>
              <Text variant="webLabelEmphasized" color="white">You're almost in!</Text>
            </View>
            <Text variant="webSecondaryBody" style={{ color: '#E0E0E0', marginBottom: 16, lineHeight: 20 }}>
              Your request to join this team is pending approval. Download the app to jump in, create tasks, and stay in the loop.
            </Text>
            <Pressable
              style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen, borderRadius: 8, height: 48, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => { if (typeof window !== 'undefined') (window as any).open('https://play.google.com/store/apps/details?id=com.eloveit.TaskTag', '_blank'); }}
            >
              <Text variant="webLabelEmphasized" color="white">Download App</Text>
            </Pressable>
          </View>
        </View>


      </Box>
    </Box>
  );
}
