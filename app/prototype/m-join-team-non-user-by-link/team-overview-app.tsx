import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { BatteryFull, ChevronLeft, ChevronRight, Hammer, Key, Link, LogOut, PieChart, SignalHigh, Star, Users, WifiHigh, X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

const TEAM = {
  name: 'Scott 1',
  id: '6771',
  location: '11 N Raintree Hollow Court',
  skills: ['Access Doors', 'Access Control Systems', 'Acoustical Ceiling Restoration'],
};

type MenuItem = {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  subtitle: string;
  labelColor?: string;
  badge?: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    icon: <Zap size={22} color={TTTheme.colors.secondaryGreen} strokeWidth={1.5} />,
    iconBg: TTTheme.colors.lightMint,
    label: 'Subscription Plans',
    subtitle: 'Enjoy more features!',
  },
  {
    icon: <Users size={22} color={TTTheme.colors.grey06} strokeWidth={1.5} />,
    iconBg: TTTheme.colors.grey03,
    label: 'Members',
    subtitle: 'Add or remove members',
  },
  {
    icon: <Star size={22} color={TTTheme.colors.grey06} strokeWidth={1.5} />,
    iconBg: TTTheme.colors.grey03,
    label: 'Set up as Primary',
    subtitle: 'Default Team for new projects',
  },
  {
    icon: <PieChart size={22} color={TTTheme.colors.grey06} strokeWidth={1.5} />,
    iconBg: TTTheme.colors.grey03,
    label: 'Analytics',
    subtitle: 'See how the storage is used',
  },
  {
    icon: <Link size={22} color={TTTheme.colors.grey06} strokeWidth={1.5} />,
    iconBg: TTTheme.colors.grey03,
    label: 'Invite to Team',
    subtitle: 'Invite to team via link',
  },
  {
    icon: <Key size={22} color={TTTheme.colors.grey06} strokeWidth={1.5} />,
    iconBg: TTTheme.colors.grey03,
    label: 'Preferences',
    subtitle: 'Manage preferences',
    badge: 'Coming Soon',
  },
  {
    icon: <LogOut size={22} color={TTTheme.colors.grey06} strokeWidth={1.5} />,
    iconBg: TTTheme.colors.grey03,
    label: 'Leave',
    subtitle: 'Leave the team',
    labelColor: TTTheme.colors.alertRed,
  },
];

