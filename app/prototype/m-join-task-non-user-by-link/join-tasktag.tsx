import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { BatteryFull, Lock, MoreHorizontal, SignalHigh, Users, WifiHigh } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

const TEAM = {
  name: 'Painting Team',
  description: '3 members on this team.',
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

        {/* TaskTag Logo + Sign Up */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' }}>
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ width: 100, height: 30 }}
            resizeMode="contain"
          />
          <Pressable onPress={() => router.push('/prototype/m-join-team-non-user-by-link/join-tasktag-signup')}>
            <Text variant="webSecondaryBody" style={{ fontSize: 14, color: theme.colors.secondaryGreen, fontWeight: '600' }}>Sign Up</Text>
          </Pressable>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40, paddingHorizontal: 16, paddingTop: 24 }}>

          {/* Heading */}
          <Text variant="h1" color="foreground" style={{ marginBottom: 8, fontSize: 28, textAlign: 'center' }}>
            You're invited to join
          </Text>

          {/* Team Card — light gray surface, generous logo breathing room */}
          <View style={{ backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 24, marginBottom: 24, alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' }}>
            <Image
              source={require('@/assets/images/sosa-logo.svg')}
              style={{ width: 160, height: 80, borderRadius: 8 }}
              resizeMode="contain"
            />
            <Box alignItems="center" style={{ gap: 8 }}>
              <Text variant="h1" color="foreground" style={{ textAlign: 'center', fontSize: 32 }}>{TEAM.name}</Text>
              <Box flexDirection="row" alignItems="center" style={{ gap: 6 }}>
                <Users size={14} color={theme.colors.textSecondary} strokeWidth={2} />
                <Text variant="webSecondaryBody" color="textSecondary">{TEAM.description}</Text>
              </Box>
            </Box>
          </View>

          {/* Request to Join Button */}
          <Pressable
            style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}
            onPress={() => router.push('/prototype/m-join-team-non-user-by-link/join-tasktag-signup')}
          >
            <Text variant="webLabelEmphasized" color="white">Request to Join</Text>
          </Pressable>

          <Text variant="webMetadataPrimary" color="textSecondary" style={{ textAlign: 'center', marginBottom: 20 }}>
            A Team admin will receive your request after sign up.
          </Text>

          {/* Already on TaskTag */}
          <Box flexDirection="row" justifyContent="center" style={{ gap: 4, marginTop: 24 }}>
            <Text variant="webSecondaryBody" color="textSecondary">Already on TaskTag?</Text>
            <Pressable>
              <Text variant="webSecondaryBody" style={{ color: theme.colors.secondaryGreen, fontWeight: '600' }}>Log in</Text>
            </Pressable>
          </Box>


        </ScrollView>

      </Box>
    </Box>
  );
}
