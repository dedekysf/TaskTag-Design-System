import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { BatteryFull, ChevronRight, Hammer, Link, Lock, PieChart, SignalHigh, Star, Users, WifiHigh, Zap } from 'lucide-react-native';
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
    icon: <Zap size={22} color={TTTheme.colors.grey04} strokeWidth={1.5} />,
    iconBg: TTTheme.colors.grey03,
    label: 'Subscription Plans',
    subtitle: 'Enjoy more features!',
  },
  {
    icon: <Users size={22} color={TTTheme.colors.grey04} strokeWidth={1.5} />,
    iconBg: TTTheme.colors.grey03,
    label: 'Members',
    subtitle: 'Add or remove members',
  },
  {
    icon: <Star size={22} color={TTTheme.colors.grey04} strokeWidth={1.5} />,
    iconBg: TTTheme.colors.grey03,
    label: 'Set up as Primary',
    subtitle: 'Default Team for new projects',
  },
  {
    icon: <PieChart size={22} color={TTTheme.colors.grey04} strokeWidth={1.5} />,
    iconBg: TTTheme.colors.grey03,
    label: 'Analytics',
    subtitle: 'See how the storage is used',
  },
  {
    icon: <Link size={22} color={TTTheme.colors.grey04} strokeWidth={1.5} />,
    iconBg: TTTheme.colors.grey03,
    label: 'Invite to Team',
    subtitle: 'Invite to team via link',
  },
];

export default function TeamOverviewBrowser() {
  const theme = useTheme<Theme>();
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <Box flex={1} backgroundColor="background" alignItems="center">
      <Box flex={1} width="100%" maxWidth={480} backgroundColor="grey02">

        {/* Status Bar Mock */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="xl"
          paddingTop="md"
          paddingBottom="sm"
          backgroundColor="background"
        >
          <Text color="foreground" style={{ fontWeight: '600', fontSize: 15, paddingLeft: 8 }}>9:41</Text>
          <Box flexDirection="row" alignItems="center" gap="8" style={{ paddingRight: 8 }}>
            <SignalHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
            <WifiHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
            <BatteryFull size={22} color={theme.colors.foreground} strokeWidth={2} />
          </Box>
        </Box>

        {/* Browser Header Mock */}
        <Box
          paddingHorizontal="md"
          paddingBottom="sm"
          backgroundColor="background"
          borderBottomWidth={1}
          borderColor="border"
        >
          <Box flexDirection="row" alignItems="center" justifyContent="center" backgroundColor="grey02" paddingHorizontal="12" paddingVertical="12" style={{ borderRadius: 8 }} gap="8">
            <Lock size={12} color={theme.colors.grey05} />
            <Text variant="caption" color="foreground" style={{ fontSize: 14, fontWeight: '500' }}>tasktag.com</Text>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 220 }}>

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
                    <Text variant="webLabelEmphasized" style={{ color: item.labelColor ?? theme.colors.grey05 }}>
                      {item.label}
                    </Text>
                    <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey04, marginTop: 2 }}>
                      {item.subtitle}
                    </Text>
                  </Box>
                  <ChevronRight size={18} color={theme.colors.grey04} strokeWidth={2} />
                </Box>
              </Box>
            ))}
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