export default function TeamOverviewBrowser() {
  const theme = useTheme<Theme>();
  const [bannerVisible, setBannerVisible] = useState(true);
  const [bannerVisible2, setBannerVisible2] = useState(true);

  return (
    <Box flex={1} backgroundColor="grey02">

        {/* Status Bar */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="xl"
          paddingTop="md"
          paddingBottom="sm"
          backgroundColor="card"
        >
          <Text color="foreground" style={{ fontWeight: '600', fontSize: 15, paddingLeft: 8 }}>9:41</Text>
          <Box flexDirection="row" alignItems="center" gap="8" paddingRight="8">
            <SignalHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
            <WifiHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
            <BatteryFull size={22} color={theme.colors.foreground} strokeWidth={2} />
          </Box>
        </Box>

        {/* App Header — 44px */}
        <Box
          flexDirection="row"
          alignItems="center"
          height={44}
          paddingHorizontal="md"
          backgroundColor="card"
          borderBottomWidth={1}
          borderColor="border"
        >
          <Pressable style={{ marginRight: 8 }}>
            <ChevronLeft size={24} color={theme.colors.foreground} />
          </Pressable>
          <Box flex={1}>
            <Text variant="webLargeLabel" color="textPrimary">{TEAM.name}</Text>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

          {/* Team Info Box */}
          <Box backgroundColor="card" borderRadius="xl" overflow="hidden" marginBottom="sm">
            <Box backgroundColor="card" paddingHorizontal="md" paddingVertical="md" flexDirection="row" alignItems="center" gap="md" borderBottomWidth={1} borderColor="border">
              <Box
                width={40}
                height={40}
                borderRadius="8"
                alignItems="center"
                justifyContent="center"
                style={{ backgroundColor: theme.colors.purple }}
              >
                <Hammer size={20} color="#fff" strokeWidth={1.5} />
              </Box>
              <Box>
                <Text variant="webLabelEmphasized">{TEAM.name}</Text>
                <Text variant="webMetadataPrimary" color="mutedForeground" style={{ marginTop: 2 }}>ID : {TEAM.id}</Text>
              </Box>
            </Box>

            <Box paddingHorizontal="md" paddingVertical="sm">
              <Text variant="webLabelEmphasized">Location</Text>
              <Text variant="webSecondaryBody" style={{ color: theme.colors.blue, marginTop: 4 }}>{TEAM.location}</Text>
            </Box>
            <SkillsRow skills={TEAM.skills} />
          </Box>

          {/* Menu Items */}
          <Box borderRadius="xl" overflow="hidden" marginBottom="sm">
            {MENU_ITEMS.map((item, index) => (
              <Box key={index}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  paddingVertical="md"
                  gap="md"
                >
                  <Box
                    width={52}
                    height={52}
                    borderRadius="12"
                    alignItems="center"
                    justifyContent="center"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    {item.icon}
                  </Box>
                  <Box flex={1}>
                    <Text variant="webLabelEmphasized" style={{ color: item.labelColor ?? theme.colors.textSecondary }}>
                      {item.label}
                    </Text>
                    <Text variant="webMetadataPrimary" style={{ color: theme.colors.textSecondary, marginTop: 2 }}>
                      {item.subtitle}
                    </Text>
                  </Box>
                  <Box flexDirection="row" alignItems="center" gap="8">
                    {item.badge ? (
                      <Box style={{ backgroundColor: theme.colors.lightMint, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                        <Text variant="webMetadataPrimary" style={{ color: theme.colors.secondaryGreen }}>{item.badge}</Text>
                      </Box>
                    ) : null}
                    <ChevronRight size={18} color={theme.colors.grey06} strokeWidth={2} />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

        </ScrollView>

        {/* Dev Note Banner */}
        {bannerVisible && (
          <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: '#fbe676', borderRadius: 12, padding: 16, gap: 4, zIndex: 40 }}>
            <Pressable
              onPress={() => setBannerVisible(false)}
              style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <X size={16} color="#000" />
            </Pressable>
            <Text variant="webLabelEmphasized" style={{ color: '#000' }}>Note for Dev</Text>
            <Text variant="webMetadataPrimary" style={{ color: '#000', lineHeight: 18, paddingRight: 20 }}>
              After tapping view team, if already installed app then open app, if not direct to app/play store.
            </Text>
          </View>
        )}

        {/* Dev Note Banner 2 — Chat bubble */}
        {bannerVisible2 && (
          <View style={{ position: 'absolute', bottom: bannerVisible ? 120 : 16, left: 16, right: 16, backgroundColor: '#fbe676', borderRadius: 12, padding: 16, gap: 4, zIndex: 40 }}>
            <Pressable
              onPress={() => setBannerVisible2(false)}
              style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <X size={16} color="#000" />
            </Pressable>
            <Text variant="webLabelEmphasized" style={{ color: '#000' }}>Note for Dev</Text>
            <Text variant="webMetadataPrimary" style={{ color: '#000', lineHeight: 18, paddingRight: 20 }}>
              Make sure the user gets the member activity chat bubble from the team owner — "You've been added to Painting Team team".
            </Text>
          </View>
        )}

    </Box>
  );
}

function SkillsRow({ skills }: { skills: string[] }) {
  const theme = useTheme<Theme>();
  return (
    <Box paddingHorizontal="md" paddingTop="sm" paddingBottom="md">
      <Text variant="webLabelEmphasized" marginBottom="sm">Skills</Text>
      <Box flexDirection="row" flexWrap="wrap" style={{ gap: 8 }}>
        {skills.map((skill, i) => (
          <Box
            key={i}
            style={{ backgroundColor: theme.colors.grey02, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}
          >
            <Text variant="webMetadataPrimary" color="mutedForeground">{skill}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
