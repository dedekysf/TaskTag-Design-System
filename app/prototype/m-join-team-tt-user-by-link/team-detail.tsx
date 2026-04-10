import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import {
  BarChart2,
  BatteryFull,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  Key,
  Link as LinkIcon,
  LogOut,
  Pencil,
  SignalHigh,
  Star,
  Users,
  WifiHigh,
} from 'lucide-react-native';
import React, { useState } from 'react'; // useState used in MenuItem
import { Linking, Pressable, ScrollView } from 'react-native';

const TEAM = {
  name: 'Painting Team',
  logo: 'PT',
  location: 'San Francisco, CA',
  memberCount: 3,
  isPrimary: true,
  specializations: [
    'Interior Painting',
    'Exterior Painting',
    'Wallpaper Installation',
    'Drywall Repair',
  ],
};

const TEAM_MANAGEMENT = [
  { Icon: Users, title: 'Members', description: '3 members', action: 'chevron', danger: false, comingSoon: false },
  { Icon: LinkIcon, title: 'Invite to Team', description: 'Copy link to invite', action: 'copy', danger: false, comingSoon: false },
  { Icon: BarChart2, title: 'Analytics', description: 'Activity & usage insights', action: 'chevron', danger: false, comingSoon: false },
];

const PERSONAL_SETTINGS = [
  { Icon: Star, title: 'Set up as Primary', description: 'Default team for new projects', action: 'active', danger: false, comingSoon: false },
  { Icon: Key, title: 'Preferences', description: 'Manage preferences', action: 'chevron', danger: false, comingSoon: true },
  { Icon: CreditCard, title: 'Subscription', description: 'Manage team plan', action: 'chevron', danger: false, comingSoon: false },
];

function SectionLabel({ label }: { label: string }) {
  const theme = useTheme<Theme>();
  return (
    <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey05, letterSpacing: 0.8, textTransform: 'uppercase' }}>
      {label}
    </Text>
  );
}

function MenuItem({ Icon, title, description, action, danger, comingSoon, isLast, onCopy }: {
  Icon: any; title: string; description: string; action: string;
  danger: boolean; comingSoon: boolean; isLast: boolean; onCopy?: () => void;
}) {
  const theme = useTheme<Theme>();

  const handlePress = () => {
    if (action === 'copy') onCopy?.();
  };

  return (
    <Pressable disabled={comingSoon} onPress={handlePress}>
      <Box
        flexDirection="row"
        alignItems="center"
        paddingVertical="12"
        gap="12"
        borderBottomWidth={isLast ? 0 : 1}
        borderColor="border"
        style={{ opacity: comingSoon ? 0.5 : 1 }}
      >
        <Box width={48} height={48} borderRadius="8" backgroundColor="grey02" alignItems="center" justifyContent="center">
          <Icon size={22} color={danger ? theme.colors.alertRed : theme.colors.textSecondary} strokeWidth={1.75} />
        </Box>
        <Box flex={1} style={{ gap: 2 }}>
          <Text variant="mobileLabelEmphasized" style={{ color: danger ? theme.colors.alertRed : theme.colors.foreground }}>
            {title}
          </Text>
          <Text variant="mobileMetadataPrimary" color="mutedForeground">{description}</Text>
        </Box>

        {/* Right action */}
        {action === 'copy' && <Copy size={18} color={theme.colors.grey06} />}
        {action === 'chevron' && !comingSoon && (
          <ChevronRight size={18} color={theme.colors.grey06} />
        )}
        {action === 'active' && (
          <Box backgroundColor="lightMint" borderRadius="4" paddingHorizontal="8" paddingVertical="4">
            <Text variant="webMetadataSecondary" color="secondaryGreen">Active</Text>
          </Box>
        )}
        {comingSoon && (
          <Box backgroundColor="lightMint" borderRadius="4" paddingHorizontal="8" paddingVertical="4">
            <Text variant="webMetadataSecondary" color="secondaryGreen">Coming Soon</Text>
          </Box>
        )}
      </Box>
    </Pressable>
  );
}

