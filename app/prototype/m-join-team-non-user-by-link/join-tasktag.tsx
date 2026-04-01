import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { BatteryFull, ChevronRight, Hammer, Link, Lock, PieChart, Share, SignalHigh, Star, UserPlus, Users, WifiHigh, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';

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

export default function JoinTasktag() {
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
            <SignalHigh size={15} color={TTTheme.colors.foreground} strokeWidth={2.5} />
            <WifiHigh size={15} color={TTTheme.colors.foreground} strokeWidth={2.5} />
            <BatteryFull size={22} color={TTTheme.colors.foreground} strokeWidth={2} />
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
            <Lock size={12} color={TTTheme.colors.grey05} />
            <Text variant="caption" color="foreground" style={{ fontSize: 14, fontWeight: '500' }}>tasktag.com</Text>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>

          {/* Team Info Box */}
          <Box backgroundColor="card" borderRadius="xl" overflow="hidden" marginBottom="sm">
            <Box backgroundColor="card" paddingHorizontal="md" paddingVertical="md" flexDirection="row" alignItems="center" gap="md" borderBottomWidth={1} borderColor="border">
              <Box
                width={40}
                height={40}
                borderRadius="8"
                alignItems="center"
                justifyContent="center"
                style={{ backgroundColor: TTTheme.colors.purple }}
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
              <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.blue, marginTop: 4 }}>{TEAM.location}</Text>
            </Box>
            <SkillsRow skills={TEAM.skills} />
          </Box>

          {/* Invitation Banner */}
          <Box
            backgroundColor="black"
            borderRadius="xl"
            padding="md"
            marginBottom="sm"
            alignItems="center"
            gap="sm"
          >
            <Box
              width={40}
              height={40}
              borderRadius="full"
              alignItems="center"
              justifyContent="center"
              style={{ backgroundColor: 'rgba(0,217,165,0.15)' }}
            >
              <Share size={20} color="#00D9A5" strokeWidth={1.5} />
            </Box>
            <Text variant="webLabelEmphasized" color="white" textAlign="center">
              Someone shared this team with you
            </Text>
            <Text variant="webMetadataPrimary" color="white" textAlign="center" style={{ opacity: 0.7 }}>
              The team owner is waiting for your request.
            </Text>
            <Button
              variant="fill"
              size="lg"
              style={{ backgroundColor: '#18A87D', width: '100%', marginTop: 4 }}
              onPress={() => router.push('/prototype/m-join-team-non-user-by-link/join-tasktag-signup')}
            >
              <Text variant="labelMedium" color="white">Request to Join</Text>
            </Button>
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
                    <Text
                      variant="webLabelEmphasized"
                      style={{ color: item.labelColor ?? TTTheme.colors.grey05 }}
                    >
                      {item.label}
                    </Text>
                    <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.grey04, marginTop: 2 }}>
                      {item.subtitle}
                    </Text>
                  </Box>
                  <Box flexDirection="row" alignItems="center" gap="8">
                    {item.badge ? (
                      <Box style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: TTTheme.colors.lightMint }}>
                        <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.secondaryGreen, fontWeight: '500' }}>
                          {item.badge}
                        </Text>
                      </Box>
                    ) : null}
                    <ChevronRight size={18} color={TTTheme.colors.grey04} strokeWidth={2} />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

        </ScrollView>
      </Box>
    </Box>
  );
}

function SkillsRow({ skills }: { skills: string[] }) {
  return (
    <Box paddingHorizontal="md" paddingTop="sm" paddingBottom="md">
      <Text variant="webLabelEmphasized" marginBottom="sm">Skills</Text>
      <Box flexDirection="row" flexWrap="wrap" style={{ gap: 8 }}>
        {skills.map((skill, i) => (
          <Box
            key={i}
            style={{ backgroundColor: TTTheme.colors.grey02, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}
          >
            <Text variant="webMetadataPrimary" color="mutedForeground">{skill}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