export default function TeamDetail() {
  const theme = useTheme<Theme>();
  const [showToast, setShowToast] = useState(false);

  const handleCopy = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <Box flex={1} backgroundColor="background" style={{ position: 'relative' as any }}>

      {/* Status Bar Mock */}
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

      {/* Nav Header */}
      <Box
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="md"
        paddingVertical="12"
        backgroundColor="card"
        borderBottomWidth={1}
        borderColor="border"
        gap="4"
      >
        <Pressable hitSlop={8} style={{ padding: 4, marginRight: 4 }}>
          <ChevronLeft size={22} color={theme.colors.foreground} strokeWidth={2} />
        </Pressable>
        <Text variant="mobileLabelEmphasized" color="foreground">Team Profile</Text>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
      >

        {/* Team Card */}
        <Box
          backgroundColor="lightMint"
          borderRadius="8"
          padding="md"
          marginBottom="lg"
          style={{ position: 'relative' as any }}
        >
          <Box flexDirection="row" alignItems="center" gap="12">
            <Box
              width={80}
              height={72}
              borderRadius="8"
              backgroundColor="white"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              padding="sm"
            >
              <Image
                source={require('@/assets/images/sosa-logo.svg')}
                style={{ width: '100%', height: '100%' }}
                contentFit="contain"
              />
            </Box>
            <Box flex={1}>
              <Text variant="mobileHeading22" color="foreground" style={{ marginBottom: 4 }}>{TEAM.name}</Text>
              <Pressable onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(TEAM.location)}`)}>
                <Text variant="mobileMetadataPrimary" color="blue" style={{ textDecorationLine: 'underline' }}>
                  {TEAM.location}
                </Text>
              </Pressable>
            </Box>
          </Box>
          {/* Edit icon — top right */}
          <Pressable
            hitSlop={8}
            style={{ position: 'absolute' as any, top: 12, right: 12, width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.grey06, alignItems: 'center', justifyContent: 'center' }}
          >
            <Pencil size={13} color={theme.colors.white} strokeWidth={2} />
          </Pressable>
        </Box>

        {/* Specialisms */}
        <Box marginBottom="xl">
          <Box marginBottom="sm"><SectionLabel label="Specialisms" /></Box>
          <Box flexDirection="row" flexWrap="wrap" gap="8">
            {TEAM.specializations.map((spec, index) => (
              <Box
                key={index}
                paddingHorizontal="sm"
                paddingVertical="xs"
                borderRadius="4"
                backgroundColor="white"
                borderWidth={1}
                borderColor="border"
              >
                <Text variant="mobileMetadataPrimary" color="textSecondary">{spec}</Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Team Management */}
        <Box marginBottom="lg">
          <SectionLabel label="Team Management" />
          {TEAM_MANAGEMENT.map((item, index) => (
            <MenuItem key={item.title} {...item} isLast={index === TEAM_MANAGEMENT.length - 1} onCopy={handleCopy} />
          ))}
        </Box>

        {/* Personal Settings */}
        <Box marginBottom="lg">
          <SectionLabel label="Personal Settings" />
          {PERSONAL_SETTINGS.map((item, index) => (
            <MenuItem key={item.title} {...item} isLast={index === PERSONAL_SETTINGS.length - 1} />
          ))}
        </Box>

        {/* Leave — standalone */}
        <Pressable>
          <Box flexDirection="row" alignItems="center" paddingVertical="12" gap="12">
            <Box width={48} height={48} borderRadius="8" backgroundColor="grey02" alignItems="center" justifyContent="center">
              <LogOut size={22} color={theme.colors.alertRed} strokeWidth={1.75} />
            </Box>
            <Box flex={1} style={{ gap: 2 }}>
              <Text variant="mobileLabelEmphasized" style={{ color: theme.colors.alertRed }}>Leave team</Text>
              <Text variant="mobileMetadataPrimary" color="mutedForeground">Remove yourself from this team</Text>
            </Box>
          </Box>
        </Pressable>

      </ScrollView>

      {/* Toast */}
      {showToast && (
        <Box
          style={{ position: 'absolute' as any, bottom: 32, left: 0, right: 0, alignItems: 'center', zIndex: 999 }}
          pointerEvents="none"
        >
          <Box
            backgroundColor="grey06"
            borderRadius="8"
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10 }}
          >
            <Text style={{ fontSize: 12, color: theme.colors.white, fontFamily: 'Inter_500Medium' }}>Link copied!</Text>
          </Box>
        </Box>
      )}

      {/* Bottom Home Indicator */}
      <Box height={24} alignItems="center" justifyContent="flex-end" paddingBottom="sm">
        <Box width={134} height={5} backgroundColor="black" style={{ borderRadius: 100 }} />
      </Box>
    </Box>
  );
}
